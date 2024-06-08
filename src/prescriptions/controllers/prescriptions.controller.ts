import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../auth/models/roles.model';
import { PrescriptionsService } from '../services/prescriptions.service';

@ApiTags('prescriptions')
@UseGuards(JwtAuthGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  getAll() {
    return this.prescriptionsService.findAll();
  }

  @Delete('/:prescriptionId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  deleteAPrescription(@Param('prescriptionId') prescriptionStringId: string) {
    return this.prescriptionsService.delete(Number(prescriptionStringId));
  }

  @Get('/my-prescriptions')
  @ApiBearerAuth('access-token')
  getMyPrescriptions(@Request() req) {
    return this.prescriptionsService.getMyPrescriptions(req.user);
  }

  @Get('/user-prescriptions/:userId')
  @ApiBearerAuth('access-token')
  @Roles(Role.DOCTOR, Role.ADMIN)
  getUserMyPrescriptions(
    @Request() req,
    @Param('userId') userStringId: string,
  ) {
    return this.prescriptionsService.getUserPrescriptions(
      req.user,
      Number(userStringId),
    );
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

  @Post('/:prescriptionId/diagnoses/:diagnoseId')
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
