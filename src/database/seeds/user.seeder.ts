import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Role } from '../../auth/models/roles.model';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
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
    const repository = dataSource.getRepository(UserEntity);
    await repository.insert([
      {
        firstName: 'Caleb',
        lastName: 'Barrows',
        email: 'patient@gmail.com',
        password: await bcrypt.hash('patient', 10),
        role: Role.PATIENT,
        phoneNumber: 'patient',
      },
      {
        firstName: 'Caleb',
        lastName: 'Barrows',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin', 10),
        role: Role.ADMIN,
        phoneNumber: 'admin',
      },
      {
        firstName: 'Leanne',
        lastName: 'Graham',
        email: 'doctor@gmail.com',
        password: await bcrypt.hash('doctor', 10),
        role: Role.DOCTOR,
        phoneNumber: 'doctor',
      },
    ]);

    // ---------------------------------------------------

    // const userFactory = await factoryManager.get(UserEntity);
    // // save 1 factory generated entity, to the database
    // await userFactory.save();

    // // save 5 factory generated entities, to the database
    // await userFactory.saveMany(5);
  }
}
