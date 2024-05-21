import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAllDrugsDto } from '../dto/find-drugs.dto';
import { DrugsService } from '../services/drugs.service';

@ApiTags('drugs') // put the name of the controller in swagger
@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Get()
  findAll(@Query() query: GetAllDrugsDto) {
    return this.drugsService.findAll(query);
  }

  @Get('/:registrationNumber')
  findDrugByRegistrationNumber(
    @Param('registrationNumber') registrationNumber: string,
  ) {
    return this.drugsService.findDrugByRegistrationNumber(registrationNumber);
  }
}
