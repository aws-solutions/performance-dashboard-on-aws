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

    const apiIntegration = new apigateway.LambdaIntegration(props.apiFunction);
    this.api = new apigateway.RestApi(this, "ApiGateway", {
      description: "Badger API",
      defaultIntegration: apiIntegration,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const authorizer = new apigateway.CfnAuthorizer(this, "CognitoAuth", {
      type: apigateway.AuthorizationType.COGNITO,
      name: "cognito-authorizer",
      restApiId: this.api.restApiId,
      providerArns: [props.cognitoUserPoolArn],
      identitySource: "method.request.header.Authorization",
    });

    // Defined resource props to the top level resources and they automatically
    // get applied recursively to their children endpoints.
    const resourceProps: apigateway.ResourceOptions = {
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: { authorizerId: authorizer.ref },
      }
    };

    const dashboards = this.api.root.addResource("dashboard", resourceProps);
    dashboards.addMethod("GET");
    dashboards.addMethod("POST");

    const dashboard = dashboards.addResource("{id}");
    dashboard.addMethod("GET");
    dashboard.addMethod("PUT");
    dashboard.addMethod("DELETE");

    const widgets = dashboard.addResource("widget");
    widgets.addMethod("POST");

    const topicareas = this.api.root.addResource("topicarea", resourceProps);
    topicareas.addMethod("GET");
    topicareas.addMethod("POST");

    const topicarea = topicareas.addResource("{id}");
    topicarea.addMethod("GET");
    topicarea.addMethod("PUT");
    topicarea.addMethod("DELETE");
  }
}
