import { Construct, CfnParameter } from "@aws-cdk/core";

export class ExampleLanguageParameter extends CfnParameter {
  constructor(scope: Construct) {
    super(scope, "exampleLanguage", {
      type: "String",
      description: "Language for example dashboards",
      allowedValues: ["english", "spanish", "portuguese"],
      default: "english",
    });
  }
}
