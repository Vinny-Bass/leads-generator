import * as fs from 'fs';
import { faker } from '@faker-js/faker';
import { format } from '@fast-csv/format';
import { format as dateFormat, startOfYear, endOfYear } from 'date-fns';
import * as crypto from "crypto-js";
import fields from './fields';

const verticals = [
  { id: 'vertical_1', percentage: 0.2, campaignIds: [1, 2, 3, 4] },
  { id: 'vertical_2', percentage: 0.08, campaignIds: [5, 6, 7, 8, 9, 10] },
  { id: 'vertical_3', percentage: 0.16, campaignIds: [11, 12, 13] },
  { id: 'vertical_4', percentage: 0.12, campaignIds: [14, 15, 16, 17] },
  { id: 'vertical_5', percentage: 0.21, campaignIds: [18, 19] },
  { id: 'vertical_6', percentage: 0.08, campaignIds: [20, 21, 22] },
  { id: 'vertical_7', percentage: 0.09, campaignIds: [23, 24] },
  { id: 'vertical_8', percentage: 0.06, campaignIds: [25] },
];

const maxRowsPerFile = 10;

const generateData = async (totalRows: number, numYears: number, growthRate: number) => {
  let v = 0;
  let fileIndex = 1;
  let rowCount = 0;
  const currentYear = new Date().getFullYear();


  let csvStream = format({ headers: fields });
  let writeStream = fs.createWriteStream(`./data/output${v + 1}_${fileIndex}.csv`);
  csvStream.pipe(writeStream).on('end', () => console.log(`output${v + 1}_${fileIndex}.csv has been written.`));

  for (const { id, percentage, campaignIds } of verticals) {
    const percToCalc = totalRows * percentage;
    const initialRowsValue = Math.floor(percToCalc * (1 - growthRate) / (1 - Math.pow(growthRate, numYears)));

    let rowsThisYear = initialRowsValue;

    for (let y = 0; y < numYears; y++) {
      if (y > 0) {
        rowsThisYear = Math.ceil(rowsThisYear * growthRate)
      }

      const lead_date = new Date(currentYear - numYears + y, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));

      const email = faker.internet.email();
      const mobilephone = faker.phone.number('##########');
      const email_md5 = crypto.MD5(email).toString();
      const campaignId = faker.helpers.arrayElement(campaignIds);


      for (let i = 0; i < rowsThisYear; i++) {
        const row = {
          id: faker.string.uuid(),
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          email,
          email_md5,
          email_domain: email.split('@')[1],
          address1: faker.location.streetAddress(),
          address2: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zip: faker.location.zipCode('#####'),
          country: faker.location.country(),
          homephone: faker.phone.number('##########'),
          workphone: faker.phone.number('##########'),
          mobilephone,
          phone_md5: crypto.MD5(mobilephone).toString(),
          dateofbirth: dateFormat(faker.date.birthdate({ min: 30, max: 90, mode: 'age' }), 'yyyy-MM-dd HH:mm:ss'),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          language: faker.helpers.arrayElement(['en', 'es']),
          own_rent: faker.helpers.arrayElement(['own', 'rent']),
          income: faker.finance.amount(50000, 100000, 2),
          pay_cycle: faker.helpers.arrayElement(['weekly', 'bi-weekly', 'monthly']),
          employer: faker.company.name(),
          employ_start_date: dateFormat(faker.date.past(5), 'yyyy-MM-dd HH:mm:ss'),
          military: faker.helpers.arrayElement(['Yes', 'No']),
          checking: faker.helpers.arrayElement(['Yes', 'No']),
          debt: faker.finance.amount(0, 10000, 2),
          homeowner: faker.helpers.arrayElement(['Yes', 'No']),
          education: faker.helpers.arrayElement(['High School', 'College', 'Graduate']),
          auto: faker.helpers.arrayElement(['Yes', 'No']),
          make: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          model_year: faker.date.between('2000-01-01', '2020-12-31').getFullYear(),
          hinsurance: faker.helpers.arrayElement(['Yes', 'No']),
          medical: faker.helpers.arrayElement(['Yes', 'No']),
          prescription: faker.helpers.arrayElement(['Yes', 'No']),
          diabetic: faker.helpers.arrayElement(['Yes', 'No']),
          travel: faker.helpers.arrayElement(['Yes', 'No']),
          ip: faker.internet.ip(),
          url: faker.internet.url(),
          lead_date: dateFormat(lead_date, 'yyyy-MM-dd HH:mm:ss'),
          timestamp: new Date().toISOString(),
          jornaya_leadid: faker.string.uuid(),
          trustedform_cert_url: `https://cert.trustedform.com/${email_md5}`,
          lp_campaign_id: campaignId,
          lp_supplier_id: campaignId + 1000,
          lp_cost: faker.finance.amount(1, 100, 2),
          lp_revenue: faker.finance.amount(1, 200, 2),
          lp_vertical: id,
        };

        if (!csvStream.write(row)) {
          await new Promise(resolve => csvStream.once('drain', resolve));
        }

        rowCount++;

        if (rowCount >= maxRowsPerFile) {
          csvStream.end();

          fileIndex++;
          rowCount = 0;

          csvStream = format({ headers: fields });
          writeStream = fs.createWriteStream(`./data/output${v + 1}_${fileIndex}.csv`);
          csvStream.pipe(writeStream).on('end', () => console.log(`output${v + 1}_${fileIndex}.csv has been written.`));
        }
      }
    }
    v++;
  }
  csvStream.end();
};

generateData(100, 5, 1.15);
