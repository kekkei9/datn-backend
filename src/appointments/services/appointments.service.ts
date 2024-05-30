import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../auth/models/roles.model';
import { PayloadToken } from '../../auth/models/token.model';
import { UsersService } from '../../users/services/users.service';
import {
  CreateAppointmentRequestDto,
  ResponseAppointmentAction,
  ResponseAppointmentRequestDto,
  UpdateAppointmentDto,
} from '../dto/create-appointment.dto';
import {
  AppointmentEntity,
  AppointmentStatus,
} from '../entities/appointment.entity';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { NotificationType } from '../../notifications/entities/notification.entity';
import dayjs from 'dayjs';
import { ReportsService } from '../../reports/services/reports.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private appointmentRepository: Repository<AppointmentEntity>,

    private userService: UsersService,

    private notificationsService: NotificationsService,

    private reportsService: ReportsService,
  ) {}

  findAppointmentById(id: number) {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['confirmUser', 'requestUser'],
    });
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
        status: AppointmentStatus.PENDING,
      },
      relations: ['confirmUser', 'requestUser'],
    });
  }

  getAppointmentRequestsByUser({ id }: PayloadToken) {
    return this.appointmentRepository.find({
      where: {
        confirmUser: {
          id,
        },
        status: AppointmentStatus.PENDING,
      },
      relations: ['confirmUser', 'requestUser'],
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

    const createdAppointment = await this.appointmentRepository.save({
      beginTimestamp: createAppointmentRequestDto.beginTimestamp,
      confirmUser: user,
      requestUser: currentUser,
      status: AppointmentStatus.PENDING,
    });

    this.notificationsService.create({
      message: `You have a new appointment request from ${currentUser.firstName} ${currentUser.lastName}`,
      belongTo: user,
      createdBy: currentUser,
      type: NotificationType.APPOINTMENT,
      referenceId: createdAppointment.id,
    });

    return createdAppointment;
  }

  getAppointmentsByUser({ id }: PayloadToken) {
    return this.appointmentRepository.find({
      where: [
        {
          confirmUser: {
            id,
          },
          status: AppointmentStatus.ONGOING,
        },
        {
          requestUser: {
            id,
          },
          status: AppointmentStatus.ONGOING,
        },
      ],
      relations: ['confirmUser', 'requestUser'],
    });
  }

  async updateAppointmentRequestById(
    user: PayloadToken,
    appointmentId: number,
    responseAppointmentRequestDto: ResponseAppointmentRequestDto,
  ) {
    const appointment = await this.findAppointmentById(appointmentId);
    const { action, beginTimestamp } = responseAppointmentRequestDto;
    if (
      ![appointment.confirmUser.id, appointment.requestUser.id].includes(
        user.id,
      )
    ) {
      throw new ForbiddenException(
        'You cannot respond to this appointment request',
      );
    }

    if (action === ResponseAppointmentAction.COMPLETE) {
      return this.update(appointmentId, {
        status: AppointmentStatus.COMPLETED,
      });
    }

    if (user.id !== appointment.confirmUser.id)
      throw new ForbiddenException(
        'You cannot respond to this appointment request',
      );

    if (appointment.status !== AppointmentStatus.PENDING)
      throw new ForbiddenException('Appointment request is not pending');

    if (action === ResponseAppointmentAction.ACCEPT) {
      return this.update(appointmentId, { status: AppointmentStatus.ONGOING });
    }

    if (action === ResponseAppointmentAction.DECLINE) {
      if (appointment.beginTimestamp - dayjs().unix() < 24 * 60 * 60 * 1000) {
        this.reportsService.create({
          reason:
            'Declined appointment request less than 24 hours before the appointment',
          userId: user.id,
        });
      }
      return this.update(appointmentId, { status: AppointmentStatus.DECLINED });
    }

    if (action === ResponseAppointmentAction.RESCHEDULE) {
      if (!beginTimestamp) {
        throw new BadRequestException('Begin timestamp is required');
      }
      if (user.id !== appointment.confirmUser.id) {
        throw new ForbiddenException('You cannot reschedule this appointment');
      }
      return this.update(appointmentId, {
        beginTimestamp,
        confirmUser: appointment.requestUser,
        requestUser: appointment.confirmUser,
      });
    }
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
      status: AppointmentStatus.ONGOING,
    });
  }
}
