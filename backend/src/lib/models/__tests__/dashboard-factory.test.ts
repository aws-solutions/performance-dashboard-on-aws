import factory from '../dashboard-factory';
import { Dashboard, DashboardItem } from '../dashboard-models';
import { User } from '../user-models';

const user: User = {
  userId: 'johndoe',
};

describe('dashboardFactory.createNew', () => {
  it('should create a new dashboard with unique id', () => {
    const dashboard1 = factory.createNew('Dashboard1', '123', 'Topic1', user);
    const dashboard2 = factory.createNew('Dashboard2', '123', 'Topic1', user);
    expect(dashboard1.id).not.toEqual(dashboard2.id);
  });

  it('should create a new dashboard with name, topicAreaId, topicAreaName and description', () => {
    const dashboard1 = factory.createNew('Dashboard1', '123', 'Topic1', user);
    expect(dashboard1.name).toEqual('Dashboard1');
    expect(dashboard1.topicAreaId).toEqual('123');
    expect(dashboard1.topicAreaName).toEqual('Topic1');
  });

  it('should create a new dashboard with createdBy', () => {
    const dashboard1 = factory.createNew('Dashboard1', '123', 'Topic1', user);
    expect(dashboard1.createdBy).toEqual(user.userId);
  });
});

describe('DashboardFactory.toItem', () => {
  const dashboard : Dashboard = {
    id: '123',
    name: 'Dashboard 1',
    topicAreaId: '456',
    topicAreaName: 'Topic 1',
    description: 'description test',
    createdBy: user.userId,
  };

  it('should have a pk that starts with TopicArea', () => {
    const item = factory.toItem(dashboard);
    expect(item.pk).toEqual('TopicArea-456');
  });

  it('should have a sk that starts with Dashboard', () => {
    const item = factory.toItem(dashboard);
    expect(item.sk).toEqual('Dashboard#123');
  });

  it('should have a type attribute', () => {
    const item = factory.toItem(dashboard);
    expect(item.type).toEqual('Dashboard');
  });

  it('should not have a overview attribute', () => {
    const item = factory.toItem(dashboard);
    expect(item.overview).toEqual(undefined);
  });

  it('should  have a overview attribute', () => {
    const dashboardWithOverview = {...dashboard, overview: "test"};
    const item = factory.toItem(dashboardWithOverview);
    expect(item.overview).toEqual("test");
  });

  it('should include all other attributes of DashboardItem', () => {
    const item = factory.toItem(dashboard);
    expect(item.dashboardName).toEqual('Dashboard 1');
    expect(item.description).toEqual('description test');
    expect(item.topicAreaName).toEqual('Topic 1');
    expect(item.createdBy).toEqual(user.userId);
  });
});

describe('DashboardFactory.fromItem', () => {
  const item : DashboardItem = {
    pk: 'TopicArea-456',
    sk: 'Dashboard#123',
    type: 'Dashboard',
    dashboardName: 'Dashboard 1',
    topicAreaName: 'Topic 1',
    description: 'description test',
    createdBy: user.userId,
  };

  it('should include all attributes of Dashboard', () => {
    const dashboard = factory.fromItem(item);
    expect(dashboard.id).toEqual('123');
    expect(dashboard.topicAreaId).toEqual('456');
    expect(dashboard.name).toEqual('Dashboard 1');
    expect(dashboard.description).toEqual('description test');
    expect(dashboard.topicAreaName).toEqual('Topic 1');
    expect(dashboard.createdBy).toEqual(user.userId);
  });

  it('should not have a overview attribute', () => {
    const dashboard = factory.fromItem(item);
    expect(dashboard.overview).toEqual(undefined);
  });

  it('should  have a overview attribute', () => {
    const itemWithOverview = {...item, overview: "test"};
    const dashboard = factory.fromItem(itemWithOverview);
    expect(dashboard.overview).toEqual("test");
  });
});