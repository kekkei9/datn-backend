import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role, UserEntity } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = true;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    await Promise.all(
      [
        {
          id: 1,
          firstName: 'admin',
          lastName: 'admin',
          email: 'admin@gmail.com',
          password: await bcrypt.hash('admin', 10),
          role: Role.ADMIN,
          phoneNumber: 'admin',
        },
        {
          id: 2,
          firstName: 'Leanne',
          lastName: 'Graham',
          email: 'doctor@gmail.com',
          password: await bcrypt.hash('doctor', 10),
          role: Role.DOCTOR,
          phoneNumber: 'doctor',
        },
        {
          id: 3,
          firstName: 'Caleb',
          lastName: 'Barrows',
          email: 'patient@gmail.com',
          password: await bcrypt.hash('patient', 10),
          role: Role.PATIENT,
          phoneNumber: 'patient',
        },
      ].map((user) =>
        repository.upsert(user, {
          conflictPaths: ['id'],
        }),
      ),
    );

    // ---------------------------------------------------

    const userFactory = factoryManager.get(UserEntity);
    await userFactory.saveMany(20);
  }
}
