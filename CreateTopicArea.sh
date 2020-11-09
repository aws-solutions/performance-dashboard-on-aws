#!/bin/bash

#read and create api request source
read -p 'Cognito region code: ' region
read -p 'Cognito user pool ID: ' userPool
post_url='https://cognito-idp.'"$region"'.amazonaws.com/'"$userPool"

# reads USERNAME PASSWORD and clientID 
read -p 'App Client ID: ' clientID
read -p 'Username: ' userName
read -e -s -p "Password (hidden):" pass
printf "\n"

# create JSON payload for JWT token request
generate_post_token()
{
  cat <<EOF
    {
      "ClientId": "$clientID",
      "AuthFlow": "USER_PASSWORD_AUTH",
      "AuthParameters": {
          "USERNAME": "$userName",
          "PASSWORD": "$pass"
          }
      }
EOF
}

token_request=$(curl --location --request POST "$post_url" \
--header 'Content-Type: application/x-amz-json-1.1' \
--header 'X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth' \
--data-raw "$(generate_post_token)")

# extracting JWT token
jwt_token=$(echo $token_request | jq --raw-output '.AuthenticationResult.IdToken')

# reads topic name 
read -p 'enter the topic name: ' topicName

# JOSN payload for topic create request
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

