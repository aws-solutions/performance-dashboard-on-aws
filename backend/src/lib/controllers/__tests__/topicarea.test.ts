import controller from '../topicarea';

jest.mock('../../repositories/topicarea-repo');
import repository from '../../repositories/topicarea-repo';

describe('createTopicArea', () => {
  it('should create a new topicArea by using the repository', async () => {
    const topicArea = await controller.createTopicArea({ name: 'banana' });
    expect(repository.create).toHaveBeenCalledWith(topicArea);
  });
});
