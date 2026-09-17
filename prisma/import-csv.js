const fs = require('fs');
const path = require('path');
const prisma = require('../server/prisma');

const csvPath = path.join(__dirname, '..', 'sih backend 26', 'ml', 'dataset', 'sih_queue_wait_time_dataset_2000.csv');

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += character;
    }
  }

  values.push(value.trim());
  return values;
}

function number(value) {
  return Number(value || 0);
}

async function main() {
  const rows = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
  const headers = parseCsvLine(rows.shift());
  const observations = rows.map((row) => {
    const values = parseCsvLine(row);
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
    return {
      customerId: record.customer_id,
      customerName: record.customer_name,
      centreId: record.centre_id,
      centreName: record.centre_name,
      bookingDate: record.booking_date,
      hourOfDay: number(record.hour_of_day),
      dayOfWeek: number(record.day_of_week),
      peakHour: number(record.peak_hour),
      tokenNumber: number(record.token_number),
      tokensAhead: number(record.tokens_ahead),
      queueLength: number(record.queue_length),
      activeCounters: number(record.active_counters),
      crop: record.crop,
      quantityKg: number(record.quantity_kg),
      qualityGrade: record.quality_grade,
      staffExperienceYears: number(record.staff_experience_years),
      estimatedTimeMin: number(record.estimated_time_min),
      actualWaitTimeMin: number(record.actual_wait_time_min),
      processingTimeMin: number(record.processing_time_min),
      totalTimeAtCentreMin: number(record.total_time_at_centre_min),
    };
  });

  for (const observation of observations) {
    await prisma.queueObservation.upsert({
      where: { customerId: observation.customerId },
      update: observation,
      create: observation,
    });
  }

  console.log(`Imported ${observations.length} queue observations from ${path.basename(csvPath)}.`);
}

main()
  .catch((error) => {
    console.error('CSV import failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
