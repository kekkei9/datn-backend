import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DiaryEntity } from '../../diaries/entities/diary.entity';
import * as diaryData from './data/diary.data.json';

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

    await diaryRepository.upsert(diaryData as any, {
      conflictPaths: ['id'],
    });
  }
}
