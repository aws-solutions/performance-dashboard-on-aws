import api from '../lib/api';

/**
 * Start local server
 */
const port = 8080;
api.listen(port);

console.log(`Listening on port ${port}`);