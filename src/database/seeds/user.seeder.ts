import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
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
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        firstName: 'Caleb',
        lastName: 'Barrows',
        email: 'patient@gmail.com',
        password: await bcrypt.hash('patient', 10),
        role: Role.PATIENT,
      },
      {
        firstName: 'Leanne',
        lastName: 'Graham',
        email: 'doctor@gmail.com',
        password: await bcrypt.hash('doctor', 10),
        role: Role.DOCTOR,
      },
    ]);

    // ---------------------------------------------------

    // const userFactory = await factoryManager.get(User);
    // // save 1 factory generated entity, to the database
    // await userFactory.save();

    // // save 5 factory generated entities, to the database
    // await userFactory.saveMany(5);
  }
}
