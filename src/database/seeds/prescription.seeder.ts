import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { PrescriptionEntity } from '../../prescriptions/entities/prescription.entity';
import { UserEntity } from '../../users/entities/user.entity';

export default class PrescriptionSeeder implements Seeder {
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
    const prescriptionRepository = dataSource.getRepository(PrescriptionEntity);

    const userRepository = dataSource.getRepository(UserEntity);

    const patientUser = await userRepository.findOne({
      where: {
        phoneNumber: 'patient',
      },
    });

    const doctorUser = await userRepository.findOne({
      where: {
        phoneNumber: 'doctor',
      },
    });

    await prescriptionRepository.save([
      {
        belongTo: {
          id: patientUser.id,
        },
        createdBy: {
          id: doctorUser.id,
        },
        data: JSON.stringify({
          medicines: [
            {
              name: 'Paracetamol',
              dosage: 2,
              schedule: { morning: 1, afternoon: 0, evening: 1, night: 0 },
            },
            {
              name: 'Prospan',
              dosage: 3,
              schedule: { morning: 1, afternoon: 1, evening: 1, night: 0 },
            },
          ],
        }),
        images: [],
      },
    ]);
  }
}
