import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as logs from "@aws-cdk/aws-logs";
import {
  AnyPrincipal,
  Effect,
  PolicyDocument,
  PolicyStatement,
} from "@aws-cdk/aws-iam";

interface ApiProps {
  apiFunction: lambda.Function;
  publicApiFunction: lambda.Function;
  cognitoUserPoolArn: string;
  authenticationRequired: boolean;
}

export class BackendApi extends cdk.Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: cdk.Construct, id: string, props: ApiProps) {
    super(scope, id);

    const apiIntegration = new apigateway.LambdaIntegration(props.apiFunction, {
      allowTestInvoke: false,
    });

    const publicApiIntegration = new apigateway.LambdaIntegration(
      props.publicApiFunction,
      {
        allowTestInvoke: false,
      }
    );

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

        //Need to change this policy for ingest API with specific values
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

    const apigatewayLogGroup = new logs.LogGroup(scope, "ApiAccessLogs", {
      retention: logs.RetentionDays.TEN_YEARS,
    });
    let logGroup: logs.CfnLogGroup = apigatewayLogGroup.node.findChild(
      "Resource"
    ) as logs.CfnLogGroup;
    logGroup.cfnOptions.metadata = {
      cfn_nag: {
        rules_to_suppress: [
          {
            id: "W84",
            reason:
              "CloudWatchLogs LogGroup are encrypted by default.  There are no customer requirements to use KMS in this case, and there is a business goal to keep cost low.",
          },
        ],
      },
    };

    this.api = new apigateway.RestApi(scope, "ApiGateway", {
      description: "Performance Dashboard backend API",
      deployOptions: {
        tracingEnabled: true,
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
        accessLogDestination: new apigateway.LogGroupLogDestination(
          apigatewayLogGroup
        ),
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      policy: apiPolicy,
    });

    const authorizer = new apigateway.CfnAuthorizer(scope, "CognitoAuth", {
      type: apigateway.AuthorizationType.COGNITO,
      name: "cognito-authorizer",
      restApiId: this.api.restApiId,
      providerArns: [props.cognitoUserPoolArn],
      identitySource: "method.request.header.Authorization",
    });

    this.addPrivateEndpoints(apiIntegration, authorizer);
    this.addPublicEndpoints(
      publicApiIntegration,
      authorizer,
      props.authenticationRequired
    );

    const key = this.api.addApiKey("PerfDashIngestApiKey");
    const plan = this.api.addUsagePlan("PerfDashIngestUsagePlan", {
      name: "PerfDashIngestUsagePlan",
      apiKey: key,
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

  // Suppress cfn_nag Warn W59: AWS::ApiGateway::Method should not have AuthorizationType set to 'NONE' unless it is of HttpMethod: OPTIONS.
  private cfn_nag_warn_w59(method: apigateway.Method) {
    let apimethod: apigateway.CfnMethod = method.node.findChild(
      "Resource"
    ) as apigateway.CfnMethod;
    apimethod.cfnOptions.metadata = {
      cfn_nag: {
        rules_to_suppress: [
          {
            id: "W59",
            reason:
              "AuthorizationType set to None because using API Key and API Gateway resource policy",
          },
        ],
      },
    };
  }

  private addPrivateEndpoints(
    apiIntegration: apigateway.LambdaIntegration,
    authorizer: apigateway.CfnAuthorizer
  ) {
    // Defined resource props to the top level resources and they automatically
    // get applied recursively to their children endpoints.
    const methodProps: apigateway.MethodOptions = {
      authorizationType: apigateway.AuthorizationType.COGNITO,
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
      })
    );

    const ingestApiDataset = ingestApiDatasets.addResource("{id}");
    this.cfn_nag_warn_w59(
      ingestApiDataset.addMethod("PUT", apiIntegration, {
        apiKeyRequired: true,
      })
    );
    this.cfn_nag_warn_w59(
      ingestApiDataset.addMethod("DELETE", apiIntegration, {
        apiKeyRequired: true,
      })
    );
  }

  private addPublicEndpoints(
    apiIntegration: apigateway.LambdaIntegration,
    authorizer: apigateway.CfnAuthorizer,
    authenticationRequired?: boolean
  ) {
    const methodProps: apigateway.MethodOptions = {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: { authorizerId: authorizer.ref },
    };

    // Public endpoints that do not require authentication if auth is not required.
    const publicapi = this.api.root.addResource(
      authenticationRequired ? "protected" : "public"
    );
    const dashboards = publicapi.addResource("dashboard");
    const friendlyURLs = dashboards.addResource("friendly-url");

    const dashboard = dashboards.addResource("{id}");
    this.cfn_nag_warn_w59(
      dashboard.addMethod(
        "GET",
        apiIntegration,
        authenticationRequired ? methodProps : {}
      )
    );

    const byfriendlyURL = friendlyURLs.addResource("{friendlyURL}");
    this.cfn_nag_warn_w59(
      byfriendlyURL.addMethod(
        "GET",
        apiIntegration,
        authenticationRequired ? methodProps : {}
      )
    );

    const homepage = publicapi.addResource("homepage");
    this.cfn_nag_warn_w59(
      homepage.addMethod(
        "GET",
        apiIntegration,
        authenticationRequired ? methodProps : {}
      )
    );

    const settings = publicapi.addResource("settings");
    this.cfn_nag_warn_w59(
      settings.addMethod(
        "GET",
        apiIntegration,
        authenticationRequired ? methodProps : {}
      )
    );

    const search = publicapi.addResource("search");
    this.cfn_nag_warn_w59(
      search.addMethod(
        "GET",
        apiIntegration,
        authenticationRequired ? methodProps : {}
      )
    );
  }
}
