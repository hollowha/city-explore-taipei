// Manually create simplified district data for Taipei
// Using district names from StatsOverview.vue and adding mock boundaries

const taipeiDistricts = [
  { name: '中山區', progress: 24, id: 'zhongshan' },
  { name: '大安區', progress: 15, id: 'daan' },
  { name: '信義區', progress: 12, id: 'xinyi' },
  { name: '中正區', progress: 8, id: 'zhongzheng' },
  { name: '松山區', progress: 5, id: 'songshan' },
  { name: '萬華區', progress: 3, id: 'wanhua' },
  { name: '北投區', progress: 0, id: 'beitou' },
  { name: '士林區', progress: 0, id: 'shilin' },
  { name: '南港區', progress: 0, id: 'nankang' },
  { name: '內湖區', progress: 0, id: 'neihu' },
  { name: '文山區', progress: 0, id: 'wenshan' },
  { name: '大同區', progress: 0, id: 'datong' }
];

// Approximate centers and bounds for each district
const districtData = {
  'zhongshan': { center: [25.0636, 121.5330], bounds: [[25.0486, 121.5180], [25.0786, 121.5480]] },
  'daan': { center: [25.0263, 121.5431], bounds: [[25.0113, 121.5281], [25.0413, 121.5581]] },
  'xinyi': { center: [25.0315, 121.5688], bounds: [[25.0165, 121.5538], [25.0465, 121.5838]] },
  'zhongzheng': { center: [25.0326, 121.5176], bounds: [[25.0176, 121.5026], [25.0476, 121.5326]] },
  'songshan': { center: [25.0538, 121.5574], bounds: [[25.0388, 121.5424], [25.0688, 121.5724]] },
  'wanhua': { center: [25.0327, 121.4996], bounds: [[25.0177, 121.4846], [25.0477, 121.5146]] },
  'beitou': { center: [25.1321, 121.5021], bounds: [[25.1171, 121.4871], [25.1471, 121.5171]] },
  'shilin': { center: [25.0938, 121.5217], bounds: [[25.0788, 121.5067], [25.1088, 121.5367]] },
  'nankang': { center: [25.0541, 121.6074], bounds: [[25.0391, 121.5924], [25.0691, 121.6224]] },
  'neihu': { center: [25.0827, 121.5816], bounds: [[25.0677, 121.5666], [25.0977, 121.5966]] },
  'wenshan': { center: [24.9960, 121.5706], bounds: [[24.9810, 121.5556], [25.0110, 121.5856]] },
  'datong': { center: [25.0657, 121.5158], bounds: [[25.0507, 121.5008], [25.0807, 121.5308]] }
};

// Create simplified GeoJSON with rectangular polygons
const features = taipeiDistricts.map(district => {
  const data = districtData[district.id];
  const [[minLat, minLng], [maxLat, maxLng]] = data.bounds;
  
  return {
    type: 'Feature',
    properties: {
      TNAME: district.name,
      name: district.name,
      id: district.id,
      progress: district.progress
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [minLng, minLat],
        [maxLng, minLat],
        [maxLng, maxLat],
        [minLng, maxLat],
        [minLng, minLat]
      ]]
    }
  };
});

const geojson = {
  type: 'FeatureCollection',
  features: features
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '../public/mock/districts_simple.json');

fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
console.log(`Simplified GeoJSON created with ${features.length} districts`);
console.log(`Saved to: ${outputPath}`);
