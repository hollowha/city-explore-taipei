# 如何使用行政區邊界資料

## 檔案說明

1. **原始 Shapefile 檔案**：
   - `public/other/G97_A_CADIST_P.shp` - 幾何形狀資料
   - `public/other/G97_A_CADIST_P.dbf` - 屬性資料（區域名稱等）
   - `public/other/G97_A_CADIST_P.shx` - 索引檔案

2. **轉換後的 GeoJSON 檔案**：
   - `public/mock/districts_simple.json` - 簡化版（12個台北市行政區）
   - `public/mock/districts.json` - 完整版（從 Shapefile 轉換，含詳細邊界）

## 在 MapView 中使用範例

### 1. 引入必要的套件和資料

```javascript
import { LGeoJson } from '@vue-leaflet/vue-leaflet';
import { fetchDistricts } from '../lib/api';

const districts = ref(null);
```

### 2. 載入行政區資料

```javascript
onMounted(async () => {
  // 載入行政區邊界
  districts.value = await fetchDistricts();
});
```

### 3. 在地圖上顯示行政區

```vue
<template>
  <l-map>
    <!-- 行政區邊界圖層 -->
    <l-geo-json
      v-if="districts"
      :geojson="districts"
      :options="districtOptions"
    />
  </l-map>
</template>
```

### 4. 設定行政區樣式

```javascript
const districtOptions = {
  style: (feature) => {
    const progress = feature.properties.progress || 0;
    // 根據探索進度設定顏色
    const opacity = 0.1 + (progress / 100) * 0.3;
    
    return {
      fillColor: '#93D4DF',
      fillOpacity: opacity,
      color: '#7BCBD9',
      weight: 2,
      opacity: 0.8
    };
  },
  onEachFeature: (feature, layer) => {
    const name = feature.properties.name || feature.properties.TNAME;
    const progress = feature.properties.progress || 0;
    
    // 綁定彈出視窗
    layer.bindPopup(`
      <div style="text-align: center;">
        <h3 style="margin: 0 0 8px 0;">${name}</h3>
        <div style="font-size: 24px; font-weight: bold; color: #93D4DF;">
          ${progress}%
        </div>
        <div style="font-size: 12px; color: #6C757D;">
          探索進度
        </div>
      </div>
    `);
    
    // 滑鼠懸停效果
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 0.5,
          weight: 3
        });
      },
      mouseout: (e) => {
        e.target.setStyle({
          fillOpacity: 0.1 + (progress / 100) * 0.3,
          weight: 2
        });
      }
    });
    
    // 加入區域標籤
    const center = layer.getBounds().getCenter();
    L.marker(center, {
      icon: L.divIcon({
        className: 'district-label',
        html: `<div style="
          background: rgba(255, 255, 255, 0.9);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: bold;
          color: #212529;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">${name}<br/><span style="font-size: 12px; color: #6C757D;">${progress}%</span></div>`,
        iconSize: [80, 40],
        iconAnchor: [40, 20]
      })
    }).addTo(map);
  }
};
```

### 5. 完整範例程式碼

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LGeoJson } from '@vue-leaflet/vue-leaflet';
import { fetchDistricts } from '../lib/api';
import L from 'leaflet';

const districts = ref(null);
const mapRef = ref(null);
const districtLabels = ref([]);

onMounted(async () => {
  districts.value = await fetchDistricts();
});

const districtOptions = {
  style: (feature) => {
    const progress = feature.properties.progress || 0;
    return {
      fillColor: getProgressColor(progress),
      fillOpacity: 0.3,
      color: '#7BCBD9',
      weight: 2,
      opacity: 0.8
    };
  },
  onEachFeature: (feature, layer) => {
    const name = feature.properties.name;
    const progress = feature.properties.progress || 0;
    
    layer.bindPopup(`
      <div class="district-popup">
        <h3>${name}</h3>
        <div class="progress-value">${progress}%</div>
        <div class="progress-label">探索進度</div>
      </div>
    `);
    
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 0.6, weight: 3 });
      },
      mouseout: (e) => {
        e.target.setStyle({ fillOpacity: 0.3, weight: 2 });
      }
    });
  }
};

function getProgressColor(progress) {
  if (progress >= 50) return '#A8E6CF'; // 綠色
  if (progress >= 20) return '#FFD700'; // 黃色
  if (progress >= 10) return '#FFB6D9'; // 粉紅
  return '#E9ECEF'; // 灰色
}
</script>

<style scoped>
.district-popup h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #212529;
}

.progress-value {
  font-size: 32px;
  font-weight: bold;
  color: #93D4DF;
  text-align: center;
}

.progress-label {
  font-size: 12px;
  color: #6C757D;
  text-align: center;
}
</style>
```

## 資料結構

### GeoJSON Feature Properties

```json
{
  "name": "中山區",
  "id": "zhongshan",
  "progress": 24,
  "TNAME": "中山區"
}
```

### 行政區列表（12個）

1. 中山區 (24%)
2. 大安區 (15%)
3. 信義區 (12%)
4. 中正區 (8%)
5. 松山區 (5%)
6. 萬華區 (3%)
7. 北投區 (0%)
8. 士林區 (0%)
9. 南港區 (0%)
10. 內湖區 (0%)
11. 文山區 (0%)
12. 大同區 (0%)

## 進階功能

### 1. 根據探索進度自動分區顏色

```javascript
function getDistrictColor(progress) {
  const colors = [
    { threshold: 0, color: '#E9ECEF' },
    { threshold: 10, color: '#FFB6D9' },
    { threshold: 20, color: '#FFD700' },
    { threshold: 50, color: '#A8E6CF' }
  ];
  
  for (let i = colors.length - 1; i >= 0; i--) {
    if (progress >= colors[i].threshold) {
      return colors[i].color;
    }
  }
  return colors[0].color;
}
```

### 2. 點擊行政區篩選地標

```javascript
layer.on('click', (e) => {
  const districtName = feature.properties.name;
  // 篩選該行政區的地標
  filterLandmarksByDistrict(districtName);
});
```

### 3. 顯示行政區統計資訊

```javascript
const districtStats = computed(() => {
  if (!districts.value) return [];
  
  return districts.value.features.map(feature => ({
    name: feature.properties.name,
    progress: feature.properties.progress,
    landmarks: getLandmarksInDistrict(feature),
    exploredRoads: getExploredRoadsInDistrict(feature)
  }));
});
```

## 注意事項

1. **效能考量**：如果行政區邊界過於複雜，可以使用 simplify 簡化多邊形
2. **座標系統**：確保所有資料都使用 WGS84 (EPSG:4326) 座標系統
3. **圖層順序**：行政區圖層應該在底層，地標圖層在上層
4. **互動衝突**：注意行政區點擊事件不要干擾地標點擊事件

## API 函數

```javascript
// 在 src/lib/api.js 中已提供
export async function fetchDistricts() {
  const url = `/mock/districts_simple.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load districts');
  return await res.json();
}
```
