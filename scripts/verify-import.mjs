import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.resolve(__dirname, '../src/data/catalog.json');
const pricesPath = path.resolve(__dirname, '../src/data/prices.json');
const queuePath = path.resolve(__dirname, '../src/data/research-queue.json');
const logPath = path.resolve(__dirname, '../src/data/research-log.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const prices = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));

console.log('--- KEYSCALE IMPORT AUDIT & RECONCILIATION REPORT ---');
console.log(`Source records parsed: ${catalog.length}`);

const ids = new Set();
const duplicates = [];
let completeDimensions = 0;
let partialDimensions = 0;
let missingDimensions = 0;
let withWeight = 0;
let withReviewFlag = 0;
const brands = new Set();
const layouts = new Set();
const technologies = new Set();

for (const k of catalog) {
  if (ids.has(k.id)) {
    duplicates.push(k.id);
  }
  ids.add(k.id);

  if (k.brand) brands.add(k.brand);
  if (k.layout) layouts.add(k.layout);
  if (k.technology) technologies.add(k.technology);

  const hasW = typeof k.width === 'number' && k.width > 0;
  const hasD = typeof k.depth === 'number' && k.depth > 0;
  const hasH = typeof k.height === 'number' && k.height > 0;

  if (hasW && hasD && hasH) {
    completeDimensions++;
  } else if (hasW || hasD || hasH) {
    partialDimensions++;
  } else {
    missingDimensions++;
  }

  if (typeof k.weight === 'number' && k.weight > 0) {
    withWeight++;
  }

  if (k.review) {
    withReviewFlag++;
  }
}

const priceKeys = Object.keys(prices);
let totalOffers = 0;
for (const key of priceKeys) {
  totalOffers += Array.isArray(prices[key]) ? prices[key].length : 1;
}

const report = {
  totalRecords: catalog.length,
  uniqueIds: ids.size,
  duplicatesCount: duplicates.length,
  completeDimensions,
  partialDimensions,
  missingDimensions,
  withWeight,
  reviewFlags: withReviewFlag,
  brandsCount: brands.size,
  brands: Array.from(brands).sort(),
  layouts: Array.from(layouts).sort(),
  technologies: Array.from(technologies).sort(),
  priceObservationsCount: totalOffers,
  keyboardsWithPrices: priceKeys.length,
  researchQueueCount: queue.entries?.length || 0,
  researchLogsCount: Array.isArray(logs) ? logs.length : Object.keys(logs).length,
  generatedAt: new Date().toISOString()
};

console.log(`Unique IDs: ${report.uniqueIds}`);
console.log(`Duplicates: ${report.duplicatesCount}`);
console.log(`Complete 3-axis dimensions: ${report.completeDimensions}`);
console.log(`Partial dimensions: ${report.partialDimensions}`);
console.log(`Missing dimensions: ${report.missingDimensions}`);
console.log(`With weight: ${report.withWeight}`);
console.log(`Under review / conflict: ${report.reviewFlags}`);
console.log(`Brands (${report.brandsCount}): ${report.brands.slice(0, 10).join(', ')}...`);
console.log(`Keyboards with price data: ${report.keyboardsWithPrices} (${report.priceObservationsCount} total offers)`);
console.log(`Research queue entries: ${report.researchQueueCount}`);
console.log(`Research audit log entries: ${report.researchLogsCount}`);

const outputPath = path.resolve(__dirname, '../src/data/import-audit.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`Audit saved to ${outputPath}`);
