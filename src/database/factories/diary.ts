import { setSeederFactory } from 'typeorm-extension';
import { DiaryEntity } from '../../diaries/entities/diary.entity';

export default setSeederFactory(DiaryEntity, async (faker) => {
  const diary = new DiaryEntity();
  diary.images = [faker.string.uuid(), faker.string.uuid()];

  return diary;
});
