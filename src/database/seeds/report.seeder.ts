import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ReportEntity } from '../../reports/entities/report.entity';
import * as reportData from './data/report.data.json';

export default class ReportSeeder implements Seeder {
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
    const reportRepository = dataSource.getRepository(ReportEntity);

    await reportRepository.upsert(reportData, {
      conflictPaths: ['id'],
    });
  }
}
