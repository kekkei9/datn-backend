import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetAllDrugsDto } from '../dto/find-drugs.dto';

@Injectable()
export class DrugsService {
  constructor(private readonly httpService: HttpService) {}
  async findAll({ page, pageSize, filterAll }: GetAllDrugsDto) {
    const response = await this.httpService.axiosRef.post(
      'https://dichvucong.dav.gov.vn/api/services/app/quanLyGiaThuoc/GetListCongBoPublicPaging',
      {
        CongBoGiaThuoc: {},
        KichHoat: true,
        skipCount: (page - 1) * pageSize,
        maxResultCount: pageSize,
        sorting: null,
        ...(filterAll && { filterAll }),
      },
    );

    return response.data;
  }

  async findDrugByRegistrationNumber(registrationNumber: string) {
    const response = await this.httpService.axiosRef.post<{
      result: {
        items: any[];
      };
    }>(
      'https://dichvucong.dav.gov.vn/api/services/app/quanLyGiaThuoc/GetListCongBoPublicPaging',
      {
        CongBoGiaThuoc: { soDangKy: registrationNumber },
        KichHoat: true,
        skipCount: 0,
        maxResultCount: 15,
        sorting: null,
      },
    );

    const result = response.data.result.items[0];
    if (!result) {
      throw new HttpException('Drug not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
