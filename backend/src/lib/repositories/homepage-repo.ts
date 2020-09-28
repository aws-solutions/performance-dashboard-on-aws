import { Homepage, HomepageItem } from "../models/homepage";
import HomepageFactory from "../factories/homepage-factory";
import BaseRepository from "./base";

class HomepageRepository extends BaseRepository {
  protected static instance: HomepageRepository;
  private constructor() {
    super();
  }

  static getInstance(): HomepageRepository {
    return HomepageRepository.instance
      ? HomepageRepository.instance
      : new HomepageRepository();
  }

  public async getHomepage(): Promise<Homepage | undefined> {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: "Homepage",
        sk: "Homepage",
      },
    });

    if (!result.Item) {
      return undefined;
    }

    return HomepageFactory.fromItem(result.Item as HomepageItem);
  }
}

export default HomepageRepository;
