import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DiaryEntity } from '../../diaries/entities/diary.entity';
import { UserEntity } from '../../users/entities/user.entity';

export default class DiarySeeder implements Seeder {
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
    const diaryRepository = dataSource.getRepository(DiaryEntity);

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

    await diaryRepository.save([
      {
        belongTo: {
          id: patientUser.id,
        },
        createdBy: {
          id: doctorUser.id,
        },
        images: [],
        data: JSON.stringify({
          mockKey: 'mockValue',
        }),
      },
    ]);
  }
}
