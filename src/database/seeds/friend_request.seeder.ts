import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../../auth/models/roles.model';
import { FriendRequestEntity } from '../../users/entities/friend-request.entity';
import { FriendRequestStatus } from '../../users/entities/friend-request.interface';
import { UserEntity } from '../../users/entities/user.entity';

export default class FriendRequestSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;

  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const friendRequestrepository =
      dataSource.getRepository(FriendRequestEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const doctorAccounts = await userRepository.find({
      where: {
        role: Role.DOCTOR,
      },
    });

    const patientAccounts = await userRepository.find({
      where: {
        role: Role.PATIENT,
      },
    });

    doctorAccounts.forEach(async (doctor) => {
      patientAccounts.forEach(async (patient) => {
        await friendRequestrepository.insert([
          {
            creator: {
              id: doctor.id,
            },
            receiver: {
              id: patient.id,
            },
            status: FriendRequestStatus.ACCEPTED,
          },
          {
            creator: {
              id: patient.id,
            },
            receiver: {
              id: doctor.id,
            },
            status: FriendRequestStatus.ACCEPTED,
          },
        ]);
      });
    });
  }
}
