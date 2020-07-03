import api from '../lib/api';
import envars from './env.json';

/**
 * Setting environment variables for local development
 */
for (const [key, value] of Object.entries(envars)) {
    console.log(`${key}=${value}`);
    process.env[key] = value;
}

/**
 * Start local server
 */
const port = 8080;
api.listen(port);

console.log(`Listening on port ${port}`);