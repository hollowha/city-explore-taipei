<template>
  <div class="stats-overview">
    <h2 class="section-title">探索統計</h2>
    
    <div class="stats-grid">
      <div 
        class="stat-card" 
        :class="{ selected: selectedStat === 'overall' }"
        @click="selectStat('overall')"
      >
        <Map :size="32" class="stat-icon" stroke-width="2" />
        <div class="stat-content">
          <div class="stat-value">{{ overallProgress }}%</div>
          <div class="stat-label">整體探索度</div>
        </div>
      </div>

      <div 
        class="stat-card"
        :class="{ selected: selectedStat === 'landmarks' }"
        @click="selectStat('landmarks')"
      >
        <MapPin :size="32" class="stat-icon" stroke-width="2" />
        <div class="stat-content">
          <div class="stat-value">{{ landmarksUnlocked }}</div>
          <div class="stat-label">已解鎖地標</div>
        </div>
      </div>

      <div 
        class="stat-card"
        :class="{ selected: selectedStat === 'roads' }"
        @click="selectStat('roads')"
      >
        <Footprints :size="32" class="stat-icon" stroke-width="2" />
        <div class="stat-content">
          <div class="stat-value">{{ roadsExplored }}</div>
          <div class="stat-label">已探索街道</div>
        </div>
      </div>

      <div 
        class="stat-card"
        :class="{ selected: selectedStat === 'streak' }"
        @click="selectStat('streak')"
      >
        <Flame :size="32" class="stat-icon" stroke-width="2" />
        <div class="stat-content">
          <div class="stat-value">{{ weekStreak }}</div>
          <div class="stat-label">連勝週數</div>
        </div>
      </div>
    </div>

    <div class="district-progress">
      <h3 class="subsection-title">{{ currentSectionTitle }}</h3>
      
      <!-- 整體探索度：顯示各區探索進度 -->
      <div v-if="selectedStat === 'overall'" class="district-list">
        <div class="district-item" v-for="(district, index) in displayedDistricts" :key="district.name">
          <div class="district-header">
            <span class="district-name">{{ district.name }}</span>
            <span class="district-percent">{{ district.progress }}%</span>
          </div>
          <div class="district-bar">
            <div class="district-fill" :style="{ width: district.progress + '%' }"></div>
          </div>
        </div>
        <button 
          v-if="!showAllDistricts && allDistricts.length > 6" 
          class="expand-button"
          @click="toggleDistrictsExpand"
        >
          <span>...</span>
          <span class="expand-text">展開全部 12 個行政區</span>
        </button>
        <button 
          v-if="showAllDistricts" 
          class="expand-button"
          @click="toggleDistrictsExpand"
        >
          <span class="expand-text">收起</span>
        </button>
      </div>

      <!-- 已解鎖地標：顯示地標列表 -->
      <div v-else-if="selectedStat === 'landmarks'" class="landmarks-list">
        <div class="landmark-item" v-for="landmark in landmarksList" :key="landmark.name">
          <div class="landmark-icon-wrapper">
            <MapPin :size="20" class="landmark-icon" />
          </div>
          <div class="landmark-info">
            <div class="landmark-name">{{ landmark.name }}</div>
            <div class="landmark-category">{{ landmark.category }}</div>
          </div>
          <div class="landmark-badge unlocked">已解鎖</div>
        </div>
      </div>

      <!-- 已探索街道：顯示街道統計 -->
      <div v-else-if="selectedStat === 'roads'" class="roads-stats">
        <div class="roads-summary">
          <div class="roads-stat-item">
            <div class="roads-stat-label">總街道數</div>
            <div class="roads-stat-value">{{ totalRoads }}</div>
          </div>
          <div class="roads-stat-item">
            <div class="roads-stat-label">已探索</div>
            <div class="roads-stat-value highlight">{{ roadsExplored }}</div>
          </div>
          <div class="roads-stat-item">
            <div class="roads-stat-label">完成率</div>
            <div class="roads-stat-value">{{ roadsCompletionRate }}%</div>
          </div>
        </div>
        <div class="district-list">
          <div class="district-item" v-for="district in topRoadsDistricts" :key="district.name">
            <div class="district-header">
              <span class="district-name">{{ district.name }}</span>
              <span class="district-percent">{{ district.roads }} 條街道</span>
            </div>
            <div class="district-bar">
              <div class="district-fill roads" :style="{ width: (district.roads / totalRoads * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 連勝週數：顯示連勝記錄 -->
      <div v-else-if="selectedStat === 'streak'" class="streak-info">
        <div class="streak-card">
          <Flame :size="48" class="streak-icon" />
          <div class="streak-details">
            <div class="streak-current">目前連勝：<span class="streak-number">{{ weekStreak }}</span> 週</div>
            <div class="streak-best">最佳紀錄：<span class="streak-number">{{ bestStreak }}</span> 週</div>
          </div>
        </div>
        <div class="streak-calendar">
          <div class="calendar-title">本週活動</div>
          <div class="week-days">
            <div 
              v-for="day in weekDays" 
              :key="day.name"
              class="day-item"
              :class="{ active: day.active, today: day.today }"
            >
              <div class="day-name">{{ day.name }}</div>
              <div class="day-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="category-stats">
      <h3 class="subsection-title">地標分類</h3>
      <div class="category-grid">
        <div class="category-card" v-for="cat in categories" :key="cat.type">
              <TreePine v-if="cat.icon === 'tree-pine'" :size="24" class="category-icon" stroke-width="2" />
              <User v-else-if="cat.icon === 'user'" :size="24" class="category-icon" stroke-width="2" />
              <Building2 v-else-if="cat.icon === 'building2'" :size="24" class="category-icon" stroke-width="2" />
          <Bike v-else-if="cat.icon === 'bike'" :size="24" class="category-icon" stroke-width="2" />
          <div class="category-info">
            <div class="category-name">{{ cat.name }}</div>
            <div class="category-count">{{ cat.unlocked }} / {{ cat.total }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Map, MapPin, Footprints, Flame, TreePine, User, Building2, Bike } from 'lucide-vue-next';

const overallProgress = ref(18);
const landmarksUnlocked = ref(3);
const roadsExplored = ref(47);
const weekStreak = ref(1);

const selectedStat = ref('overall'); // 預設選擇整體探索度
const showAllDistricts = ref(false);

// 計算標題
const currentSectionTitle = computed(() => {
  switch (selectedStat.value) {
    case 'overall':
      return '各區探索進度';
    case 'landmarks':
      return '已解鎖地標列表';
    case 'roads':
      return '街道探索統計';
    case 'streak':
      return '探索連勝紀錄';
    default:
      return '各區探索進度';
  }
});

// 地標列表數據
const landmarksList = ref([
  { name: '大安森林公園', category: '公園綠地' },
  { name: '松山運動中心', category: '運動中心' },
  { name: '信義親子館', category: '活動中心' }
]);

// 街道統計數據
const totalRoads = ref(260);
const roadsCompletionRate = computed(() => {
  return Math.round((roadsExplored.value / totalRoads.value) * 100);
});

const topRoadsDistricts = ref([
  { name: '中山區', roads: 15 },
  { name: '大安區', roads: 12 },
  { name: '信義區', roads: 10 },
  { name: '中正區', roads: 6 },
  { name: '松山區', roads: 4 }
]);

// 連勝數據
const bestStreak = ref(3);
const weekDays = ref([
  { name: '一', active: true, today: false },
  { name: '二', active: true, today: false },
  { name: '三', active: true, today: false },
  { name: '四', active: false, today: false },
  { name: '五', active: false, today: true },
  { name: '六', active: false, today: false },
  { name: '日', active: false, today: false }
]);

const allDistricts = ref([
  { name: '中山區', progress: 24 },
  { name: '大安區', progress: 15 },
  { name: '信義區', progress: 12 },
  { name: '中正區', progress: 8 },
  { name: '松山區', progress: 5 },
  { name: '萬華區', progress: 3 },
  { name: '北投區', progress: 0 },
  { name: '士林區', progress: 0 },
  { name: '內湖區', progress: 0 },
  { name: '大同區', progress: 0 },
  { name: '南港區', progress: 0 },
  { name: '文山區', progress: 0 },
]);

const displayedDistricts = computed(() => {
  return showAllDistricts.value ? allDistricts.value : allDistricts.value.slice(0, 6);
});

function selectStat(stat) {
  selectedStat.value = stat;
}

function toggleDistrictsExpand() {
  showAllDistricts.value = !showAllDistricts.value;
}

const districts = ref([
  { name: '中山區', progress: 24 },
  { name: '大安區', progress: 15 },
  { name: '信義區', progress: 12 },
  { name: '中正區', progress: 8 },
  { name: '松山區', progress: 5 },
  { name: '萬華區', progress: 3 }
]);

const categories = ref([
  { type: 'park', icon: 'tree-pine', name: '公園綠地', unlocked: 2, total: 15 },
  { type: 'sports', icon: 'user', name: '運動中心', unlocked: 0, total: 8 },
  { type: 'culture', icon: 'building2', name: '活動中心', unlocked: 1, total: 12 },
  { type: 'market', icon: 'bike', name: '自行車道河濱景點', unlocked: 0, total: 10 }
]);
</script>

<style scoped>
.stats-overview {
  padding: var(--space-4);
}

.section-title {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: #212529;
  margin: 0 0 var(--space-4);
}

.subsection-title {
  font-size: 16px;
  font-weight: var(--font-weight-bold);
  color: #212529;
  margin: 0 0 var(--space-3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 2px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.selected {
  background: linear-gradient(135deg, rgba(70, 141, 155, 0.15), rgba(92, 187, 202, 0.15));
  border-color: #468D9B;
  box-shadow: 0 4px 12px rgba(70, 141, 155, 0.2);
}

.stat-card.primary {
  background: linear-gradient(135deg, rgba(70, 141, 155, 0.1), rgba(92, 187, 202, 0.1));
  border-color: #468D9B;
}

.stat-card.primary.selected {
  background: linear-gradient(135deg, rgba(70, 141, 155, 0.2), rgba(92, 187, 202, 0.2));
  box-shadow: 0 6px 16px rgba(70, 141, 155, 0.25);
}

.stat-icon {
  color: #93D4DF;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: #212529;
  line-height: 1.2;
}

.stat-card.primary .stat-value {
  background: linear-gradient(135deg, #468D9B, #5CBBCA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 12px;
  color: #6C757D;
  margin-top: 2px;
}

.district-progress {
  background: white;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.district-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.district-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.district-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.district-name {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: #495057;
}

.district-percent {
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: #468D9B;
}

.district-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.district-fill {
  height: 100%;
  background: linear-gradient(90deg, #468D9B, #5CBBCA);
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.expand-button {
  width: 100%;
  margin-top: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: rgba(70, 141, 155, 0.05);
  border: 1px dashed rgba(70, 141, 155, 0.3);
  border-radius: var(--radius-sm);
  color: #468D9B;
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.expand-button:hover {
  background: rgba(70, 141, 155, 0.1);
  border-color: rgba(70, 141, 155, 0.5);
}

.expand-text {
  font-size: 13px;
}

.category-stats {
  background: white;
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-3);
}

.category-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: #F8F9FA;
  border-radius: var(--radius-sm);
}

.category-icon {
  color: #93D4DF;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 12px;
  color: #6C757D;
  margin-bottom: 2px;
}

.category-count {
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: #212529;
}

.category-count {
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: #212529;
}

/* Landmarks list styles */
.landmarks-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.landmark-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: #F8F9FA;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.landmark-item:hover {
  background: #E9ECEF;
  transform: translateX(4px);
}

.landmark-icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #468D9B, #5CBBCA);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.landmark-icon {
  color: white;
}

.landmark-info {
  flex: 1;
  min-width: 0;
}

.landmark-name {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: #212529;
  margin-bottom: 2px;
}

.landmark-category {
  font-size: 12px;
  color: #6C757D;
}

.landmark-badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}

.landmark-badge.unlocked {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

/* Roads stats styles */
.roads-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.roads-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.roads-stat-item {
  text-align: center;
  padding: var(--space-3);
  background: #F8F9FA;
  border-radius: var(--radius-sm);
}

.roads-stat-label {
  font-size: 12px;
  color: #6C757D;
  margin-bottom: 4px;
}

.roads-stat-value {
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: #212529;
}

.roads-stat-value.highlight {
  background: linear-gradient(135deg, #468D9B, #5CBBCA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.district-fill.roads {
  background: linear-gradient(90deg, #FFB74D, #FFA726);
}

/* Streak info styles */
.streak-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.streak-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.1));
  border-radius: var(--radius-md);
  border: 2px solid rgba(255, 152, 0, 0.2);
}

.streak-icon {
  color: #FF9800;
  flex-shrink: 0;
}

.streak-details {
  flex: 1;
}

.streak-current,
.streak-best {
  font-size: 14px;
  color: #495057;
  margin-bottom: 8px;
}

.streak-current:last-child,
.streak-best:last-child {
  margin-bottom: 0;
}

.streak-number {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: #FF9800;
  margin-left: 4px;
}

.streak-calendar {
  padding: var(--space-4);
  background: #F8F9FA;
  border-radius: var(--radius-sm);
}

.calendar-title {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: #495057;
  margin-bottom: var(--space-3);
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.day-item.today {
  background: rgba(70, 141, 155, 0.1);
}

.day-name {
  font-size: 12px;
  color: #6C757D;
  font-weight: var(--font-weight-semibold);
}

.day-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #DEE2E6;
  transition: all 0.2s ease;
}

.day-item.active .day-indicator {
  background: linear-gradient(135deg, #468D9B, #5CBBCA);
  box-shadow: 0 2px 8px rgba(70, 141, 155, 0.4);
}

.day-item.today .day-name {
  color: #468D9B;
  font-weight: var(--font-weight-bold);
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
