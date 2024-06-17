import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DoctorRequestEntity } from '../../users/entities/doctor-request.entity';

export default class DoctorRequestSeeder implements Seeder {
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
    const doctorRequestRepository =
      dataSource.getRepository(DoctorRequestEntity);

    await doctorRequestRepository.save([
      {
        confirmUser: {
          id: 1,
        },
        requestUser: {
          id: 2,
        },
        metadata: {},
      },
    ]);
  }
}
