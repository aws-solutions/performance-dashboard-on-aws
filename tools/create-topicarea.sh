#!/bin/bash

# Replace fields with proper IDs
region='Replace with the code for the AWS Region in which you configured the Cognito User pools'
userPoolID='Replace with the Cognito Pool Id'
app_clientID='Replace with the Cognito User Pools App client id'
api_invokeURL='Replace with Invoke API url'

api_url="$api_invokeURL"'/topicarea'
post_url='https://cognito-idp.'"$region"'.amazonaws.com/'"$userPoolID"

# reads USERNAME read PASSWORD
read -p 'Username: ' userName
read -e -s -p "Password (hidden):" pass
printf "\n"

# create JSON payload for JWT token request
generate_post_token()
{
  cat <<EOF
    {
      "ClientId": "$app_clientID",
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

# JSON payload for topic create request
generate_post_data()
{
  cat <<EOF
    {
        "name": "$topicName"
    }
EOF
}

get_response=$(curl -X --location --request POST "$api_url" \
--header 'Authorization: Bearer '$jwt_token'' \
--header 'Content-Type: application/json' \
--data-raw "$(generate_post_data)")

echo $get_response

