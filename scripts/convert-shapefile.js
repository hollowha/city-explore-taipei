// Convert Shapefile to GeoJSON
import shapefile from 'shapefile';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import proj4 from 'proj4';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shpPath = path.join(__dirname, '../public/other/extracted/G97_A_CADIST_P.shp');
const dbfPath = path.join(__dirname, '../public/other/G97_A_CADIST_P.dbf');
const outputPath = path.join(__dirname, '../public/mock/districts.json');

// Define TWD97 TM2 projection (EPSG:3826)
proj4.defs('EPSG:3826', '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

// Define WGS84 (EPSG:4326) - standard lat/lng
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

function convertCoordinates(coords) {
  if (Array.isArray(coords[0]) && Array.isArray(coords[0][0])) {
    // Polygon or MultiPolygon
    return coords.map(ring => convertCoordinates(ring));
  } else if (Array.isArray(coords[0])) {
    // LineString
    return coords.map(coord => {
      const [lng, lat] = proj4('EPSG:3826', 'EPSG:4326', [coord[0], coord[1]]);
      return [lng, lat];
    });
  } else {
    // Point
    const [lng, lat] = proj4('EPSG:3826', 'EPSG:4326', [coords[0], coords[1]]);
    return [lng, lat];
  }
}

async function convertShapefileToGeoJSON() {
  try {
    console.log('Reading shapefile...');
    const source = await shapefile.open(shpPath, dbfPath);
    
    const features = [];
    let result = await source.read();
    let index = 0;
    
    while (!result.done) {
      if (result.value) {
        const feature = result.value;
        
        // Convert TM2 coordinates to WGS84
        if (feature.geometry && feature.geometry.coordinates) {
          feature.geometry.coordinates = convertCoordinates(feature.geometry.coordinates);
        }
        
        // Try to decode district name from properties
        const districtName = feature.properties.TNAME || feature.properties.NAME || `District ${index + 1}`;
        
        // Clean up properties
        feature.properties = {
          name: districtName,
          id: `district-${index}`,
          progress: 0, // Will be updated based on exploration data
          TNAME: districtName,
          AREA: feature.properties.AREA,
          bounds: {
            min: [feature.properties.MIN_X, feature.properties.MIN_Y],
            max: [feature.properties.MAX_X, feature.properties.MAX_Y]
          }
        };
        
        features.push(feature);
        index++;
      }
      result = await source.read();
    }
    
    const geojson = {
      type: 'FeatureCollection',
      features: features
    };
    
    console.log(`Total features: ${features.length}`);
    
    // Print district names
    if (features.length > 0) {
      console.log('\nDistrict names:');
      features.forEach((f, i) => {
        console.log(`${i + 1}. ${f.properties.name}`);
      });
    }
    
    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
    console.log(`\nGeoJSON saved to: ${outputPath}`);
    console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('Error converting shapefile:', error);
  }
}

convertShapefileToGeoJSON();
