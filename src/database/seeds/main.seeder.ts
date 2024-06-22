import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import AppointmentSeeder from './appointment.seeder';
import DiagnoseSeeder from './diagnose.seeder';
import DiarySeeder from './diary.seeder';
import DoctorRequestSeeder from './doctor_request.seeder';
import DoctorSpecialtySeeder from './doctor_specialty.seeder';
import FriendRequestSeeder from './friend_request.seeder';
import NotificationSeeder from './notification.seeder';
import PrescriptionSeeder from './prescription.seeder';
import ReportSeeder from './report.seeder';
import UserSeeder from './user.seeder';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userSeeder = new UserSeeder();
    await userSeeder.run(dataSource);

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

    const doctorRequestSeeder = new DoctorRequestSeeder();
    await doctorRequestSeeder.run(dataSource);

    const reportSeeder = new ReportSeeder();
    await reportSeeder.run(dataSource);

    const doctorSpecialtySeeder = new DoctorSpecialtySeeder();
    await doctorSpecialtySeeder.run(dataSource);
  }
}
