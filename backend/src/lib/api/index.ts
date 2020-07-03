import express from 'express';
import dashboard from '../dashboard';

const app = express();
const router = express.Router();

/**
 * @GET
 * List all dashboards
 */
router.get('/dashboard', async (req, res) => {
    const dashboards = await dashboard.listDashboards();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(dashboards);
});

/**
 * @GET
 * Get dashboard by Id
 */
router.get('/dashboard/:dashboardId', async (req, res) => {
    const { dashboardId } = req.params;
    const dash = await dashboard.getDashboardById(dashboardId);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json(dash);
});

app.use('/', router);
export default app;