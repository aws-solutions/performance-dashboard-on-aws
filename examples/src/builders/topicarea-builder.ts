import { TopicArea } from "performance-dashboard-backend/src/lib/models/topicarea";
import TopicAreRepository from "performance-dashboard-backend/src/lib/repositories/topicarea-repo";
import { v4 as uuidv4 } from "uuid";

export class TopicAreaBuilder {
  private id: string | undefined;
  private name: string | undefined;
  private author: string | undefined;

  withId(id: string): TopicAreaBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): TopicAreaBuilder {
    this.name = name;
    return this;
  }

  withAuthor(author: string): TopicAreaBuilder {
    this.author = author;
    return this;
  }

  generateIdIf(flag: boolean): TopicAreaBuilder {
    if (flag) {
      this.withId(uuidv4());
    }
    return this;
  }

  async build(): Promise<TopicArea> {
    if (!this.id) {
      throw new Error("TopicAreaBuilder requires an id");
    }
    if (!this.name) {
      throw new Error("TopicAreaBuilder requires a name");
    }
    if (!this.author) {
      throw new Error("TopicAreaBuilder requires an author");
    }
    const topicArea: TopicArea = {
      id: this.id,
      name: this.name,
      createdBy: this.author,
      dashboardCount: await TopicAreRepository.getInstance().getDashboardCount(
        this.id
      ),
    };
    await TopicAreRepository.getInstance().create(topicArea);
    return topicArea;
  }
}
