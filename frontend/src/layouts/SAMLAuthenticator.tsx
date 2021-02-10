import React, {
  ComponentType,
  ComponentPropsWithRef,
  FunctionComponent,
} from "react";
import { Auth, appendToCognitoUserAgent } from "@aws-amplify/auth";
import {
  AmplifyContainer,
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifyFederatedButtons,
  AmplifyButton,
} from "@aws-amplify/ui-react";
import { onAuthUIStateChange, AuthState } from "@aws-amplify/ui-components";
import { Logger } from "@aws-amplify/core";
import config, { samlConfig } from "../amplify-config";

const logger = new Logger("withAuthenticator");

export function withSAMLAuthenticator(
  Component: ComponentType,
  authenticatorProps?: ComponentPropsWithRef<typeof AmplifyAuthenticator>
) {
  const AppWithSAMLAuthenticator: FunctionComponent = (props) => {
    const [signedIn, setSignedIn] = React.useState(false);

    React.useEffect(() => {
      appendToCognitoUserAgent("withAuthenticator");

      // checkUser returns an "unsubscribe" function to stop side-effects
      return checkUser();
    }, []);

    function checkUser() {
      setUser();

      return onAuthUIStateChange((authState) => {
        if (authState === AuthState.SignedIn) {
          setSignedIn(true);
        } else if (authState === AuthState.SignedOut) {
          setSignedIn(false);
        }
      });
    }

    async function setUser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) setSignedIn(true);
      } catch (err) {
        logger.debug(err);
      }
    }

    function signInWithSAML(event: any) {
      event.preventDefault();
      if (
        samlConfig &&
        samlConfig.oauthConfig &&
        samlConfig.oauthConfig.customProvider
      ) {
        Auth.federatedSignIn({
          customProvider: samlConfig.oauthConfig.customProvider,
        });
      } else {
        Auth.federatedSignIn();
      }
    }

    if (!signedIn) {
      return (
        <AmplifyContainer>
          <AmplifyAuthenticator {...authenticatorProps} {...props}>
            {"oauth" in config.Auth && (
              <AmplifySignIn federated={samlConfig} slot="sign-in">
                <AmplifyFederatedButtons federated={samlConfig} />
                <div slot="federated-buttons">
                  <AmplifyButton
                    handleButtonClick={(event) => signInWithSAML(event)}
                  >
                    <span className="content">
                      {samlConfig &&
                      samlConfig.oauthConfig &&
                      samlConfig.oauthConfig.label
                        ? samlConfig.oauthConfig.label
                        : "Enterprise Sign-in"}
                    </span>
                  </AmplifyButton>
                  <style></style>
                </div>
              </AmplifySignIn>
            )}
          </AmplifyAuthenticator>
        </AmplifyContainer>
      );
    }
    return <Component />;
  };

  return AppWithSAMLAuthenticator;
}

export default withSAMLAuthenticator;
