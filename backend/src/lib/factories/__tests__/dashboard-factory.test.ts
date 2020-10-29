import factory from "../dashboard-factory";
import {
  Dashboard,
  DashboardItem,
  DashboardState,
} from "../../models/dashboard";
import { User } from "../../models/user";

const user: User = {
  userId: "johndoe",
};

describe("createNew", () => {
  it("should create a new dashboard with unique id", () => {
    const dashboard1 = factory.createNew(
      "Dashboard1",
      "123",
      "Topic1",
      "Description Test",
      user
    );
    const dashboard2 = factory.createNew(
      "Dashboard2",
      "123",
      "Topic1",
      "Description Test",
      user
    );
    expect(dashboard1.id).not.toEqual(dashboard2.id);
  });

  it("should create a new dashboard with name, topicAreaId, topicAreaName, updatedAt and description, version, parentDashboardId", () => {
    const dashboard1 = factory.createNew(
      "Dashboard1",
      "123",
      "Topic1",
      "Description Test",
      user
    );
    expect(dashboard1.name).toEqual("Dashboard1");
    expect(dashboard1.topicAreaId).toEqual("123");
    expect(dashboard1.topicAreaName).toEqual("Topic1");
    expect(dashboard1.description).toEqual("Description Test");
    expect(dashboard1.version).toEqual(1);
    expect(dashboard1.parentDashboardId).toEqual(dashboard1.id);
  });

  it("should create a new dashboard with createdBy", () => {
    const dashboard1 = factory.createNew(
      "Dashboard1",
      "123",
      "Topic1",
      "Description Test",
      user
    );
    expect(dashboard1.createdBy).toEqual(user.userId);
  });
});

describe("toItem", () => {
  const now = new Date();
  const dashboard: Dashboard = {
    id: "123",
    version: 1,
    name: "Dashboard 1",
    topicAreaId: "456",
    topicAreaName: "Topic 1",
    description: "Description test",
    parentDashboardId: "123",
    createdBy: user.userId,
    updatedAt: now,
    state: DashboardState.Draft,
    releaseNotes: "release note test",
  };

  it("should have a pk that starts with Dashboard", () => {
    const item = factory.toItem(dashboard);
    expect(item.pk).toEqual("Dashboard#123");
  });

  it("should have a sk that starts with Dashboard", () => {
    const item = factory.toItem(dashboard);
    expect(item.sk).toEqual("Dashboard#123");
  });

  it("should have a type attribute", () => {
    const item = factory.toItem(dashboard);
    expect(item.type).toEqual("Dashboard");
  });

  it("should include all other attributes of DashboardItem", () => {
    const item = factory.toItem(dashboard);
    expect(item.dashboardName).toEqual("Dashboard 1");
    expect(item.description).toEqual("Description test");
    expect(item.topicAreaId).toEqual("TopicArea#456");
    expect(item.topicAreaName).toEqual("Topic 1");
    expect(item.createdBy).toEqual(user.userId);
    expect(item.updatedAt).toEqual(now.toISOString());
    expect(item.state).toEqual("Draft");
    expect(item.version).toEqual(1);
    expect(item.parentDashboardId).toEqual("123");
    expect(item.releaseNotes).toEqual("release note test");
  });
});

describe("fromItem", () => {
  const now = new Date().toISOString();
  const item: DashboardItem = {
    pk: "Dashboard#123",
    sk: "Dashboard#123",
    type: "Dashboard",
    version: 1,
    dashboardName: "Dashboard 1",
    topicAreaId: "TopicArea-456",
    topicAreaName: "Topic 1",
    description: "Description test",
    createdBy: user.userId,
    parentDashboardId: "123",
    updatedAt: now,
    state: "Draft",
    releaseNotes: "release note test",
  };

  it("should include all attributes of Dashboard", () => {
    const dashboard = factory.fromItem(item);
    expect(dashboard.id).toEqual("123");
    expect(dashboard.topicAreaId).toEqual("456");
    expect(dashboard.name).toEqual("Dashboard 1");
    expect(dashboard.description).toEqual("Description test");
    expect(dashboard.topicAreaName).toEqual("Topic 1");
    expect(dashboard.createdBy).toEqual(user.userId);
    expect(dashboard.updatedAt).toEqual(new Date(now));
    expect(dashboard.state).toEqual(DashboardState.Draft);
    expect(dashboard.version).toEqual(1);
    expect(dashboard.parentDashboardId).toEqual("123");
    expect(dashboard.releaseNotes).toEqual("release note test");
  });
});

describe("toPublic", () => {
  const now = new Date();
  const dashboard: Dashboard = {
    id: "123",
    version: 1,
    parentDashboardId: "123",
    name: "Dashboard 1",
    topicAreaId: "456",
    topicAreaName: "Topic 1",
    description: "Description test",
    createdBy: user.userId,
    updatedAt: now,
    state: DashboardState.Draft,
    releaseNotes: "release note test",
  };

  it("should expose fields that are not sensitive", () => {
    const publicDashboard = factory.toPublic(dashboard);
    expect(publicDashboard.id).toEqual(dashboard.id);
    expect(publicDashboard.name).toEqual(dashboard.name);
    expect(publicDashboard.topicAreaId).toEqual(dashboard.topicAreaId);
    expect(publicDashboard.topicAreaName).toEqual(dashboard.topicAreaName);
    expect(publicDashboard.description).toEqual(dashboard.description);
    expect(publicDashboard.updatedAt).toEqual(dashboard.updatedAt);
  });
});

describe("toVersion", () => {
  const now = new Date();
  const dashboard: Dashboard = {
    id: "123",
    version: 1,
    parentDashboardId: "123",
    name: "Dashboard 1",
    topicAreaId: "456",
    topicAreaName: "Topic 1",
    description: "Description test",
    createdBy: user.userId,
    updatedAt: now,
    state: DashboardState.Draft,
    releaseNotes: "release note test",
  };

  it("should expose fields that are part of the version", () => {
    const publicDashboard = factory.toVersion(dashboard);
    expect(publicDashboard.id).toEqual(dashboard.id);
    expect(publicDashboard.version).toEqual(dashboard.version);
    expect(publicDashboard.state).toEqual(dashboard.state);
  });
});

describe("createDraftFromDashboard", () => {
  const nextVersion = 2;
  const dashboard: Dashboard = {
    id: "123",
    version: 1,
    parentDashboardId: "123",
    name: "Dashboard 1",
    topicAreaId: "456",
    topicAreaName: "Topic 1",
    description: "Description test",
    createdBy: user.userId,
    updatedAt: new Date(),
    state: DashboardState.Draft,
    releaseNotes: "release note test",
  };

  it("should create a dashboard with same parentDashboardId", () => {
    const draft = factory.createDraftFromDashboard(
      dashboard,
      user,
      nextVersion
    );
    expect(draft.parentDashboardId).toEqual(dashboard.parentDashboardId);
  });

  it("should create a dashboard on Draft state", () => {
    const draft = factory.createDraftFromDashboard(
      dashboard,
      user,
      nextVersion
    );
    expect(draft.state).toEqual(DashboardState.Draft);
  });

  it("should create a dashboard with a new id", () => {
    const draft = factory.createDraftFromDashboard(
      dashboard,
      user,
      nextVersion
    );
    expect(draft.id).not.toEqual(dashboard.id);
  });

  it("should set the version number", () => {
    const draft = factory.createDraftFromDashboard(
      dashboard,
      user,
      nextVersion
    );
    expect(draft.version).toEqual(nextVersion);
  });

  it("should create a dashboard with all other attributes", () => {
    const draft = factory.createDraftFromDashboard(
      dashboard,
      user,
      nextVersion
    );
    expect(draft).toEqual(
      expect.objectContaining({
        name: "Dashboard 1",
        topicAreaId: "456",
        topicAreaName: "Topic 1",
        description: "Description test",
      })
    );
  });
});
