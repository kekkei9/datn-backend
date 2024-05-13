import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayloadToken } from 'src/auth/models/token.model';
import { Repository } from 'typeorm';
import { CreateApppointmentDto } from '../dto/create-appointment.dto';
import { AppointmentEntity } from '../entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  findAppointmentById(id: number) {
    return this.appointmentRepository.findOne({ where: { id } });
  }

  getAppointmentRequests() {
    return this.appointmentRepository.find({
      where: {
        status: 'pending',
      },
    });
  }

  getAppointmentRequestsByUser({ id }: PayloadToken) {
    return this.appointmentRepository.find({
      where: {
        confirmUser: {
          id,
        },
        status: 'pending',
      },
    });
  }

  getAppointmentsByUser({ id }: PayloadToken) {
    return this.appointmentRepository.find({
      where: [
        {
          confirmUser: {
            id,
          },
          status: 'ongoing',
        },
        {
          requestUser: {
            id,
          },
          status: 'ongoing',
        },
      ],
    });
  }

  createAppointment(appointment: CreateApppointmentDto) {
    return this.appointmentRepository.save(appointment);
  }

  async acceptAppointmentRequestById(
    appointmentRequestId: number,
    user: PayloadToken,
  ) {
    const appointmentRequest = await this.findAppointmentById(
      appointmentRequestId,
    );

    if (user.id !== appointmentRequest.confirmUser.id)
      return {
        message: 'You cannot accept this appointment request',
      };

    if (appointmentRequest.status !== 'pending')
      return {
        message: 'Appointment request is not pending',
      };

    const { beginTimestamp, confirmUser, requestUser } = appointmentRequest;

    return this.createAppointment({
      beginTimestamp,
      confirmUser,
      requestUser,
      status: 'ongoing',
    });
  }
}
