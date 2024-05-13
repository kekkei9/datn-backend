import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAppointmentRequestDto,
  CreateApppointmentDto,
  ResponseAppointmentRequestDto,
  UpdateAppointmentDto,
} from '../dto/create-appointment.dto';
import { AppointmentEntity } from '../entities/appointment.entity';
import { UsersService } from '../../users/services/users.service';
import { PayloadToken } from '../../auth/models/token.model';
import { Role } from '../../auth/models/roles.model';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private appointmentRepository: Repository<AppointmentEntity>,

    private userService: UsersService,
  ) {}

  findAppointmentById(id: number) {
    return this.appointmentRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const user = await this.appointmentRepository.preload({
      id,
      ...updateAppointmentDto,
    });
    if (!user) {
      throw new NotFoundException(`Appointment with id ${id} does not exist`);
    }
    return this.appointmentRepository.save(user);
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

  async sendAppointmentRequest(
    { id: currentUserId }: PayloadToken,
    userId: number,
    createAppointmentRequestDto: CreateAppointmentRequestDto,
  ) {
    const user = await this.userService.findUserById(userId);
    const currentUser = await this.userService.findUserById(currentUserId);

    if (user.role === currentUser.role) {
      return {
        message:
          'You cannot send appointment request to user with the same role',
      };
    }

    if ([user.role, currentUser.role].includes(Role.ADMIN)) {
      return {
        message: 'You cannot send appointment request to admin',
      };
    }

    return this.createAppointment({
      beginTimestamp: createAppointmentRequestDto.beginTimestamp,
      confirmUser: user,
      requestUser: currentUser,
      status: 'pending',
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

  async updateAppointmentRequestById(
    user: PayloadToken,
    appointmentId: number,
    responseAppointmentRequestDto: ResponseAppointmentRequestDto,
  ) {
    const appointment = await this.findAppointmentById(appointmentId);
    if (user.id !== appointment.confirmUser.id)
      return { message: 'You cannot respond to this appointment request' };

    if (appointment.status !== 'pending')
      return { message: 'Appointment request is not pending' };

    const { action, beginTimestamp } = responseAppointmentRequestDto;

    if (action === 'ACCEPT') {
      return this.update(appointmentId, { status: 'ongoing' });
    }

    if (action === 'DECLINE') {
      return this.update(appointmentId, { status: 'declined' });
    }

    if (action === 'COMPLETE') {
      return this.update(appointmentId, { status: 'completed' });
    }

    if (action === 'RESCHEDULE') {
      if (!beginTimestamp) {
        return { message: 'Begin timestamp is required' };
      }
      if (user.id !== appointment.confirmUser.id) {
        return { message: 'You cannot reschedule this appointment' };
      }
      return this.update(appointmentId, {
        beginTimestamp,
        confirmUser: appointment.requestUser,
        requestUser: appointment.confirmUser,
      });
    }
  }

  createAppointment(appointment: CreateApppointmentDto) {
    return this.appointmentRepository.create(appointment);
  }

  async acceptAppointmentRequestById(
    appointmentId: number,
    user: PayloadToken,
  ) {
    const appointmentRequest = await this.findAppointmentById(appointmentId);

    if (user.id !== appointmentRequest.confirmUser.id)
      return {
        message: 'You cannot accept this appointment request',
      };

    if (appointmentRequest.status !== 'pending')
      return {
        message: 'Appointment request is not pending',
      };

    const { beginTimestamp, confirmUser, requestUser } = appointmentRequest;

    return this.update(appointmentId, {
      beginTimestamp,
      confirmUser,
      requestUser,
      status: 'ongoing',
    });
  }
}
