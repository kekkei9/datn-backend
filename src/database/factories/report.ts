import { setSeederFactory } from 'typeorm-extension';
import { ReportEntity } from '../../reports/entities/report.entity';

export default setSeederFactory(ReportEntity, async (faker) => {
  const report = new ReportEntity();
  report.reason = faker.string.alpha();

  return report;
});
