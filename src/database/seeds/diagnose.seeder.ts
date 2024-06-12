import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DiagnoseEntity } from '../../prescriptions/entities/diagnose.entity';
import { PrescriptionEntity } from '../../prescriptions/entities/prescription.entity';

export default class DiagnoseSeeder implements Seeder {
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
    const diagnoseRepository = dataSource.getRepository(DiagnoseEntity);
    const prescriptionRepository = dataSource.getRepository(PrescriptionEntity);
    const firstPrescription = await prescriptionRepository.findOne({});

    diagnoseRepository.save([
      {
        images: [],
        problem: 'test diagnose',
        prescription: {
          id: firstPrescription.id,
        },
      },
    ]);
  }
}
