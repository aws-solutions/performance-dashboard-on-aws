import factory from '../topicarea-factory';
import { TopicArea } from '../topicarea-models';

describe('TopicAreaFactory.createNew', () => {
  it('should create a new topic area with unique id', () => {
    const topicarea1 = factory.createNew({ name: 'Banana' });
    const topicarea2 = factory.createNew({ name: 'Strawberries' });
    expect(topicarea1.id).not.toEqual(topicarea2.id);
  });

  it('should create a new topic area with name', () => {
    const topicarea = factory.createNew({ name: 'AWS' });
    expect(topicarea.name).toEqual('AWS');
  });
});

describe('TopicAreaFactory.toItem', () => {
  const topicarea : TopicArea = {
    id: '123',
    name: 'Banana',
  };

  it('should have a pk that starts with TopicArea', () => {
    const item = factory.toItem(topicarea);
    expect(item.pk).toEqual('TopicArea-123');
  });

  it('should have an sk equal to pk', () => {
    const item = factory.toItem(topicarea);
    expect(item.sk).toEqual(item.pk);
  });

  it('should have a type attribute', () => {
    const item = factory.toItem(topicarea);
    expect(item.type).toEqual('TopicArea');
  });

  it('should include all other attributes of topic area', () => {
    const item = factory.toItem(topicarea);
    expect(item.name).toEqual('Banana');
  });
});