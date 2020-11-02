import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";

interface ApiProps {
  apiFunction: lambda.Function;
  cognitoUserPoolArn: string;
}

export class BadgerApi extends cdk.Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: cdk.Construct, id: string, props: ApiProps) {
    super(scope, id);

    const apiIntegration = new apigateway.LambdaIntegration(props.apiFunction, {
      allowTestInvoke: false,
    });
    this.api = new apigateway.RestApi(scope, "ApiGateway", {
      description: "Performance Dashboard backend API",
      deployOptions: { tracingEnabled: true },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const authorizer = new apigateway.CfnAuthorizer(scope, "CognitoAuth", {
      type: apigateway.AuthorizationType.COGNITO,
      name: "cognito-authorizer",
      restApiId: this.api.restApiId,
      providerArns: [props.cognitoUserPoolArn],
      identitySource: "method.request.header.Authorization",
    });

    this.addPrivateEndpoints(apiIntegration, authorizer);
    this.addPublicEndpoints(apiIntegration);
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

    const widget = widgets.addResource("{widgetId}");
    widget.addMethod("GET", apiIntegration, methodProps);
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
    datasets.addMethod("POST", apiIntegration, methodProps);
  }

  private addPublicEndpoints(apiIntegration: apigateway.LambdaIntegration) {
    // Public endpoints that do not require authentication.
    // Not passing `methodProps` is what makes the endpoint public.
    const homepage = this.api.root.addResource("homepage");
    homepage.addMethod("GET", apiIntegration);

    const publicapi = this.api.root.addResource("public");
    const dashboards = publicapi.addResource("dashboard");

    const dashboard = dashboards.addResource("{id}");
    dashboard.addMethod("GET", apiIntegration);
  }
}
