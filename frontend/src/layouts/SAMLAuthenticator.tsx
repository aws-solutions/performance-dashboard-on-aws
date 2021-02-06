import React, { ComponentType, FunctionComponent, useCallback } from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import {
  AmplifyAuthenticator,
  AmplifyContainer,
  AmplifySignIn,
  AmplifyFederatedSignIn,
  AmplifyFederatedButtons,
} from "@aws-amplify/ui-react";

function withSAMLAuthenticator(Component: ComponentType) {
  const AppWithSAMLAuthenticator: FunctionComponent = (props) => {
    const [signedIn, setSignedIn] = React.useState(false);

    React.useEffect(() => {
      return checkUser();
    }, []);

    function checkUser() {
      return onAuthUIStateChange((authState) => {
        if (authState === AuthState.SignedIn) {
          setSignedIn(true);
        } else if (authState === AuthState.SignedOut) {
          setSignedIn(false);
        }
      });
    }

    const federated = {
      oauthConfig: {
        customProvider: "PDOA",
        label: "Enterprise Sign-in",
      },
    };
    if (!signedIn) {
      //Auth.federatedSignIn();
      //window.location.assign(
      //  "https://auth-251647719696-us-east-2.auth.us-east-2.amazoncognito.com/login?client_id=2trf0n8643045iga8qqsi85g0i&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000/admin"
      //);
      //return <button onClick={() => Auth.federatedSignIn()}>Sign in</button>;
      return (
        <AmplifyContainer>
          <AmplifyAuthenticator>
            <AmplifySignIn slot="sign-in">
              <div slot="federated-buttons">
                <AmplifyFederatedButtons federated={federated} />
              </div>
            </AmplifySignIn>
          </AmplifyAuthenticator>
        </AmplifyContainer>
      );
    } else return <Component />;
  };

  return AppWithSAMLAuthenticator;
}

export default withSAMLAuthenticator;
