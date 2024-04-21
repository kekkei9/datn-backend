import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/models/roles.model';

export default class UserSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        firstName: 'Caleb',
        lastName: 'Barrows',
        email: 'patient@gmail.com',
        password: 'patient',
        role: Role.PATIENT,
      },
      {
        firstName: 'Leanne',
        lastName: 'Graham',
        email: 'doctor@gmail.com',
        password: 'doctor',
        role: Role.DOCTOR,
      },
    ]);

    // ---------------------------------------------------

    const userFactory = await factoryManager.get(User);
    // save 1 factory generated entity, to the database
    await userFactory.save();

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5);
  }
}
