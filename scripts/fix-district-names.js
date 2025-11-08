// Fix district names and add progress data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputPath = path.join(__dirname, '../public/mock/districts.json');
const outputPath = path.join(__dirname, '../public/mock/districts.json');

// District names mapping based on the order from conversion
const districtNames = [
  '北投區',  // 1
  '士林區',  // 2
  '內湖區',  // 3
  '中山區',  // 4
  '大同區',  // 5
  '松山區',  // 6
  '南港區',  // 7
  '中正區',  // 8
  '信義區',  // 9
  '萬華區',  // 10
  '大安區',  // 11
  '文山區'   // 12
];

// Progress data from StatsOverview.vue
const progressData = {
  '中山區': 24,
  '大安區': 15,
  '信義區': 12,
  '中正區': 8,
  '松山區': 5,
  '萬華區': 3,
  '北投區': 0,
  '士林區': 0,
  '南港區': 0,
  '內湖區': 0,
  '文山區': 0,
  '大同區': 0
};

const idMapping = {
  '北投區': 'beitou',
  '士林區': 'shilin',
  '內湖區': 'neihu',
  '中山區': 'zhongshan',
  '大同區': 'datong',
  '松山區': 'songshan',
  '南港區': 'nankang',
  '中正區': 'zhongzheng',
  '信義區': 'xinyi',
  '萬華區': 'wanhua',
  '大安區': 'daan',
  '文山區': 'wenshan'
};

try {
  console.log('Reading GeoJSON...');
  const geojson = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  console.log(`Processing ${geojson.features.length} districts...\n`);
  
  geojson.features.forEach((feature, index) => {
    const districtName = districtNames[index];
    const progress = progressData[districtName] || 0;
    const id = idMapping[districtName];
    
    // Update properties
    feature.properties = {
      name: districtName,
      id: id,
      progress: progress,
      TNAME: districtName,
      AREA: feature.properties.AREA,
      bounds: feature.properties.bounds
    };
    
    console.log(`${index + 1}. ${districtName} (${id}) - ${progress}% explored`);
  });
  
  // Write back to file
  fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
  console.log(`\n✅ Updated GeoJSON saved to: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
  
} catch (error) {
  console.error('Error:', error);
}
