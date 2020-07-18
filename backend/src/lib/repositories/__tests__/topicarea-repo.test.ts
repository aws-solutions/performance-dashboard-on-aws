import { mocked } from 'ts-jest/utils';
import repo from '../topicarea-repo';
import { TopicArea, TopicAreaItem } from '../../models/topicarea-models';

jest.mock('../../services/dynamodb');
import DynamoDbService from '../../services/dynamodb';

jest.mock('../../models/topicarea-factory');
import factory from '../../models/topicarea-factory';

describe('TopicAreaRepository.create', () => {

  it('should convert a topicArea to a dynamodb item', async () => {
    const topicArea: TopicArea = {
      id: '123',
      name: 'AWS',
      createdBy: 'johndoe',
    };

    await repo.create(topicArea);
    expect(factory.toItem).toHaveBeenCalledWith(topicArea);
  });

  it('should call putItem on dynamodb', async () => {
    const dynamodb = mocked(DynamoDbService.prototype);
    const item: TopicAreaItem = {
      pk: 'TopicArea-123',
      sk: 'TopicArea-123',
      type: 'TopicArea',
      name: 'AWS',
      createdBy: 'johndoe',
    };

    factory.toItem = jest.fn().mockReturnValue(item);
    await repo.create({ id: '123', name: 'AWS', createdBy: 'johndoe' });
 
    expect(dynamodb.putItem).toHaveBeenCalledWith(item);
  });
});