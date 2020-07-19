import { mocked } from 'ts-jest/utils';
import TopicAreaRepository from '../topicarea-repo';
import { User } from '../../models/user-models';
import TopicAreaFactory from '../../models/topicarea-factory';

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
let dynamodb: AWS.DynamoDB.DocumentClient;
let repo: TopicAreaRepository;

beforeEach(() => {
  user = { userId: 'johndoe' };

  tableName = "BadgerTable";
  process.env.BADGER_TABLE = tableName;

  dynamodb = mocked(AWS.DynamoDB.DocumentClient.prototype);
  dynamodb.put = mockDynamoOperation();
  dynamodb.query = mockDynamoOperation();
  dynamodb.delete = mockDynamoOperation();
  dynamodb.update = mockDynamoOperation();

  repo = TopicAreaRepository.getInstance();
});

describe('TopicAreaRepository.create', () => {
  it('should call putItem on dynamodb', async () => {
    const topicarea = TopicAreaFactory.createNew('Banana', user);
    await repo.create(topicarea);
    expect(dynamodb.put).toHaveBeenCalled();
  });
});