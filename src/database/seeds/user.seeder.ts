import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Gender, Role, UserEntity } from '../../users/entities/user.entity';
import * as userData from './data/user.data.json';

export default class UserSeeder implements Seeder {
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
    const userRepository = dataSource.getRepository(UserEntity);
    const doctorSpecialtyRepository = dataSource.getRepository(UserEntity);

    await userRepository.upsert(
      await Promise.all(
        userData.map(async (user) => ({
          ...user,
          password: await bcrypt.hashSync(user.password, 10),
          role: user.role as Role,
          gender: user.gender as Gender,
        })),
      ),
      {
        conflictPaths: ['id'],
      },
    );

    // const [firstDoctor, ...restDoctors] = await userRepository.find({
    const [firstDoctor] = await userRepository.find({
      where: { role: Role.DOCTOR },
    });
    await userRepository.save({
      ...firstDoctor,
      specialties: await Promise.all(
        [2, 7, 11, 14].map((specialtyId) =>
          doctorSpecialtyRepository.findOne({
            where: { id: specialtyId },
          }),
        ),
      ),
    });

    // await Promise.all(
    //   restDoctors.map(async (doctor) =>
    //     userRepository.save({
    //       ...doctor,
    //       specialties: await Promise.all(
    //         _.sampleSize(
    //           Array(18).map((_element, index) => index + 1),
    //           4,
    //         ).map((specialtyId) =>
    //           doctorSpecialtyRepository.findOne({
    //             where: { id: specialtyId },
    //           }),
    //         ),
    //       ),
    //     }),
    //   ),
    // );
  }
}
