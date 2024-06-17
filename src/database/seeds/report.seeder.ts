import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ReportEntity } from '../../reports/entities/report.entity';

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

    await reportRepository.save([
      {
        belongTo: {
          id: 2,
        },
        createdBy: {
          id: 3,
        },
        reason: 'Late',
      },
      {
        belongTo: {
          id: 2,
        },
        createdBy: {
          id: 3,
        },
        reason: 'Late',
      },
      {
        belongTo: {
          id: 2,
        },
        createdBy: {
          id: 3,
        },
        reason: 'Late',
      },
      {
        belongTo: {
          id: 3,
        },
        createdBy: {
          id: 2,
        },
        reason: 'Late',
      },
      {
        belongTo: {
          id: 3,
        },
        createdBy: {
          id: 2,
        },
        reason: 'Late',
      },
    ]);
  }
}
