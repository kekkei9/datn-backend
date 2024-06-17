import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import FriendRequestSeeder from './friend_request.seeder';
import UserSeeder from './user.seeder';
import PrescriptionSeeder from './prescription.seeder';
import DiagnoseSeeder from './diagnose.seeder';
import NotificationSeeder from './notification.seeder';
import DiarySeeder from './diary.seeder';
import AppointmentSeeder from './appointment.seeder';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userSeeder = new UserSeeder();
    await userSeeder.run(dataSource, factoryManager);

    const friendRequestSeeder = new FriendRequestSeeder();
    await friendRequestSeeder.run(dataSource);

    const prescriptionSeeder = new PrescriptionSeeder();
    await prescriptionSeeder.run(dataSource);

    const diagnoseSeeder = new DiagnoseSeeder();
    await diagnoseSeeder.run(dataSource);

    const notificationSeeder = new NotificationSeeder();
    await notificationSeeder.run(dataSource);

    const diarySeeder = new DiarySeeder();
    await diarySeeder.run(dataSource);

    const appointmentSeeder = new AppointmentSeeder();
    await appointmentSeeder.run(dataSource);
  }
}
