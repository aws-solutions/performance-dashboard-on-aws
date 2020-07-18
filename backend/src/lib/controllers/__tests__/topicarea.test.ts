import controller from '../topicarea';

jest.mock('../../repositories/topicarea-repo');
import repository from '../../repositories/topicarea-repo';

const user = {
  userId: 'johndoe',
};

describe('createTopicArea', () => {
  it('should create a new topicArea using the repository', async () => {
    const topicArea = await controller.createTopicArea({
      name: 'banana',
      user,
    });
    expect(repository.create).toHaveBeenCalledWith(topicArea);
  });
});
