import factory from '../dashboard-factory';
import { Dashboard } from '../dashboard-models';
import { User } from '../user-models';

const user: User = {
  userId: 'johndoe',
};

describe('dashboardFactory.createNew', () => {
  it('should create a new dashboard with unique id', () => {
    const dashboard1 = factory.createNew('Dashboard1', '123', 'Topic1', 'description test', user);
    const dashboard2 = factory.createNew('Dashboard2', '123', 'Topic1', 'description test', user);
    expect(dashboard1.id).not.toEqual(dashboard2.id);
  });

  it('should create a new dashboard with name, topicAreaId, topicAreaName and description', () => {
    const dashboard1 = factory.createNew('Dashboard1', '123', 'Topic1', 'description test', user);
    expect(dashboard1.name).toEqual('Dashboard1');
    expect(dashboard1.topicAreaId).toEqual('123');
    expect(dashboard1.topicAreaName).toEqual('Topic1');
    expect(dashboard1.description).toEqual('description test');
  });

  it('should create a new dashboard with createdBy', () => {
    const dashboard1 = factory.createNew('Dashboard1', '123', 'Topic1', 'description test', user);
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

  it('should include all other attributes of topic area', () => {
    const item = factory.toItem(dashboard);
    expect(item.dashboardName).toEqual('Dashboard 1');
    expect(item.description).toEqual('description test');
    expect(item.topicAreaName).toEqual('Topic 1');
    expect(item.createdBy).toEqual(user.userId);
  });
});