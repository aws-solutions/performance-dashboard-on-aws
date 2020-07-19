import { mocked } from 'ts-jest/utils';
import repo from '../topicarea-repo';
import { User } from '../../models/user-models';
// import { TopicArea, TopicAreaItem } from '../../models/topicarea-models';
import topicareaFactory from '../../models/topicarea-factory';

jest.mock('aws-sdk');
import AWS from 'aws-sdk';

// DynamoDB functions always return an object
// that has a promise function within it. 
function mockDynamoOperation() {
  return jest.fn().mockReturnValue({
    promise: jest.fn(),
  });
}

let user: User;
let tableName;

beforeEach(() => {
  user = { userId: 'johndoe' };
  tableName = "BadgerTable";
  process.env.BADGER_TABLE = tableName;
});

describe('TopicAreaRepository.create', () => {
  it('should call putItem on dynamodb', async () => {
    const dynamodb = mocked(AWS.DynamoDB.DocumentClient.prototype);
    dynamodb.put = mockDynamoOperation();

    const topicarea = topicareaFactory.createNew('Banana', user);
    await repo.create(topicarea);

    expect(dynamodb.put).toHaveBeenCalled();
  });
});