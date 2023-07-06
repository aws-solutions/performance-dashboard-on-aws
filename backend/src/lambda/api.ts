/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, Context } from "aws-lambda";
import serverlessExpress from "aws-serverless-express";
import api from "../lib/api";
import { validateHeaderName, validateHeaderValue } from "http";

const server = serverlessExpress.createServer(api);

function logRequest(event: APIGatewayProxyEvent, context: Context) {
    // Don't log sensitive data such as API body and authorization headers
    let eventToLog = { ...event };
    if (eventToLog) {
        if (eventToLog.resource.includes("ingestapi")) {
            eventToLog = { ...eventToLog, body: null };
        }
        if (eventToLog.headers?.Authorization) {
            eventToLog.headers.Authorization = "<Redacted>";
        }
        if (eventToLog.multiValueHeaders?.Authorization) {
            eventToLog.multiValueHeaders.Authorization = ["<Redacted>"];
        }
    }

    console.log("Event=", JSON.stringify(eventToLog));
    console.log("Context=", JSON.stringify(context));
}
/**
 * Do validation on the HTTP headers
 * per the rules defined in RFC 7230
 * See https://www.rfc-editor.org/rfc/rfc7230#section-3.2.6
 * Passing illegal values will result in a TypeError being thrown.
 */
function validateHeaders(headers: APIGatewayProxyEventHeaders) {
    for (const headerName in headers) {
        validateHeaderName(headerName);
        if (typeof headers[headerName] === "string") {
            const headerValue = String(headers[headerName]);
            validateHeaderValue(headerName, headerValue);
        } else {
            throw new TypeError("ERR_HTTP_INVALID_HEADER_VALUE");
        }
    }
}

/**
 * Lambda entry handler for HTTP requests
 * coming from API Gateway.
 *
 * @param event
 */
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
    try {
        logRequest(event, context);

        // Do Http Headers validation before sending the request to the express instance. Otherwise will fail with Internal server error.
        validateHeaders(event.headers);

        return serverlessExpress.proxy(server, event, context);
    } catch (error) {
        console.log("Error=", error);
        if (error instanceof TypeError) {
            return Promise.resolve({
                statusCode: 400,
                body: "Bad Request",
            });
        }
        return Promise.resolve({
            statusCode: 500,
            body: "Server Error",
        });
    }
};
