#!/bin/bash

# Replace the post_url in this Format-> https://cognito-idp.{region-code}.amazonaws.com/{userPool ID}
post_url='https://cognito-idp.us-east-1.amazonaws.com/us-east-1_LiNDVdtYT'

# Replace the ClientId with the App Client ID of the user pool
# Replace USERNAME and PASSWORD accordingly
token_request=$(curl --location --request POST "$post_url" \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth' \
--data-raw '{
                "ClientId": "515m3r2gggvng79osn9dg69cct",
                "AuthFlow": "USER_PASSWORD_AUTH",
                "AuthParameters": {
                    "USERNAME": "tariqha@amazon.com",
                    "PASSWORD": "Lalala123#"
                    }
            }')

jwt_token=$(echo $token_request | jq --raw-output '.AuthenticationResult.IdToken')

read -p 'enter the topic name: ' topicName
echo $topicName

generate_post_data()
{
  cat <<EOF
    {
        "name": "$topicName"
    }
EOF
}

get_response=$(curl -X --location --request POST 'https://71vtbdvejb.execute-api.us-east-1.amazonaws.com/prod//topicarea' \
--header 'Authorization: Bearer '$jwt_token'' \
--header 'Content-Type: application/json' \
--data-raw "$(generate_post_data)")

echo $get_response

