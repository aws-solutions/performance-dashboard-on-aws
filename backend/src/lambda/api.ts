import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverlessExpress from 'aws-serverless-express';
import api from '../lib/api';

const server = serverlessExpress.createServer(api);

/**
 * Lambda entry handler for HTTP requests
 * coming from API Gateway.
 * 
 * @param event 
 */
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
    console.log('Event=', JSON.stringify(event));
    console.log('Context=', JSON.stringify(context));
    return serverlessExpress.proxy(server, event, context);
};