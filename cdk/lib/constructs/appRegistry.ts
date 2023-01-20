/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Aws, CfnMapping, CfnResource, Fn, Stack, Tags } from "aws-cdk-lib";
import { Application, AttributeGroup } from "@aws-cdk/aws-servicecatalogappregistry-alpha";
import { Construct } from "constructs";
import { CfnResourceAssociation } from "aws-cdk-lib/aws-servicecatalogappregistry";
import { CfnApplication } from "aws-cdk-lib/aws-applicationinsights";

export interface AppRegistryProps {
    solutionId: string;
    solutionName: string;
    solutionVersion: string;
    appRegistryApplicationName: string;
    applicationType: string;
    attributeGroupName: string;
}

export class AppRegistryForSolution extends Construct {
    readonly registryApplication: Application;
    private readonly appRegMap: CfnMapping;

    constructor(stack: Stack, id: string, props: AppRegistryProps) {
        super(stack, id);
        this.appRegMap = this.createMapForAppRegistry(stack, props);
        this.registryApplication = this.createAppRegistry(stack);
        this.createAttributeGroup(stack);
        this.applyTagsToApplication();
    }

    public associateAppWithNestedStacks(nestedStacks: Stack[]) {
        nestedStacks.forEach((nestedStack, ind) => {
            const association = new CfnResourceAssociation(
                this.registryApplication,
                `ResourceAssociation${ind}`,
                {
                    application: this.registryApplication.applicationId,
                    resource: nestedStack.stackId,
                    resourceType: "CFN_STACK",
                },
            );

            // If the nested stack is conditional, the resource association must also be so on the same condition
            // But the condition may have been added as an override
            const stackCondition =
                nestedStack.nestedStackResource?.cfnOptions.condition ?? // eslint-disable prettier/prettier
                (nestedStack as any).resource?.rawOverrides.Condition; // eslint-disable-line @typescript-eslint/no-explicit-any

            if (stackCondition) {
                association.addOverride("Condition", stackCondition.node.id);
            }
        });
    }

    public associateAppWithOtherStacks(stacks: Stack[]) {
        stacks.forEach((stack, ind) => {
            new CfnResourceAssociation(this.registryApplication, `ResourceAssociation${ind}`, {
                application: this.registryApplication.applicationId,
                resource: stack.stackId,
                resourceType: "CFN_STACK",
            });
        });
    }

    private createAppRegistry(stack: Stack): Application {
        const application = new Application(stack, "AppRegistry", {
            applicationName: Fn.join("-", [
                this.appRegMap.findInMap("Data", "AppRegistryApplicationName"),
                Aws.REGION,
                Aws.ACCOUNT_ID,
            ]),
            description:
                "Service Catalog application to track and manage all your resources for the solution",
        });
        application.associateApplicationWithStack(stack);

        // App insights
        const appInsights = new CfnApplication(stack, "ApplicationInsightsConfiguration", {
            resourceGroupName: Fn.join("-", [
                "AWS_AppRegistry_Application",
                this.appRegMap.findInMap("Data", "AppRegistryApplicationName"),
                Aws.REGION,
                Aws.ACCOUNT_ID,
            ]),
            autoConfigurationEnabled: true,
            cweMonitorEnabled: true,
            opsCenterEnabled: true,
        });
        appInsights.addDependency(application.node.defaultChild as CfnResource);

        return application;
    }

    private createAttributeGroup(stack: Stack) {
        const attributeGroup = new AttributeGroup(stack, "DefaultApplicationAttributes", {
            attributeGroupName: this.appRegMap.findInMap("Data", "AttributeGroupName"),
            description: "Attribute group for solution information",
            attributes: {
                applicationType: this.appRegMap.findInMap("Data", "ApplicationType"),
                version: this.appRegMap.findInMap("Data", "SolutionVersion"),
                solutionID: this.appRegMap.findInMap("Data", "ID"),
                solutionName: this.appRegMap.findInMap("Data", "SolutionName"),
            },
        });

        this.registryApplication.associateAttributeGroup(attributeGroup);
    }

    private createMapForAppRegistry(stack: Stack, props: AppRegistryProps) {
        const map = new CfnMapping(stack, "Solution");
        map.setValue("Data", "ID", props.solutionId);
        map.setValue("Data", "SolutionVersion", props.solutionVersion);
        map.setValue("Data", "AppRegistryApplicationName", props.appRegistryApplicationName);
        map.setValue("Data", "SolutionName", props.solutionName);
        map.setValue("Data", "ApplicationType", props.applicationType);
        map.setValue("Data", "AttributeGroupName", props.attributeGroupName);

        return map;
    }

    private applyTagsToApplication() {
        Tags.of(this.registryApplication).add(
            "Solutions:SolutionID",
            this.appRegMap.findInMap("Data", "ID"),
        );
        Tags.of(this.registryApplication).add(
            "Solutions:SolutionName",
            this.appRegMap.findInMap("Data", "SolutionName"),
        );
        Tags.of(this.registryApplication).add(
            "Solutions:SolutionVersion",
            this.appRegMap.findInMap("Data", "SolutionVersion"),
        );
        Tags.of(this.registryApplication).add(
            "Solutions:ApplicationType",
            this.appRegMap.findInMap("Data", "ApplicationType"),
        );
    }
}
