/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnCondition, Fn, IResolvable } from "aws-cdk-lib";
import {
    AccessLogFormat,
    AuthorizationType,
    CfnAuthorizer,
    CfnMethod,
    Cors,
    LambdaIntegration,
    LogGroupLogDestination,
    Method,
    MethodOptions,
    RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { AnyPrincipal, Effect, PolicyDocument, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Function } from "aws-cdk-lib/aws-lambda";
import { CfnLogGroup, LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface ApiProps {
    apiFunction: Function;
    publicApiFunction: Function;
    cognitoUserPoolArn: string;
    authenticationRequiredCond: CfnCondition;
}

export class BackendApi extends Construct {
    public readonly api: RestApi;

    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id);

        const apiIntegration = new LambdaIntegration(props.apiFunction, {
            allowTestInvoke: false,
        });

        const publicApiIntegration = new LambdaIntegration(props.publicApiFunction, {
            allowTestInvoke: false,
        });

        const apiPolicy = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ["execute-api:Invoke"],
                    resources: ["execute-api:/prod/*/*"],
                    principals: [new AnyPrincipal()],
                    conditions: {
                        IpAddress: {
                            "aws:SourceIp": ["0.0.0.0/0"],
                        },
                    },
                }),

                // Need to change this policy for ingest API with specific values
                new PolicyStatement({
                    effect: Effect.DENY,
                    actions: ["execute-api:Invoke"],
                    resources: ["execute-api:/prod/*/ingestapi/*"],
                    principals: [new AnyPrincipal()],
                    conditions: {
                        IpAddress: {
                            "aws:SourceIp": ["0.0.0.0/0"],
                        },
                    },
                }),
            ],
        });

        const apigatewayLogGroup = new LogGroup(scope, "ApiAccessLogs", {
            retention: RetentionDays.TEN_YEARS,
        });
        const logGroup: CfnLogGroup = apigatewayLogGroup.node.findChild("Resource") as CfnLogGroup;
        logGroup.cfnOptions.metadata = {
            cfn_nag: {
                rules_to_suppress: [
                    {
                        id: "W84",
                        reason: "CloudWatchLogs LogGroup are encrypted by default.  There are no customer requirements to use KMS in this case, and there is a business goal to keep cost low.",
                    },
                ],
            },
        };

        this.api = new RestApi(scope, "ApiGateway", {
            description: "Performance Dashboard backend API",
            deployOptions: {
                tracingEnabled: true,
                accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
                accessLogDestination: new LogGroupLogDestination(apigatewayLogGroup),
            },
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
            },
            policy: apiPolicy,
        });

        const authorizer = new CfnAuthorizer(scope, "CognitoAuth", {
            type: AuthorizationType.COGNITO,
            name: "cognito-authorizer",
            restApiId: this.api.restApiId,
            providerArns: [props.cognitoUserPoolArn],
            identitySource: "method.request.header.Authorization",
        });

        this.addPrivateEndpoints(apiIntegration, authorizer);
        this.addPublicEndpoints(publicApiIntegration, authorizer, props.authenticationRequiredCond);

        this.api.addApiKey("PerfDashIngestApiKey");
        const plan = this.api.addUsagePlan("PerfDashIngestUsagePlan", {
            name: "PerfDashIngestUsagePlan",
            throttle: {
                rateLimit: 25,
                burstLimit: 50,
            },
        });

        plan.addApiStage({
            api: this.api,
            stage: this.api.deploymentStage,
        });
    }

    private assign_authorizer(
        method: Method,
        authenticationType: IResolvable,
        authorizerId: IResolvable,
    ) {
        const apimethod: CfnMethod = method.node.findChild("Resource") as CfnMethod;
        apimethod.authorizationType = authenticationType.toString();
        apimethod.authorizerId = authorizerId.toString();
        return method;
    }

    // Suppress cfn_nag Warn W59: AWS::ApiGateway::Method should not have AuthorizationType set to 'NONE' unless it is of HttpMethod: OPTIONS.
    private cfn_nag_warn_w59(method: Method) {
        const apimethod: CfnMethod = method.node.findChild("Resource") as CfnMethod;
        apimethod.cfnOptions.metadata = {
            cfn_nag: {
                rules_to_suppress: [
                    {
                        id: "W59",
                        reason: "AuthorizationType set to None because using API Key and API Gateway resource policy",
                    },
                ],
            },
        };
        return method;
    }

    private addPrivateEndpoints(apiIntegration: LambdaIntegration, authorizer: CfnAuthorizer) {
        // Defined resource props to the top level resources and they automatically
        // get applied recursively to their children endpoints.
        const methodProps: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: authorizer.ref },
        };

        const dashboards = this.api.root.addResource("dashboard");
        dashboards.addMethod("GET", apiIntegration, methodProps);
        dashboards.addMethod("POST", apiIntegration, methodProps);
        dashboards.addMethod("DELETE", apiIntegration, methodProps);

        const dashboard = dashboards.addResource("{id}");
        dashboard.addMethod("GET", apiIntegration, methodProps);
        dashboard.addMethod("PUT", apiIntegration, methodProps);
        dashboard.addMethod("POST", apiIntegration, methodProps);
        dashboard.addMethod("DELETE", apiIntegration, methodProps);

        const auditLogs = dashboard.addResource("auditlogs");
        auditLogs.addMethod("GET", apiIntegration, methodProps);

        const versions = dashboard.addResource("versions");
        versions.addMethod("GET", apiIntegration, methodProps);

        const widgetorder = dashboard.addResource("widgetorder");
        widgetorder.addMethod("PUT", apiIntegration, methodProps);

        const publish = dashboard.addResource("publish");
        publish.addMethod("PUT", apiIntegration, methodProps);

        const publishPending = dashboard.addResource("publishpending");
        publishPending.addMethod("PUT", apiIntegration, methodProps);

        const archive = dashboard.addResource("archive");
        archive.addMethod("PUT", apiIntegration, methodProps);

        const draft = dashboard.addResource("draft");
        draft.addMethod("PUT", apiIntegration, methodProps);

        const widgets = dashboard.addResource("widget");
        widgets.addMethod("POST", apiIntegration, methodProps);

        const copy = dashboard.addResource("copy");
        copy.addMethod("POST", apiIntegration, methodProps);

        const widget = widgets.addResource("{widgetId}");
        widget.addMethod("GET", apiIntegration, methodProps);
        widget.addMethod("POST", apiIntegration, methodProps);
        widget.addMethod("PUT", apiIntegration, methodProps);
        widget.addMethod("DELETE", apiIntegration, methodProps);

        const topicareas = this.api.root.addResource("topicarea");
        topicareas.addMethod("GET", apiIntegration, methodProps);
        topicareas.addMethod("POST", apiIntegration, methodProps);

        const topicarea = topicareas.addResource("{id}");
        topicarea.addMethod("GET", apiIntegration, methodProps);
        topicarea.addMethod("PUT", apiIntegration, methodProps);
        topicarea.addMethod("DELETE", apiIntegration, methodProps);

        const datasets = this.api.root.addResource("dataset");
        datasets.addMethod("GET", apiIntegration, methodProps);
        datasets.addMethod("POST", apiIntegration, methodProps);

        const dataset = datasets.addResource("{id}");
        dataset.addMethod("GET", apiIntegration, methodProps);

        const settings = this.api.root.addResource("settings");
        settings.addMethod("GET", apiIntegration, methodProps);
        settings.addMethod("PUT", apiIntegration, methodProps);

        const publishedSite = settings.addResource("homepage");
        publishedSite.addMethod("GET", apiIntegration, methodProps);
        publishedSite.addMethod("PUT", apiIntegration, methodProps);

        const user = this.api.root.addResource("user");
        user.addMethod("GET", apiIntegration, methodProps);
        user.addMethod("POST", apiIntegration, methodProps);
        user.addMethod("DELETE", apiIntegration, methodProps);

        const resendInvite = user.addResource("invite");
        resendInvite.addMethod("POST", apiIntegration, methodProps);

        const changeRole = user.addResource("role");
        changeRole.addMethod("PUT", apiIntegration, methodProps);

        const ingestApi = this.api.root.addResource("ingestapi");
        const ingestApiDatasets = ingestApi.addResource("dataset");
        this.cfn_nag_warn_w59(
            ingestApiDatasets.addMethod("POST", apiIntegration, {
                apiKeyRequired: true,
            }),
        );

        const ingestApiDataset = ingestApiDatasets.addResource("{id}");
        this.cfn_nag_warn_w59(
            ingestApiDataset.addMethod("PUT", apiIntegration, {
                apiKeyRequired: true,
            }),
        );
        this.cfn_nag_warn_w59(
            ingestApiDataset.addMethod("DELETE", apiIntegration, {
                apiKeyRequired: true,
            }),
        );
    }

    private addPublicEndpoints(
        apiIntegration: LambdaIntegration,
        authorizer: CfnAuthorizer,
        authenticationRequiredCond: CfnCondition,
    ) {
        const authorizationTypeValue = Fn.conditionIf(
            authenticationRequiredCond.logicalId,
            AuthorizationType.COGNITO,
            "",
        );
        const authorizerIdValue = Fn.conditionIf(
            authenticationRequiredCond.logicalId,
            authorizer.ref,
            "",
        );

        // Public endpoints that do not require authentication if auth is not required.
        const publicapi = this.api.root.addResource("public");
        const dashboards = publicapi.addResource("dashboard");
        const friendlyURLs = dashboards.addResource("friendly-url");

        const dashboard = dashboards.addResource("{id}");
        this.cfn_nag_warn_w59(
            this.assign_authorizer(
                dashboard.addMethod("GET", apiIntegration),
                authorizationTypeValue,
                authorizerIdValue,
            ),
        );

        const byfriendlyURL = friendlyURLs.addResource("{friendlyURL}");
        this.cfn_nag_warn_w59(
            this.assign_authorizer(
                byfriendlyURL.addMethod("GET", apiIntegration),
                authorizationTypeValue,
                authorizerIdValue,
            ),
        );

        const homepage = publicapi.addResource("homepage");
        this.cfn_nag_warn_w59(
            this.assign_authorizer(
                homepage.addMethod("GET", apiIntegration),
                authorizationTypeValue,
                authorizerIdValue,
            ),
        );

        const settings = publicapi.addResource("settings");
        this.cfn_nag_warn_w59(
            this.assign_authorizer(
                settings.addMethod("GET", apiIntegration),
                authorizationTypeValue,
                authorizerIdValue,
            ),
        );

        const search = publicapi.addResource("search");
        this.cfn_nag_warn_w59(
            this.assign_authorizer(
                search.addMethod("GET", apiIntegration),
                authorizationTypeValue,
                authorizerIdValue,
            ),
        );
    }
}
