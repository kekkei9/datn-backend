import { DiaryEntity } from '../entities/diary.entity';

export const diaryMapper = (diary: DiaryEntity) => ({
  ...diary,
  data: JSON.parse(diary.data),
});
