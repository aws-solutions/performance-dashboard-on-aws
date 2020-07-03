import dashboard from '../';

jest.mock('../repo');
import repo from '../repo';

describe('Dashboard Package', () => {
    it('should get list of dashboards from repo', async () => {
        const dashboards = await dashboard.listDashboards();
        expect(repo.readAll).toHaveBeenCalled();
    });
});