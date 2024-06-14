import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DiaryEntity } from '../../diaries/entities/diary.entity';

export default class DiarySeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = true;

  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const diaryRepository = dataSource.getRepository(DiaryEntity);

    await diaryRepository.save([
      {
        createdBy: {
          id: 2,
        },
        belongTo: {
          id: 3,
        },
        images: [],
        data: JSON.stringify({
          mockKey: 'mockValue',
        }),
      },
    ]);
  }
}
