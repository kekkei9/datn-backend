import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PrescriptionsService } from '../services/prescriptions.service';
import { GetAllPrescriptionDto } from '../dto/get-prescription.dto';
import { GetAllDiagnoses } from '../dto/get-diagnoses.dto';
import { Role } from '../../users/entities/user.entity';

@ApiTags('prescriptions')
@UseGuards(JwtAuthGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @ApiBearerAuth('access-token')
  getAll(@Query() query: GetAllPrescriptionDto, @Request() req) {
    return this.prescriptionsService.findAll({
      ...query,
      currentUser: req.user,
    });
  }

  @Delete('/:prescriptionId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  deleteAPrescription(@Param('prescriptionId') prescriptionStringId: string) {
    return this.prescriptionsService.delete(Number(prescriptionStringId));
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          type: 'object',
        },
        belongTo: {
          type: 'number',
        },
      },
    },
  })
  @Roles(Role.DOCTOR, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  createAPrescription(
    @Request() req,
    @Body() body,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.prescriptionsService.create(body, files, req.user);
  }

  @Patch('/:prescriptionId')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          type: 'object',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(Role.DOCTOR, Role.ADMIN)
  patchPrescription(
    @Request() req,
    @Body() body,
    @Param('prescriptionId') prescriptionStringId: string,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.prescriptionsService.patch(
      body,
      files,
      Number(prescriptionStringId),
      req.user,
    );
  }

  @Get('/diagnoses')
  @ApiBearerAuth('access-token')
  findAllDiagnoses(@Query() query: GetAllDiagnoses, @Request() req) {
    return this.prescriptionsService.findAllDiagnoses({
      ...query,
      currentUser: req.user,
    });
  }

  @Get('/:prescriptionId/diagnoses')
  @ApiBearerAuth('access-token')
  @Roles(Role.DOCTOR, Role.PATIENT)
  getDiagnosesOfPrescription(
    @Param('prescriptionId') prescriptionStringId: string,
  ) {
    return this.prescriptionsService.getDiagnosesOfPrescription(
      Number(prescriptionStringId),
    );
  }

  @Post('/:prescriptionId/diagnoses')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        problem: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  addDiagnoseToPrescription(
    @Request() req,
    @Body() body,
    @Param('prescriptionId') prescriptionStringId: string,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.prescriptionsService.addDiagnoseToPrescription(
      body,
      files,
      Number(prescriptionStringId),
      req.user,
    );
  }

  @Patch('/diagnoses/:diagnoseId')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        problem: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  patchDiagnoseOfPrescription(
    @Request() req,
    @Body() body,
    @Param('prescriptionId') prescriptionStringId: string,
    @Param('diagnoseId') diagnoseStringId: string,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.prescriptionsService.patchDiagnoseOfPrescription(
      body,
      files,
      Number(prescriptionStringId),
      Number(diagnoseStringId),
      req.user,
    );
  }
}
