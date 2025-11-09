<template>
  <div class="main">
    <!-- Floating Stats Card -->
    <div class="floating-stats fade-in" v-if="progressPct !== null">
      <div class="stats-card-wrapper">
        <div class="stats-card" @click="goToExplore">
          <div class="mission-icon">
            <Footprints :size="32" stroke-width="2" />
          </div>
          <div class="mission-content">
            <h3 class="mission-title">新路 1000 步</h3>
            <div class="mission-progress">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: '62%' }"></div>
              </div>
              <span class="progress-text">620 / 1000 m</span>
            </div>
          </div>
          <div class="view-more">
            <span>查看詳情</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
        <!-- Quick Action Buttons -->
        <div class="quick-actions">
          <button class="quick-action-btn" @click.stop="characterPanelOpen = true" aria-label="角色選擇">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="quick-action-label">角色選擇</span>
          </button>
          <button class="quick-action-btn" @click.stop="jogPlannerOpen = true" aria-label="慢跑規劃">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 17l1-3 2-1 1-4 3 1"/>
              <circle cx="16" cy="5" r="1"/>
            </svg>
            <span class="quick-action-label">慢跑規劃</span>
          </button>
          <button class="quick-action-btn" @click.stop="goToExplore" aria-label="探索進度">
            <Map :size="28" stroke-width="2" />
            <span class="quick-action-label">探索</span>
            <span class="quick-action-badge">18%</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Toggle Button (FAB style) -->
    <button 
      v-if="!filterPanelOpen" 
      class="fab filter-fab" 
      @click="filterPanelOpen = true"
      aria-label="打開篩選面板"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
    </button>

    <!-- Character Selection Panel -->
    <div class="character-panel" :class="{ 'character-panel-open': characterPanelOpen }">
      <div class="character-header">
        <h3 class="character-title">角色選擇</h3>
        <button class="character-toggle" @click="characterPanelOpen = !characterPanelOpen" aria-label="切換角色選擇面板">
          <svg v-if="!characterPanelOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <div class="character-content">
        <div class="character-grid">
          <div 
            v-for="character in characters" 
            :key="character.id"
            class="character-item"
            :class="{ 
              'selected': selectedCharacter === character.id,
              'locked': character.locked 
            }"
            @click="selectCharacter(character.id)"
          >
            <div class="character-image-wrapper">
              <img :src="character.image" :alt="character.name" class="character-image" />
              <div v-if="character.locked" class="lock-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
            <div class="character-name">{{ character.name }}</div>
            <div v-if="character.locked" class="unlock-condition">{{ character.unlockCondition }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jog Planner Panel -->
    <div class="jog-planner" :class="{ 'jog-planner-open': jogPlannerOpen }">
      <div class="jog-header">
        <h3 class="jog-title">慢跑規劃</h3>
        <button class="jog-toggle" @click="jogPlannerOpen = !jogPlannerOpen" aria-label="切換慢跑規劃面板">
          <svg v-if="!jogPlannerOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <div class="jog-content">
        <label class="jog-row">
          <span>公里數</span>
          <input class="jog-input" type="number" step="0.5" min="1" max="30" v-model.number="jogTargetKm" />
          <span class="unit">km</span>
        </label>
        <div class="jog-actions">
          <button class="jog-btn primary" :disabled="isJogPlanning" @click="planJogRoute()">
            {{ isJogPlanning ? '規劃中…' : '開始規劃' }}
          </button>
          <button class="jog-btn" :disabled="isJogPlanning || jogRouteCoords.length===0" @click="clearJogRoute()">清除</button>
        </div>
        <div class="jog-summary" v-if="jogRouteInfo">
          <div>距離：約 {{ (jogRouteInfo.distance/1000).toFixed(2) }} km</div>
          <div v-if="jogRouteInfo.deltaKm !== undefined">誤差：約 ±{{ jogRouteInfo.deltaKm.toFixed(2) }} km</div>
        </div>
      </div>
    </div>

    <!-- Filter Panel -->
    <div class="filter-panel" :class="{ 'filter-panel-open': filterPanelOpen }">
      <div class="filter-header">
        <h3 class="filter-title">篩選地標</h3>
        <button class="filter-toggle" @click="filterPanelOpen = !filterPanelOpen" aria-label="切換篩選面板">
          <svg v-if="!filterPanelOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <div class="filter-content">
        <div class="filter-section">
          <div class="filter-label">類別</div>
          <div class="filter-options">
            <label class="filter-option" v-for="cat in filterCategories" :key="cat.type">
              <input 
                type="checkbox" 
                :value="cat.type" 
                v-model="selectedFilters"
                @change="applyFilters"
              />
              <span class="filter-checkbox"></span>
              <span class="filter-color-dot" :style="{ backgroundColor: cat.color }"></span>
              <span class="filter-name">{{ cat.name }}</span>
              <span class="filter-count">{{ cat.count }}</span>
            </label>
          </div>
        </div>
        <div class="filter-section">
          <div class="filter-label">狀態</div>
          <div class="filter-options">
            <label class="filter-option">
              <input 
                type="checkbox" 
                value="unlocked" 
                v-model="statusFilters"
                @change="applyFilters"
              />
              <span class="filter-checkbox"></span>
              <span class="filter-name">已解鎖</span>
            </label>
            <label class="filter-option">
              <input 
                type="checkbox" 
                value="locked" 
                v-model="statusFilters"
                @change="applyFilters"
              />
              <span class="filter-checkbox"></span>
              <span class="filter-name">未解鎖</span>
            </label>
          </div>
        </div>
        <div class="filter-section">
          <div class="filter-label">區域選擇</div>
          <button 
            class="selection-tool-button"
            :class="{ active: selectionMode }"
            @click="toggleSelectionMode"
          >
            <svg v-if="!selectionMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 4"></rect>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{{ selectionMode ? '完成選擇' : '框選區域' }}</span>
          </button>
          <div v-if="selectedDistricts.length > 0" class="selected-districts">
            <div class="selected-district-tag" v-for="district in selectedDistricts" :key="district">
              {{ district }}
              <button class="remove-district" @click="removeSelectedDistrict(district)">×</button>
            </div>
          </div>
        </div>
        <button class="filter-reset" @click="resetFilters">
          重置篩選
        </button>
      </div>
    </div>

    <!-- Map Container -->
    <div class="map-root">
      <l-map ref="mapRef" :zoom="zoom" :center="center" :use-global-leaflet="false" :zoomControl="false" @update:center="onMove" @update:zoom="onZoom">
        <l-tile-layer :url="tileUrl" :attribution="attribution" />
        
        <!-- District boundaries - bottom layer -->
        <l-geo-json
          v-if="districts"
          :geojson="districts"
          :options="districtOptions"
          :options-style="districtStyleFunction"
        />
        
        <!-- Current Location Marker - animated breathing pulse -->
        <l-marker
          v-if="userLocation"
          :lat-lng="userLocation"
          :icon="userIcon"
          :z-index-offset="1200"
        />
        
        <!-- Park landmarks as small subtle green dots -->
        <l-circle-marker
          v-for="lm in parkLandmarks"
          :key="lm.id"
          :lat-lng="[lm.lat, lm.lng]"
          :radius="3"
          :color="'#6BBF59'"
          :fillColor="'#6BBF59'"
          :fillOpacity="0.8"
          :weight="0"
        >
          <l-popup :options="{ closeButton: false, className: 'landmark-popup', maxWidth: 220, closeOnClick: true, autoClose: true }">
            <div class="popup-content">
              <div class="popup-header">
                <h3>{{ lm.name }}</h3>
                <span class="badge" :class="lm.unlocked ? 'badge-success' : 'badge-locked'">
                  {{ lm.unlocked ? '已解鎖' : '未解鎖' }}
                </span>
              </div>
              <p class="popup-desc">{{ lm.description || '探索此地標以解鎖更多資訊' }}</p>
              <div v-if="lm.category === 'park'" class="popup-details">
                <div class="detail-item" v-if="lm.area">
                  <span class="detail-icon">📐</span>
                  <span class="detail-text">面積: {{ lm.area }} m²</span>
                </div>
                <div class="detail-item" v-if="lm.sports">
                  <span class="detail-icon">⚽</span>
                  <span class="detail-text">運動設施: {{ lm.sports }}</span>
                </div>
                <div class="detail-item" v-if="lm.playarea">
                  <span class="detail-icon">🎮</span>
                  <span class="detail-text">遊樂場: {{ lm.playarea }} m²</span>
                </div>
                <div class="detail-item" v-if="lm.phone">
                  <span class="detail-icon">📞</span>
                  <span class="detail-text">{{ lm.phone }}</span>
                </div>
              </div>
              <div class="popup-footer" v-if="!lm.unlocked">
                <span class="hint-text">📍 前往附近即可解鎖</span>
              </div>
              <!-- Navigation button for all landmarks including parks -->
              <div class="popup-actions">
                <button class="nav-action-btn" @click="navigateTo(lm)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
                  </svg>
                  <span>導航至此</span>
                </button>
              </div>
            </div>
          </l-popup>
        </l-circle-marker>

        <!-- YouBike stations as yellow dots with availability popup -->
        <l-circle-marker
          v-for="ub in youbikeStations"
          :key="ub.id"
          :lat-lng="[ub.lat, ub.lng]"
          :radius="4"
          :color="'#E7A43C'"
          :fillColor="'#E7A43C'"
          :fillOpacity="0.95"
          :weight="0"
        >
          <l-popup :options="{ closeButton: false, className: 'landmark-popup', maxWidth: 220, closeOnClick: true, autoClose: true }">
            <div class="popup-content">
              <div class="popup-header">
                <h3>{{ ub.name }}</h3>
                <span class="badge badge-success">YouBike</span>
              </div>
              <p class="popup-desc">{{ ub.description }}</p>
              <div class="popup-details">
                <div class="detail-item">
                  <span class="detail-icon">🚲</span>
                  <span class="detail-text">可租借：{{ ub.bikesAvailable }} / {{ ub.totalDocks }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">⬇️</span>
                  <span class="detail-text">可停放：{{ ub.docksAvailable }}</span>
                </div>
                <div class="detail-item" v-if="ub.updatedAt">
                  <span class="detail-icon">🕒</span>
                  <span class="detail-text">更新：{{ ub.updatedAt }}</span>
                </div>
              </div>
              <div class="popup-actions">
                <button class="nav-action-btn" @click="navigateTo(ub)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
                  </svg>
                  <span>導航至此</span>
                </button>
              </div>
            </div>
          </l-popup>
        </l-circle-marker>

        <!-- Other landmarks (e.g., sports centers) keep custom markers -->
        <l-marker
          v-for="lm in otherLandmarks"
          :key="lm.id"
          :lat-lng="[lm.lat, lm.lng]"
          :icon="makeLandmarkIcon(lm)"
          :z-index-offset="900"
          @click="openLandmark(lm)"
        >
          <l-popup :options="{ closeButton: false, className: 'landmark-popup', maxWidth: 220, closeOnClick: true, autoClose: true }">
            <div class="popup-content">
              <div class="popup-header">
                <h3>{{ lm.name }}</h3>
                <span class="badge" :class="lm.unlocked ? 'badge-success' : 'badge-locked'">
                  {{ lm.unlocked ? '已解鎖' : '未解鎖' }}
                </span>
              </div>
              <p class="popup-desc">{{ lm.description || '探索此地標以解鎖更多資訊' }}</p>
              <div v-if="lm.category === 'sports'" class="popup-details">
                <div class="detail-item" v-if="lm.description">
                  <span class="detail-icon">📍</span>
                  <span class="detail-text">{{ lm.description }}</span>
                </div>
                <div class="detail-item" v-if="lm.phone">
                  <span class="detail-icon">📞</span>
                  <span class="detail-text">{{ lm.phone }}</span>
                </div>
              </div>
              <div v-if="lm.category === 'bike'" class="popup-details">
                <div class="detail-item" v-if="lm.riverside">
                  <span class="detail-icon">🏞️</span>
                  <span class="detail-text">河濱公園: {{ lm.riverside }}</span>
                </div>
                <div class="detail-item" v-if="lm.description">
                  <span class="detail-icon">ℹ️</span>
                  <span class="detail-text">{{ lm.description }}</span>
                </div>
              </div>
              <div class="popup-footer" v-if="!lm.unlocked">
                <span class="hint-text">📍 前往附近即可解鎖</span>
              </div>
              <!-- Navigation button for non-park landmarks -->
              <div class="popup-actions">
                <button class="nav-action-btn" @click="navigateTo(lm)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
                  </svg>
                  <span>導航至此</span>
                </button>
              </div>
            </div>
          </l-popup>
        </l-marker>

        <!-- Route polyline -->
        <l-polyline
          v-if="routeCoords.length"
          :lat-lngs="routeCoords"
          :weight="6"
          color="#37A7E8"
          :opacity="0.8"
          lineCap="round"
          lineJoin="round"
        />

        <!-- Jog route with gradient segments and directional arrows -->
        <template v-if="jogRouteCoords.length > 1">
          <l-polyline
            v-for="(seg, si) in jogGradientSegments"
            :key="'jog-seg-' + si"
            :lat-lngs="seg.coords"
            :weight="6"
            :color="seg.color"
            :opacity="0.95"
            lineCap="'round'"
            lineJoin="'round'"
          />
          <!-- Direction arrows placed every Nth segment center -->
          <l-marker
            v-for="(arrow, ai) in jogArrows"
            :key="'jog-arrow-' + ai"
            :lat-lng="arrow.latlng"
            :icon="arrow.icon"
            :z-index-offset="1100"
          />
        </template>
      </l-map>
    </div>

    <!-- Loading Overlay for Routing -->
    <div v-if="isRouting" class="routing-overlay">
      <div class="routing-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-text">規劃路線中...</div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button class="fab" @click="centerToUser" aria-label="回到我的位置">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </button>

    <!-- Route Info Panel -->
    <div v-if="routeInfo" class="route-panel fade-in">
      <div class="route-header">
        <span class="route-icon">🚶</span>
        <div class="route-details">
          <div class="route-dest">前往 {{ routeInfo.destination }}</div>
          <div class="route-stats">
            <span class="route-distance">{{ (routeInfo.distance / 1000).toFixed(2) }} km</span>
            <span class="route-time">約 {{ Math.ceil((routeInfo.distance / 1000) / 4.5 * 60) }} 分鐘</span>
          </div>
        </div>
      </div>
      <button class="clear-route-btn" @click="clearRoute" aria-label="清除路線">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { LMap, LTileLayer, LMarker, LCircleMarker, LPopup, LPolyline, LGeoJson } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import { fetchMockExploration, fetchMockLandmarks, fetchParks, fetchSportsCenters, fetchBikeScenery, fetchYouBikeStations, fetchDistricts } from '../lib/api';
import { Footprints, Map, MapPin, Bike, Dumbbell, TreePine, Store, Navigation } from 'lucide-vue-next';

const router = useRouter();
const zoom = ref(14);
const center = ref([25.02168621343786, 121.53525160460659]); // preset center
// Using CartoDB Voyager for colorful, bright map with clear labels
const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const attribution = '© OpenStreetMap © CartoDB';

const exploredSegments = ref([]);
const unexploredSegments = ref([]);
const landmarks = ref([]);
const districts = ref(null);
// Preset user location so marker shows even before permission
const userLocation = ref([25.02168621343786, 121.53525160460659]);
const userIcon = ref(null);
const mapRef = ref(null);
const hasCenteredUser = ref(false);
const routeCoords = ref([]);
const routeInfo = ref(null);
const pendingDestination = ref(null);
const isRouting = ref(false);

// Jog planner state
const jogPlannerOpen = ref(false);
const jogTargetKm = ref(3);
const isJogPlanning = ref(false);
const jogRouteCoords = ref([]);
const jogRouteInfo = ref(null);

// Character selection state
const selectedCharacter = ref('cat');
const characterPanelOpen = ref(false);
const characters = [
  { id: 'cat', name: '橘貓', image: '/characters/cat.gif', locked: false },
  { id: 'dog', name: '棒球狗', image: '/characters/dog.gif', locked: false },
  { id: 'sheep', name: '綿羊', image: '/characters/sheep.gif', locked: true, unlockCondition: '完成 3 個成就解鎖' }
];

// Derived jog route gradient segments & arrows
const jogGradientSegments = computed(() => {
  const coords = jogRouteCoords.value;
  if (!coords || coords.length < 2) return [];
  const total = coords.length - 1; // segment count
  return coords.slice(0, -1).map((pt, i) => {
    const next = coords[i + 1];
    // progression 0..1 around loop; treat final segment smoothly
    let t = i / total;
    // Gradient from light theme blue (#93D4DF) near start to deep teal (#468D9B)
    const startColor = [147, 212, 223];
    const endColor = [70, 141, 155];
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t);
    const color = `rgb(${r}, ${g}, ${b})`;
    return { coords: [pt, next], color };
  });
});

const jogArrows = computed(() => {
  const segs = jogGradientSegments.value;
  if (!segs.length) return [];
  const arrows = [];
  const step = Math.max(1, Math.floor(segs.length / 6)); // place up to ~6 arrows
  for (let i = 0; i < segs.length; i += step) {
    const seg = segs[i];
    const [a, b] = seg.coords;
    const latMid = (a[0] + b[0]) / 2;
    const lngMid = (a[1] + b[1]) / 2;
    // bearing angle for rotation
    const dy = b[0] - a[0];
    const dx = b[1] - a[1];
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;
    const icon = L.divIcon({
      className: 'jog-arrow-icon',
      html: `<div class="jog-arrow" style="transform: rotate(${angleDeg}deg);">➤</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    arrows.push({ latlng: [latMid, lngMid], icon });
  }
  return arrows;
});

// Filter panel state
const filterPanelOpen = ref(false);
const selectedFilters = ref([]);
const statusFilters = ref(['unlocked', 'locked']);
const selectionMode = ref(false);
const selectedDistricts = ref([]);

const filterCategories = computed(() => {
  const categories = [
    { type: 'park', name: '公園綠地', color: '#6BBF59' },
    { type: 'youbike', name: 'YouBike', color: '#E7A43C' },
    { type: 'sports', name: '運動中心', color: '#FF8C42' },
    { type: 'bike', name: '自行車道河濱景點', color: '#4A90E2' }
  ];
  
  if (!landmarks.value || !Array.isArray(landmarks.value)) {
    return categories.map(cat => ({ ...cat, count: 0 }));
  }
  
  return categories.map(cat => ({
    ...cat,
    count: landmarks.value.filter(l => l && l.category === cat.type).length
  }));
});

const exploredCount = computed(() => exploredSegments.value.length);
const totalSegments = computed(() => exploredSegments.value.length + unexploredSegments.value.length);
const progressPct = computed(() => totalSegments.value ? Math.round(exploredCount.value / totalSegments.value * 100) : null);
const unlockedLandmarks = computed(() => landmarks.value.filter(l => l.unlocked).length);

// Filtered landmarks
const filteredLandmarks = computed(() => {
  if (!landmarks.value || !Array.isArray(landmarks.value)) {
    return [];
  }
  
  let filtered = landmarks.value;
  
  // Filter by category
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(lm => lm && selectedFilters.value.includes(lm.category));
  }
  
  // Filter by status
  if (statusFilters.value.length > 0 && statusFilters.value.length < 2) {
    if (statusFilters.value.includes('unlocked')) {
      filtered = filtered.filter(lm => lm && lm.unlocked);
    } else if (statusFilters.value.includes('locked')) {
      filtered = filtered.filter(lm => lm && !lm.unlocked);
    }
  }
  
  return filtered;
});

const parkLandmarks = computed(() => {
  // zoom <= 15 時不顯示公園標記以優化效能
  if (zoom.value <= 15) return [];
  if (!filteredLandmarks.value || !Array.isArray(filteredLandmarks.value)) return [];
  return filteredLandmarks.value.filter(l => l && l.category === 'park');
});

const youbikeStations = computed(() => {
  // zoom <= 15 時不顯示 YouBike 站點以優化效能
  if (zoom.value <= 15) return [];
  if (!filteredLandmarks.value || !Array.isArray(filteredLandmarks.value)) return [];
  return filteredLandmarks.value.filter(l => l && l.category === 'youbike');
});

const otherLandmarks = computed(() => {
  if (!filteredLandmarks.value || !Array.isArray(filteredLandmarks.value)) return [];
  return filteredLandmarks.value.filter(l => l && l.category !== 'park' && l.category !== 'youbike');
});

onMounted(async () => {
  const exploration = await fetchMockExploration();
  exploredSegments.value = exploration.explored;
  unexploredSegments.value = exploration.unexplored;

  // Load districts
  try {
    const districtsData = await fetchDistricts();
    // 為每個 feature 添加樣式屬性
    if (districtsData && districtsData.features) {
      districtsData.features.forEach(feature => {
        const districtId = feature.properties.id;
        const progress = feature.properties.progress || 0;
        feature.properties.fillColor = getDistrictColor(districtId);
        feature.properties.fillOpacity = getDistrictOpacity(progress);
        feature.properties.color = getDistrictColor(districtId);
        console.log('Setting style for district:', districtId, getDistrictColor(districtId));
      });
    }
    districts.value = districtsData;
    console.log('Loaded districts:', districts.value.features.length);
  } catch (error) {
    console.warn('Failed to load districts:', error);
  }

  // Load parks, sports centers, bike scenery and YouBike data
  try {
    const [parksData, sportsData, bikeData, ubikeData] = await Promise.all([
      fetchParks().catch(err => { console.warn('Failed to load parks', err); return []; }),
      fetchSportsCenters().catch(err => { console.warn('Failed to load sports centers', err); return []; }),
      fetchBikeScenery().catch(err => { console.warn('Failed to load bike scenery', err); return []; }),
      fetchYouBikeStations().catch(err => { console.warn('Failed to load YouBike stations', err); return []; })
    ]);
    const combined = [...parksData, ...sportsData, ...bikeData, ...ubikeData];
    if (combined.length) {
      landmarks.value = combined;
      console.log(`Loaded ${parksData.length} parks, ${sportsData.length} sports centers, ${bikeData.length} bike spots and ${ubikeData.length} YouBike stations`);
    } else {
      console.warn('No real data loaded; falling back to mock landmarks.');
      const landmarksData = await fetchMockLandmarks();
      landmarks.value = landmarksData.map((l, idx) => ({
        ...l,
        unlocked: idx < 3,
        description: l.description || '這是一個有趣的地標，探索附近以解鎖更多資訊。'
      }));
    }
  } catch (error) {
    console.error('Failed loading real data, falling back:', error);
    const landmarksData = await fetchMockLandmarks();
    landmarks.value = landmarksData.map((l, idx) => ({
      ...l,
      unlocked: idx < 3,
      description: l.description || '這是一個有趣的地標，探索附近以解鎖更多資訊。'
    }));
  }

  // Get user's current location
  // Build icon immediately for preset location, then try to update by geolocation
  if (userLocation.value) buildUserIcon();
  getUserLocation();
});

// Clean up resources on component unmount to prevent memory leaks
onBeforeUnmount(() => {
  // Clear all district labels
  if (districtLabels.value && districtLabels.value.length > 0) {
    districtLabels.value.forEach(label => {
      if (label && mapRef.value && mapRef.value.leafletObject) {
        try {
          mapRef.value.leafletObject.removeLayer(label);
        } catch (e) {
          console.warn('Error removing district label:', e);
        }
      }
    });
    districtLabels.value = [];
  }
  
  // Clear route data
  routeCoords.value = [];
  routeInfo.value = null;
  
  // Clear landmarks to free memory
  landmarks.value = [];
  // Clear jog route data
  jogRouteCoords.value = [];
  jogRouteInfo.value = null;
  
  console.log('MapView cleaned up');
});

// Watch for districts to be loaded and add labels to map
watch([districts, mapRef], ([districtsData, map]) => {
  if (districtsData && map && map.leafletObject) {
    nextTick(() => {
      // Clear existing labels
      districtLabels.value.forEach(label => {
        if (label && map.leafletObject) {
          map.leafletObject.removeLayer(label);
        }
      });
      districtLabels.value = [];
      
      // Add new labels for each district
      districtsData.features.forEach(feature => {
        const name = feature.properties.name;
        const progress = feature.properties.progress || 0;
        const districtId = feature.properties.id;
        
        // Calculate center from bounds
        const coords = feature.geometry.coordinates[0];
        let sumLat = 0, sumLng = 0, count = 0;
        coords.forEach(([lng, lat]) => {
          sumLat += lat;
          sumLng += lng;
          count++;
        });
        const centerLat = sumLat / count;
        const centerLng = sumLng / count;
        
        const label = L.marker([centerLat, centerLng], {
          icon: L.divIcon({
            className: 'district-label-wrapper',
            html: `<div class="district-label-content" style="white-space: nowrap; font-weight: bold; text-align: center; color: ${getDistrictDarkColor(districtId)}; -webkit-text-stroke: 2px white; paint-order: stroke fill;">
              <div style="font-size: 15px;">${name}</div>
              <div style="font-size: 13px; margin-top: 1px;">${progress}% 探索度</div>
            </div>`,
            iconSize: [120, 40],
            iconAnchor: [60, 20]
          }),
          zIndexOffset: 1000,
          interactive: false
        });
        
        label.addTo(map.leafletObject);
        districtLabels.value.push(label);
      });
      
      console.log(`Added ${districtLabels.value.length} district labels`);
    });
  }
});

function getUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = [position.coords.latitude, position.coords.longitude];
        buildUserIcon();
        // Animate map to user location on first fix
        scheduleFlyToUser();
      },
      (error) => {
        console.warn('Location access denied or unavailable:', error);
  // Fallback to preset location
  userLocation.value = [25.02168621343786, 121.53525160460659];
        buildUserIcon();
        scheduleFlyToUser();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  } else {
  // Geolocation not supported - use preset
  userLocation.value = [25.02168621343786, 121.53525160460659];
    buildUserIcon();
    scheduleFlyToUser();
  }
}

function onMove(val) { center.value = val; }
function onZoom(val) { zoom.value = val; }
function centerToUser() {
  if (userLocation.value) {
    flyToUser(true);
  } else {
    getUserLocation();
  }
}
function openLandmark(lm) {
  console.log('Open landmark:', lm.name);
}
function goToExplore() {
  router.push('/explore');
}

// District styling
const districtColors = {
  'beitou': '#E8B4D4',      // 淡粉紅
  'shilin': '#B8E0D2',      // 淡青綠
  'neihu': '#A8C5E4',       // 淡藍
  'zhongshan': '#FFE5A0',   // 淡黃
  'datong': '#E5C6FF',      // 淡紫
  'songshan': '#FFD6A5',    // 淡橘
  'nankang': '#C5E1A5',     // 淡綠
  'zhongzheng': '#FFCCBC',  // 淡橘粉
  'xinyi': '#B2DFDB',       // 淡青
  'wanhua': '#F8BBD0',      // 淡玫瑰
  'daan': '#D1C4E9',        // 淡靛紫
  'wenshan': '#C5CAE9'      // 淡藍紫
};

const districtDarkColors = {
  'beitou': '#C2558B',      // 深粉紅
  'shilin': '#5FA896',      // 深青綠
  'neihu': '#5E88C4',       // 深藍
  'zhongshan': '#D4A800',   // 深黃
  'datong': '#9B6FD9',      // 深紫
  'songshan': '#E6962A',    // 深橘
  'nankang': '#7CB342',     // 深綠
  'zhongzheng': '#F07C5E',  // 深橘粉
  'xinyi': '#5FA896',       // 深青
  'wanhua': '#E91E63',      // 深玫瑰
  'daan': '#7E57C2',        // 深靛紫
  'wenshan': '#5C6BC0'      // 深藍紫
};

function getDistrictColor(districtId) {
  return districtColors[districtId] || '#E9ECEF';
}

function getDistrictDarkColor(districtId) {
  return districtDarkColors[districtId] || '#6C757D';
}

function getDistrictOpacity(progress) {
  // 根據探索進度調整透明度
  return 0.3 + (progress / 100) * 0.4; // 0.3 到 0.7
}

const districtStyleFunction = (feature) => {
  // 如果 feature.properties 中已經有顏色，直接使用
  if (feature.properties.fillColor) {
    console.log('Using pre-set color for:', feature.properties.id, feature.properties.fillColor);
    return {
      fillColor: feature.properties.fillColor,
      fillOpacity: feature.properties.fillOpacity || 0.5,
      color: feature.properties.color,
      weight: 2,
      opacity: 0.8
    };
  }
  
  // 否則動態計算
  const districtId = feature.properties.id;
  const progress = feature.properties.progress || 0;
  const fillColor = getDistrictColor(districtId);
  console.log('Calculating color for:', districtId, fillColor);
  return {
    fillColor: fillColor,
    fillOpacity: getDistrictOpacity(progress),
    color: fillColor,
    weight: 2,
    opacity: 0.8
  };
};

const districtOptions = {
  style: districtStyleFunction,
  onEachFeature: (feature, layer) => {
    const name = feature.properties.name;
    const progress = feature.properties.progress || 0;
    
    layer.bindPopup(`
      <div style="text-align: center; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #212529;">${name}</h3>
        <div style="font-size: 32px; font-weight: bold; color: #93D4DF; margin: 8px 0;">
          ${progress}%
        </div>
        <div style="font-size: 12px; color: #6C757D;">
          探索進度
        </div>
      </div>
    `, { closeButton: true, className: 'district-popup' });
    
    layer.on({
      click: (e) => {
        if (selectionMode.value) {
          const index = selectedDistricts.value.indexOf(name);
          if (index > -1) {
            selectedDistricts.value.splice(index, 1);
          } else {
            selectedDistricts.value.push(name);
          }
          console.log('Selected districts:', selectedDistricts.value);
        }
      },
      mouseover: (e) => {
        if (selectionMode.value) {
          e.target.setStyle({
            fillOpacity: 0.9,
            weight: 4,
            color: '#FFD700'
          });
        } else {
          e.target.setStyle({
            fillOpacity: 0.8,
            weight: 3
          });
        }
      },
      mouseout: (e) => {
        const progress = feature.properties.progress || 0;
        const districtId = feature.properties.id;
        const isSelected = selectedDistricts.value.includes(name);
        e.target.setStyle({
          fillOpacity: isSelected ? 0.7 : getDistrictOpacity(progress),
          weight: isSelected ? 3 : 2,
          color: isSelected ? '#FFD700' : getDistrictColor(districtId)
        });
      }
    });
  }
};

// 存儲所有區域標籤
const districtLabels = ref([]);


function getCategoryIcon(category) {
  const iconMap = {
    'culture': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 10h16"/><path d="M4 14h16"/><path d="M4 18h16"/></svg>',
    'transport': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8L12 21 8 3z"/><path d="M3 8h18"/></svg>',
    'park': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13V2l8 4-8 7-8-7 8-4z"/><path d="M17 22h-1a4 4 0 0 1-4-4V8"/><path d="M7 22h1a4 4 0 0 0 4-4V8"/></svg>',
    'market': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/></svg>',
    'sports': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>',
    'food': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="4"/><line x1="10" x2="10" y1="1" y2="4"/><line x1="14" x2="14" y1="1" y2="4"/></svg>',
    'bike': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>',
    'youbike': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>',
    'landmark': '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
  };
  return iconMap[category] || iconMap['landmark'];
}

function getCategoryColor(category) {
  const colorMap = {
    'park': '#A8E6CF',
    'sports': '#FFD700',
    'culture': '#FFB6D9',
    'bike': '#93D4DF',
    'youbike': '#E7A43C',
    'market': '#DDA0DD',
    'food': '#FFB347',
    'transport': '#B0C4DE'
  };
  return colorMap[category] || '#93D4DF';
}

function makeLandmarkIcon(lm) {
  const iconSvg = getCategoryIcon(lm.category);
  const unlockedClass = lm.unlocked ? 'unlocked' : '';
  const categoryClass = `category-${lm.category}`;
  const html = `
    <div class="landmark-marker ${unlockedClass} ${categoryClass}">
      <div class="marker-glow"></div>
      <div class="marker-circle"><span class="marker-icon">${iconSvg}</span></div>
      <div class="marker-stem"></div>
      <div class="marker-dot"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'landmark-wrapper',
    iconSize: [50, 60],
    iconAnchor: [25, 55]
  });
}

function buildUserIcon() {
  if (!userLocation.value) return;
  const character = characters.find(c => c.id === selectedCharacter.value);
  const imageSrc = character ? character.image : '/characters/cat.png';
  const html = `
    <div class="user-location-marker">
      <div class="pulse-ring"></div>
      <img src="${imageSrc}" alt="character" class="character-icon" />
    </div>`;
  userIcon.value = L.divIcon({
    html,
    className: 'user-location-wrapper',
    iconSize: [60, 60],
    iconAnchor: [30, 30]
  });
}

function selectCharacter(characterId) {
  const character = characters.find(c => c.id === characterId);
  if (character && character.locked) {
    return; // Don't allow selecting locked characters
  }
  selectedCharacter.value = characterId;
  buildUserIcon();
  characterPanelOpen.value = false;
}

function scheduleFlyToUser() {
  if (hasCenteredUser.value) return;
  // wait for map instance and DOM paint
  nextTick(() => setTimeout(() => flyToUser(true), 50));
}

function flyToUser(animate = true) {
  if (!userLocation.value) return;
  const map = mapRef.value && mapRef.value.leafletObject ? mapRef.value.leafletObject : null;
  if (!map) return;
  hasCenteredUser.value = true;
  // Use flyTo to pan and zoom smoothly
  try {
    map.flyTo(userLocation.value, Math.max(zoom.value || 14, 17), { animate, duration: 1.2, easeLinearity: 0.25 });
  } catch (e) {
    // Fallback if flyTo not available
    map.setView(userLocation.value, Math.max(zoom.value || 14, 17), { animate });
  }
}

// Attach click handlers for navigation buttons on markers (removed duplicate watch)
watch(otherLandmarks, () => {
  nextTick(() => {
    setTimeout(() => {
      // Remove old event listeners before adding new ones
      document.querySelectorAll('.nav-btn').forEach(btn => {
        const oldBtn = btn.cloneNode(true);
        btn.parentNode?.replaceChild(oldBtn, btn);
      });
      
      // Add new event listeners
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const id = btn.getAttribute('data-id');
          const target = otherLandmarks.value.find(l => l.id === id);
          if (target) navigateTo(target);
        }, { once: true });
      });
    }, 100);
  });
});

// Watch for location updates to resume pending route planning
watch(userLocation, val => {
  if (val && pendingDestination.value) {
    planRoute(pendingDestination.value);
    pendingDestination.value = null;
  }
});

async function navigateTo(lm) {
  console.log('Navigate to:', lm.name);
  await planRoute({ lat: lm.lat, lng: lm.lng, name: lm.name });
}

async function planRoute(dest) {
  try {
    if (!userLocation.value) {
      pendingDestination.value = dest;
      getUserLocation();
      return;
    }
    isRouting.value = true;
    const from = { lat: userLocation.value[0], lng: userLocation.value[1] };
    const url = `https://router.project-osrm.org/route/v1/foot/${from.lng},${from.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&alternatives=false&steps=false`;
    console.log('Fetching route from OSRM...', url);
    const res = await fetch(url);
    console.log('OSRM response status:', res.status);
    if (!res.ok) throw new Error(`Routing failed with status ${res.status}`);
    const data = await res.json();
    console.log('OSRM response data:', data);
    if (!data.routes || !data.routes[0]) throw new Error('No route found');
    const route = data.routes[0];
    routeInfo.value = { 
      distance: route.distance, 
      duration: route.duration,
      destination: dest.name || '目的地'
    };
    // Convert [lng, lat] -> [lat, lng]
    routeCoords.value = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    console.log(`Route planned: ${(route.distance / 1000).toFixed(2)} km, ${Math.ceil(route.duration / 60)} min`);
    // Fit route bounds (non-critical)
    const map = mapRef.value && mapRef.value.leafletObject ? mapRef.value.leafletObject : null;
    if (map && routeCoords.value.length > 1) {
      try {
        const bounds = L.latLngBounds(routeCoords.value);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
      } catch (boundsErr) {
        console.warn('Bounds fitting failed (route still drawn):', boundsErr);
      }
    }
  } catch (e) {
    console.error('Plan route error:', e);
    const alreadyRendered = routeCoords.value.length > 0 && routeInfo.value;
    if (!alreadyRendered) {
      alert('無法規劃路線，請稍後再試');
    } else {
      console.warn('Route drawn but non-critical error occurred.');
    }
  } finally {
    isRouting.value = false;
  }
}

function clearRoute() {
  routeCoords.value = [];
  routeInfo.value = null;
  isRouting.value = false;
  console.log('Route cleared');
}

// --- Jogging planner helpers ---
function metersPerDegLat() { return 111320; }
function metersPerDegLng(lat) { return 111320 * Math.cos(lat * Math.PI / 180); }

function offsetPointLatLng(center, dxEast, dyNorth) {
  const lat = center.lat;
  const dLat = dyNorth / metersPerDegLat();
  const dLng = dxEast / metersPerDegLng(lat);
  return { lat: lat + dLat, lng: center.lng + dLng };
}

function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function pathLengthMeters(coords) {
  let sum = 0;
  for (let i = 1; i < coords.length; i++) {
    sum += haversineMeters({lat: coords[i-1][0], lng: coords[i-1][1]}, {lat: coords[i][0], lng: coords[i][1]});
  }
  return sum;
}

function generateLoopWaypoints(center, targetMeters, scale=1) {
  // 3-point loop around user
  const circumference = targetMeters;
  let radius = (circumference / (2 * Math.PI)) * scale; // meters
  const angles = [0, 2*Math.PI/3, 4*Math.PI/3];
  return angles.map(theta => offsetPointLatLng(center, radius * Math.cos(theta), radius * Math.sin(theta)));
}

async function osrmRouteThrough(points, closeLoop=true) {
  const coords = [];
  // start is user location
  const start = { lat: userLocation.value[0], lng: userLocation.value[1] };
  coords.push(`${start.lng},${start.lat}`);
  points.forEach(p => coords.push(`${p.lng},${p.lat}`));
  if (closeLoop) coords.push(`${start.lng},${start.lat}`);
  const url = `https://router.project-osrm.org/route/v1/foot/${coords.join(';')}?overview=full&geometries=geojson&alternatives=false&steps=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM failed: ${res.status}`);
  const data = await res.json();
  if (!data.routes || !data.routes[0]) throw new Error('No OSRM route');
  return data.routes[0];
}

async function planJogRoute() {
  try {
    if (!userLocation.value) {
      alert('尚未取得定位，請允許定位或稍後再試');
      return;
    }
    isJogPlanning.value = true;
    jogRouteCoords.value = [];
    jogRouteInfo.value = null;

    const targetKm = Math.max(1, Math.min(30, Number(jogTargetKm.value) || 0));
    const targetMeters = targetKm * 1000;
    const center = { lat: userLocation.value[0], lng: userLocation.value[1] };

    // Try OSRM-based loop with up to 3 radius refinements
    let scale = 1.0;
    let route = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const waypoints = generateLoopWaypoints(center, targetMeters, scale);
        route = await osrmRouteThrough(waypoints, true);
        const dist = route.distance;
        const ratio = targetMeters / dist;
        if (Math.abs(1 - ratio) < 0.12) {
          // close enough (±12%)
          break;
        }
        scale *= ratio; // adjust radius and retry
      } catch (e) {
        console.warn('OSRM attempt failed, will fallback if needed:', e);
        route = null;
        break;
      }
    }

    if (route) {
      jogRouteCoords.value = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      jogRouteInfo.value = { distance: route.distance, deltaKm: Math.abs(route.distance - targetMeters) / 1000 };
    } else {
      // Fallback: synthetic circle polyline
      const steps = 40;
      const circumference = targetMeters;
      const radius = circumference / (2 * Math.PI);
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const p = offsetPointLatLng(center, radius * Math.cos(t), radius * Math.sin(t));
        pts.push([p.lat, p.lng]);
      }
      jogRouteCoords.value = pts;
      const dist = pathLengthMeters(pts);
      jogRouteInfo.value = { distance: dist, deltaKm: Math.abs(dist - targetMeters) / 1000 };
    }

    // Fit map to jog route bounds
    const map = mapRef.value && mapRef.value.leafletObject ? mapRef.value.leafletObject : null;
    if (map && jogRouteCoords.value.length > 1) {
      const bounds = L.latLngBounds(jogRouteCoords.value);
      try { map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 }); } catch {}
    }
  } catch (e) {
    console.error('Jog route planning failed:', e);
    alert('慢跑路線規劃失敗，請稍後再試');
  } finally {
    isJogPlanning.value = false;
  }
}

function clearJogRoute() {
  jogRouteCoords.value = [];
  jogRouteInfo.value = null;
}
function applyFilters() {
  console.log('Filters applied:', {
    categories: selectedFilters.value,
    status: statusFilters.value
  });
}

function resetFilters() {
  selectedFilters.value = [];
  statusFilters.value = ['unlocked', 'locked'];
  selectedDistricts.value = [];
  selectionMode.value = false;
  console.log('Filters reset');
}

function toggleSelectionMode() {
  selectionMode.value = !selectionMode.value;
  if (!selectionMode.value) {
    console.log('Selection mode disabled, selected districts:', selectedDistricts.value);
  } else {
    console.log('Selection mode enabled - click on districts to select them');
  }
}

function removeSelectedDistrict(districtName) {
  const index = selectedDistricts.value.indexOf(districtName);
  if (index > -1) {
    selectedDistricts.value.splice(index, 1);
  }
}
</script>

<style scoped>
.main {
  position: relative;
  width: 100%;
  height: calc(100vh - 72px - env(safe-area-inset-bottom)); /* Full height minus bottom nav */
  overflow: hidden;
}

.map-root {
  width: 100%;
  height: 100%;
  position: relative;
}

.routing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.routing-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #93D4DF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Character selection panel styles */
.character-panel {
  position: absolute;
  bottom: calc(16px + 72px + 116px + env(safe-area-inset-bottom)); /* Above jog panel */
  left: -320px; /* hidden by default */
  width: 300px;
  max-height: 60vh;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.character-panel-open {
  left: var(--space-4);
}

.character-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: linear-gradient(135deg, #93D4DF, #7BCBD9);
  color: white;
}

.character-title {
  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-bold);
}

.character-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.character-toggle:hover {
  opacity: 0.8;
}

.character-toggle svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
}

.character-content {
  padding: var(--space-4);
  overflow-y: auto;
  flex: 1;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.character-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 2px solid rgba(70, 141, 155, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.character-item:hover {
  border-color: #93D4DF;
  background: rgba(147, 212, 223, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.character-item.selected {
  border-color: #468D9B;
  background: linear-gradient(135deg, rgba(147, 212, 223, 0.15), rgba(123, 203, 217, 0.15));
  box-shadow: 0 4px 12px rgba(70, 141, 155, 0.3);
}

.character-image-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: var(--radius-md);
  color: white;
}

.character-name {
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: #495057;
  text-align: center;
}

.character-item.selected .character-name {
  color: #468D9B;
}

.character-item.locked {
  cursor: not-allowed;
  opacity: 0.5;
  filter: grayscale(100%);
}

.character-item.locked:hover {
  border-color: rgba(70, 141, 155, 0.2);
  background: white;
  transform: none;
  box-shadow: none;
}

.unlock-condition {
  font-size: 10px;
  color: #6C757D;
  text-align: center;
  margin-top: 4px;
  line-height: 1.2;
}

/* Jog planner styles */
.jog-planner {
  position: absolute;
  bottom: calc(16px + 72px + 58px + env(safe-area-inset-bottom)); /* Above filter panel */
  left: -320px; /* hidden by default */
  width: 300px;
  max-height: 60vh;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.jog-planner-open {
  left: var(--space-4);
}

.jog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: linear-gradient(135deg, #93D4DF, #7BCBD9);
  color: white;
}

.jog-title {
  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-bold);
}

.jog-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.jog-toggle:hover {
  opacity: 0.8;
}

.jog-toggle svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
}

.jog-content {
  padding: var(--space-4);
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.jog-row { display:flex; align-items:center; gap:8px; font-size:12px; color:#495057; }
.jog-row .jog-input { flex:1; height:32px; border:1px solid #DEE2E6; border-radius:8px; padding:0 8px; font-size:14px; }
.jog-row .jog-input:focus { outline:2px solid #93D4DF; }
.jog-row .unit { color:#6C757D; font-size:12px; }
.jog-actions { display:flex; gap:8px; }
.jog-btn { flex:1; height:34px; border-radius:8px; border:1px solid #CED4DA; background:#F8F9FA; font-weight:600; color:#495057; cursor:pointer; transition:.2s; }
.jog-btn:hover:not(:disabled) { background:#E9ECEF; }
.jog-btn.primary { background: linear-gradient(135deg, #468D9B, #5CBBCA); color:#fff; border-color: transparent; }
.jog-btn.primary:hover:not(:disabled) { filter:brightness(1.05); }
.jog-btn:disabled { opacity:.6; cursor:not-allowed; }
.jog-summary { font-size:12px; color:#495057; display:flex; flex-direction:column; gap:4px; background:#F8F9FA; padding:8px 10px; border-radius:8px; border:1px solid #E9ECEF; }

/* Jog route arrow icon */
.jog-arrow-icon { background: transparent; border: none; }
.jog-arrow { width:20px; height:20px; display:flex; align-items:center; justify-content:center; color:#468D9B; text-shadow:0 0 6px rgba(0,0,0,.25); font-size:16px; transform-origin:50% 50%; }

.spinner-text {
  color: white;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.floating-stats {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  right: var(--space-4);
  z-index: 500;
  pointer-events: auto;
}

.stats-card-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.stats-card-wrapper:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: rgba(147, 212, 223, 0.3);
}

.stats-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-card:active {
  transform: translateY(0);
}

.mission-icon {
  color: #93D4DF;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mission-content {
  flex: 1;
  min-width: 0;
}

.mission-title {
  font-size: 16px;
  font-weight: var(--font-weight-bold);
  color: #212529;
  margin: 0 0 4px;
}

.mission-desc {
  font-size: 13px;
  color: #6C757D;
  margin: 0 0 var(--space-3);
}

.mission-progress {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.progress-track {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #468D9B, #5CBBCA);
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: #495057;
  white-space: nowrap;
}

.view-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: #93D4DF;
  min-width: 72px;
}

.quick-actions {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3) var(--space-3);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.quick-action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-1) var(--space-1);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.quick-action-btn:hover {
  background: rgba(147, 212, 223, 0.1);
}

.quick-action-btn:active {
  transform: scale(0.95);
}

.quick-action-btn svg {
  color: #93D4DF;
  flex-shrink: 0;
}

.quick-action-label {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  color: #6C757D;
}

.quick-action-badge {
  position: absolute;
  top: 2px;
  right: 6px;
  padding: 3px 8px;
  background: linear-gradient(135deg, #468D9B, #5CBBCA);
  color: white;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  box-shadow: 0 2px 8px rgba(70, 141, 155, 0.5);
}

.landmark-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.landmark-marker:hover {
  transform: translateY(-4px);
}

/* Glow effect for unlocked landmarks */
.marker-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(147, 212, 223, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.landmark-marker.unlocked .marker-glow {
  opacity: 1;
  animation: pulse 3s ease-in-out infinite;
}

/* Main circle */
.marker-circle {
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border: 3px solid #ADB5BD; /* Grey border for locked */
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.landmark-marker.unlocked .marker-circle {
  background: white;
  border: 3px solid #93D4DF; /* Light blue border for unlocked */
  box-shadow: 
    0 4px 20px rgba(147, 212, 223, 0.4),
    0 0 0 4px rgba(147, 212, 223, 0.15);
}

/* Sports category accent uses secondary color */
.landmark-marker.unlocked.category-sports .marker-circle {
  border-color: #F4D69E;
  box-shadow: 0 4px 20px rgba(244, 214, 158, 0.4), 0 0 0 4px rgba(244, 214, 158, 0.15);
}

/* Icon styling */
.marker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: grayscale(0.9) opacity(0.5);
  transition: filter 0.3s ease;
}

.marker-icon svg {
  width: 28px;
  height: 28px;
  stroke: #6C757D;
}

.landmark-marker.unlocked .marker-icon {
  filter: none;
}

/* Category-specific colors for unlocked landmarks */
.landmark-marker.unlocked.category-park .marker-icon svg,
.landmark-marker.unlocked.category-park .marker-circle {
  stroke: #A8E6CF;
  border-color: #A8E6CF;
}

.landmark-marker.unlocked.category-sports .marker-icon svg,
.landmark-marker.unlocked.category-sports .marker-circle {
  stroke: #FFD700;
  border-color: #FFD700;
}

.landmark-marker.unlocked.category-culture .marker-icon svg,
.landmark-marker.unlocked.category-culture .marker-circle {
  stroke: #FFB6D9;
  border-color: #FFB6D9;
}

.landmark-marker.unlocked.category-bike .marker-icon svg,
.landmark-marker.unlocked.category-bike .marker-circle {
  stroke: #93D4DF;
  border-color: #93D4DF;
}

.landmark-marker.unlocked.category-market .marker-icon svg,
.landmark-marker.unlocked.category-market .marker-circle {
  stroke: #DDA0DD;
  border-color: #DDA0DD;
}

.landmark-marker.unlocked .marker-icon svg {
  stroke: #93D4DF;
}

/* Vertical stem */
.marker-stem {
  width: 3px;
  height: 16px;
  background: linear-gradient(to bottom, #ADB5BD, rgba(173, 181, 189, 0.3));
  position: relative;
  z-index: 1;
}

.landmark-marker.unlocked .marker-stem {
  background: linear-gradient(to bottom, #93D4DF, rgba(147, 212, 223, 0.3));
}

/* Bottom dot */
.marker-dot {
  width: 8px;
  height: 8px;
  background: #ADB5BD;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.landmark-marker.unlocked .marker-dot {
  background: #93D4DF;
  box-shadow: 0 2px 8px rgba(147, 212, 223, 0.5);
}

.landmark-marker:hover .marker-circle {
  transform: scale(1.08);
}

.landmark-marker:hover .marker-stem {
  height: 18px;
}

.fab {
  position: absolute;
  bottom: calc(16px + 72px + env(safe-area-inset-bottom)); /* 16px spacing + bottom nav height */
  right: var(--space-4);
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #93D4DF, #7BCBD9);
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(147, 212, 223, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 500;
  color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(70, 141, 155, 0.5);
  transform: translateY(-2px);
}

.fab:active {
  transform: scale(0.95) translateY(0);
}

.fab svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

/* Route info panel */
.route-panel {
  position: absolute;
  bottom: calc(88px + 72px + env(safe-area-inset-bottom));
  left: var(--space-4);
  right: var(--space-4);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(55, 167, 232, 0.3);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.route-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.route-icon {
  font-size: 24px;
}

.route-details {
  flex: 1;
}

.route-dest {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: #212529;
  margin-bottom: 4px;
}

.route-stats {
  display: flex;
  gap: var(--space-3);
  font-size: 13px;
  color: #6C757D;
}

.route-distance {
  font-weight: var(--font-weight-semibold);
  color: #37A7E8;
}

.clear-route-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(220, 53, 69, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #DC3545;
  transition: all 0.2s ease;
}

.clear-route-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  transform: scale(1.05);
}

.clear-route-btn:active {
  transform: scale(0.95);
}

:deep(.landmark-popup .leaflet-popup-content-wrapper) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px) saturate(180%);
  color: #1a1a1a;
  border-radius: var(--radius-md);
  padding: 0;
  border: 1px solid rgba(70, 141, 155, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  font-size: 13px;
}

:deep(.landmark-popup .leaflet-popup-content) {
  margin: 8px 10px;
}

:deep(.landmark-popup .leaflet-popup-tip) {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(70, 141, 155, 0.25);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.district-popup .leaflet-popup-content-wrapper) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px) saturate(180%);
  color: #1a1a1a;
  border-radius: var(--radius-lg);
  padding: 0;
  border: 2px solid #93D4DF;
  box-shadow: 0 8px 32px rgba(147, 212, 223, 0.3);
}

:deep(.district-popup .leaflet-popup-tip) {
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid #93D4DF;
  box-shadow: 0 4px 16px rgba(147, 212, 223, 0.2);
}

.popup-content {
  padding: var(--space-3);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  gap: var(--space-2);
}

.popup-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: #212529;
}

.badge {
  font-size: 10px;
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.badge-success {
  background: rgba(76, 175, 80, 0.15);
  color: #2E7D32;
}

.badge-locked {
  background: rgba(173, 181, 189, 0.15);
  color: #495057;
}

.popup-desc {
  font-size: 12px;
  color: #495057;
  line-height: 1.4;
  margin: 0;
}

.popup-footer {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.hint-text {
  font-size: 12px;
  color: #6C757D;
}

/* Park details styling */
.popup-details {
  margin-top: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: 13px;
  color: #495057;
}

.detail-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.detail-text {
  line-height: 1.4;
}

/* Popup action buttons */
.popup-actions {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.nav-action-btn {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #37A7E8, #2D8BC2);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(55, 167, 232, 0.3);
}

.nav-action-btn:hover {
  background: linear-gradient(135deg, #2D8BC2, #1F6EA1);
  box-shadow: 0 4px 12px rgba(55, 167, 232, 0.5);
  transform: translateY(-1px);
}

.nav-action-btn:active {
  transform: translateY(0);
}

/* Filter FAB (left bottom) */
.filter-fab {
  left: var(--space-4);
  right: auto;
}

/* Filter Panel */
.filter-panel {
  position: absolute;
  bottom: calc(16px + 72px + env(safe-area-inset-bottom));
  left: -320px;
  width: 300px;
  max-height: 60vh;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.filter-panel-open {
  left: var(--space-4);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: linear-gradient(135deg, #93D4DF, #7BCBD9);
  color: white;
}

.filter-title {
  font-size: 16px;
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.filter-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.filter-toggle svg {
  color: white;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}

.filter-section {
  margin-bottom: var(--space-5);
}

.filter-label {
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: #495057;
  margin-bottom: var(--space-3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.filter-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: #F8F9FA;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.filter-option:hover {
  background: #E9ECEF;
}

.filter-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.filter-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #ADB5BD;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.filter-option input[type="checkbox"]:checked + .filter-checkbox {
  background: #93D4DF;
  border-color: #93D4DF;
}

.filter-option input[type="checkbox"]:checked + .filter-checkbox::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.filter-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.filter-name {
  flex: 1;
  font-size: 14px;
  color: #212529;
}

.filter-count {
  font-size: 12px;
  color: #6C757D;
  font-weight: var(--font-weight-semibold);
  background: white;
  padding: 2px 8px;
  border-radius: 12px;
}

.filter-reset {
  width: 100%;
  padding: var(--space-3);
  background: linear-gradient(135deg, #6C757D, #5A6268);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: var(--space-3);
}

.filter-reset:hover {
  background: linear-gradient(135deg, #5A6268, #495057);
  transform: translateY(-1px);
}

.filter-reset:active {
  transform: translateY(0);
}

.selection-tool-button {
  width: 100%;
  padding: var(--space-3);
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.selection-tool-button:hover {
  border-color: #468D9B;
  color: #468D9B;
}

.selection-tool-button.active {
  background: linear-gradient(135deg, rgba(70, 141, 155, 0.1), rgba(92, 187, 202, 0.1));
  border-color: #468D9B;
  color: #468D9B;
}

.selection-tool-button svg {
  flex-shrink: 0;
}

.selected-districts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.selected-district-tag {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 8px;
  background: rgba(255, 215, 0, 0.15);
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: #C9A300;
  font-weight: var(--font-weight-semibold);
}

.remove-district {
  background: none;
  border: none;
  color: #C9A300;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.remove-district:hover {
  opacity: 1;
}
</style>

<!-- Global styles for Leaflet DivIcon content (not scoped) -->
<style>
.leaflet-control-zoom { display: none !important; }

/* District labels */
.district-label-wrapper {
  background: transparent !important;
  border: 0 !important;
  pointer-events: none;
}

.district-label-content {
  /* 純文字標籤，使用 inline style 中的 text-shadow 增加可讀性 */
}

.landmark-wrapper { background: transparent; border: 0; }
.landmark-wrapper .landmark-marker { position: relative; display: flex; flex-direction: column; align-items: center; transition: transform .3s cubic-bezier(.4,0,.2,1); }
.landmark-wrapper .landmark-marker:hover { transform: translateY(-4px); }
.landmark-wrapper .marker-glow { position: absolute; top:0; left:50%; transform:translateX(-50%); width:48px; height:48px; border-radius:50%; background: radial-gradient(circle, rgba(147,212,223,.3), transparent); opacity:0; transition:opacity .3s ease; }
.landmark-wrapper .landmark-marker.unlocked .marker-glow { opacity:1; animation:pulse 3s ease-in-out infinite; }
.landmark-wrapper .marker-circle { width:44px; height:44px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,0,0,.2); border:3px solid #ADB5BD; position:relative; z-index:2; transition:all .3s ease; }
.landmark-wrapper .landmark-marker.unlocked .marker-circle { background:#fff; border:3px solid #93D4DF; box-shadow:0 4px 20px rgba(147,212,223,.4), 0 0 0 4px rgba(147,212,223,.15); }
.landmark-wrapper .marker-icon { display:flex; align-items:center; justify-content:center; filter:grayscale(.9) opacity(.5); transition:filter .3s ease; }
.landmark-wrapper .marker-icon svg { width:28px; height:28px; stroke:#6C757D; }
.landmark-wrapper .landmark-marker.unlocked .marker-icon { filter:none; }

/* Category-specific colors for unlocked landmarks */
.landmark-wrapper .landmark-marker.unlocked.category-park .marker-icon svg,
.landmark-wrapper .landmark-marker.unlocked.category-park .marker-circle {
  stroke: #A8E6CF;
  border-color: #A8E6CF;
}

.landmark-wrapper .landmark-marker.unlocked.category-sports .marker-icon svg,
.landmark-wrapper .landmark-marker.unlocked.category-sports .marker-circle {
  stroke: #FFD700;
  border-color: #FFD700;
}

.landmark-wrapper .landmark-marker.unlocked.category-culture .marker-icon svg,
.landmark-wrapper .landmark-marker.unlocked.category-culture .marker-circle {
  stroke: #FFB6D9;
  border-color: #FFB6D9;
}

.landmark-wrapper .landmark-marker.unlocked.category-bike .marker-icon svg,
.landmark-wrapper .landmark-marker.unlocked.category-bike .marker-circle {
  stroke: #93D4DF;
  border-color: #93D4DF;
}

.landmark-wrapper .landmark-marker.unlocked.category-market .marker-icon svg,
.landmark-wrapper .landmark-marker.unlocked.category-market .marker-circle {
  stroke: #DDA0DD;
  border-color: #DDA0DD;
}

.landmark-wrapper .landmark-marker.unlocked .marker-icon svg { stroke:#93D4DF; }
.landmark-wrapper .marker-stem { width:3px; height:16px; background:linear-gradient(to bottom, #ADB5BD, rgba(173,181,189,.3)); position:relative; z-index:1; }
.landmark-wrapper .landmark-marker.unlocked .marker-stem { background:linear-gradient(to bottom, #93D4DF, rgba(147,212,223,.3)); }
.landmark-wrapper .marker-dot { width:8px; height:8px; background:#ADB5BD; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,.3); position:relative; z-index:1; }
.landmark-wrapper .landmark-marker.unlocked .marker-dot { background:#93D4DF; box-shadow:0 2px 8px rgba(147,212,223,.5); }
.landmark-wrapper .landmark-marker.unlocked.category-sports .marker-circle { border:3px solid #F4D69E; box-shadow:0 4px 20px rgba(244,214,158,.4), 0 0 0 4px rgba(244,214,158,.15); }
.landmark-wrapper .landmark-marker.unlocked.category-sports .marker-glow { background: radial-gradient(circle, rgba(244,214,158,.3), transparent); }

/* Bike category accent uses main cyan/teal */
.landmark-wrapper .landmark-marker.unlocked.category-bike .marker-circle { border:3px solid #93D4DF; box-shadow:0 4px 20px rgba(147,212,223,.4), 0 0 0 4px rgba(147,212,223,.15); }
.landmark-wrapper .landmark-marker.unlocked.category-bike .marker-glow { background: radial-gradient(circle, rgba(147,212,223,.3), transparent); }

/* Animated user location marker (global, for Leaflet divIcon content) */
.user-location-wrapper { background: transparent; }
.user-location-marker { position: relative; width:60px; height:60px; display: flex; align-items: center; justify-content: center; }
.user-location-marker .character-icon { 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  width: 50px; 
  height: 50px; 
  transform: translate(-50%, -50%); 
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}
.user-location-marker .pulse-ring { 
  position:absolute; 
  top:50%; 
  left:50%; 
  width: 50px; 
  height: 50px; 
  border: 3px solid #93D4DF; 
  border-radius:50%; 
  transform:translate(-50%, -50%); 
  animation: pulseRing 2s ease-in-out infinite; 
  opacity: 0.8; 
  z-index: 1;
}

@keyframes pulseRing {
  0% { transform:translate(-50%, -50%) scale(0.8); opacity:0.9; }
  60% { transform:translate(-50%, -50%) scale(2.0); opacity:0.2; }
  100% { transform:translate(-50%, -50%) scale(2.4); opacity:0; }
}
</style>
