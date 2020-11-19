# Limiting access to on-premises networks only

By default, Performance Dashboard is configured to allow access from the Internet. This include Editors who can create and publish dashboards, and public users who can view the dashboards. To remove the threat of attackers from the Internet attempting to access the administrative functions of Performance Dashboard, you can configure it to only allow access to the **/admin** path to come from your on-premises network. In the same manner, you can also limit access to the entire application to only from your on-premises network.

## Preventing access with AWS WAF

You can use the [AWS WAF](https://aws.amazon.com/waf/) to limit access to Performance Dashboard to requests originating in your on-premises network. You create a [Web ACL](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html) to allow or block requests based on the IP addresses that the requests originate from. You then protect the CloudFront distribution used with Performance Dashboard with that WebACL. The diagram below shows the concept:

![on-premises access only](images/protect-login-page.png)

## Configuring the WAF

In a future release of Performance Dashboard, as part of the automated installation, you will be able to specify whether you want to limit access to Performance Dashboard to certain IP addresses. For now, you can manually create the AWS WAF Web ACL and associate it with the Performance Dashboard CloudFront distribution. Refer to AWS documentation in the links below to understand the steps for configuring the Web ACL in the AWS WAF console:

- [Creating a web ACL](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-creating.html)
- Use an [IP set match](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-ipset-match.html) to inspect the IP address of a web request against a set of IP addresses and address ranges. Use this to allow or block web requests based on the IP addresses that the requests originate from
- Use a [String match rule statement](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-string-match.html) to indicate the string that you want AWS WAF to search for in a request, where in the request to search. Use this to allow or block web requests based on a string pattern in the URI, such as /admin

To create the Web ACL as described in the diagram above, you can run the Cloud Formation Template (CFT) [WAF-enterprise-only](../tools/WAF-enterprise-only.json) in the us-east-1 region. First, clone this repo to your local environment, or download the WAF-enterprise-only.json file locally. Next, go to the CFT console, click on "Create Stack", choose to "Upload a template file", and select the WAF-enterprise-only.json file. Enter a stack name, such as "PerfDash-WAF". The template expects as input the list of CIDRs to limit access to. For example, if the CIDRs for your internal network is 1.1.0.0/16 and 2.2.0.0/16, then enter those values as a comma delimited list "1.1.0.0/16, 2.2.0.0/16". Click "Next" until you arrive at the screen where you can click "Create Stack".

After running the CFT to create the Web ACL, go to the CloudFront console. Find the CloudFront distribution that has an Origin that starts with `performancedash-` and click on it. Next, click on Edit. In the "Edit Distribution" screen, configure the [AWS WAF Web ACL](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-awswaf.html) field and select the Web ACL you just created. Press the "Yes, Edit" blue button to save.
