<template>
  <div class="achievements-panel">
    <h2 class="panel-title">探索成就</h2>
    
    <div class="achievement-grid">
      <div 
        class="achievement-card" 
        v-for="achievement in achievements" 
        :key="achievement.id"
        :class="{ unlocked: achievement.unlocked }"
      >
        <div class="achievement-icon">
          <Target v-if="achievement.icon === 'target'" :size="40" stroke-width="2" />
          <Map v-else-if="achievement.icon === 'map'" :size="40" stroke-width="2" />
          <Waves v-else-if="achievement.icon === 'waves'" :size="40" stroke-width="2" />
          <Star v-else-if="achievement.icon === 'star'" :size="40" stroke-width="2" />
          <Flame v-else-if="achievement.icon === 'flame'" :size="40" stroke-width="2" />
          <Building2 v-else-if="achievement.icon === 'building2'" :size="40" stroke-width="2" />
        </div>
        <div class="achievement-info">
          <h3 class="achievement-name">{{ achievement.name }}</h3>
          <p class="achievement-desc">{{ achievement.description }}</p>
          <div v-if="achievement.progress !== undefined" class="achievement-progress">
            <div class="mini-progress">
              <div class="mini-progress-fill" :style="{ width: (achievement.current / achievement.target * 100) + '%' }"></div>
            </div>
            <span class="progress-label">{{ achievement.current }} / {{ achievement.target }}</span>
          </div>
          <div v-if="achievement.unlocked" class="unlock-date">
            {{ formatDate(achievement.unlockedAt) }}
          </div>
        </div>
        <div v-if="!achievement.unlocked" class="lock-overlay">🔒</div>
      </div>
    </div>
    <!-- bottom safe spacer to avoid overlap with bottom nav -->
    <div class="bottom-safe-spacer" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Target, Map, Waves, Star, Flame, Building2 } from 'lucide-vue-next';

const achievements = ref([
  {
    id: 'first-landmark',
    icon: 'target',
    name: '首次探索',
    description: '解鎖第一個地標',
    unlocked: true,
    unlockedAt: '2025-11-01'
  },
  {
    id: 'district-explorer',
    icon: 'map',
    name: '區域探險家',
    description: '探索中山區 20% 街道',
    unlocked: false,
    current: 15,
    target: 20,
    progress: true
  },
  {
    id: 'riverside-master',
    icon: 'waves',
    name: '河濱達人',
    description: '完成河濱路線開圖',
    unlocked: false,
    current: 3,
    target: 5,
    progress: true
  },
  {
    id: 'landmark-collector',
    icon: 'star',
    name: '地標收藏家',
    description: '解鎖 10 個地標',
    unlocked: false,
    current: 3,
    target: 10,
    progress: true
  },
  {
    id: 'week-streak-3',
    icon: 'flame',
    name: '三週連勝',
    description: '連續 3 週完成任務',
    unlocked: false,
    current: 1,
    target: 3,
    progress: true
  },
  {
    id: 'culture-explorer',
    icon: 'building2',
    name: '文化探索者',
  description: '造訪 5 個活動中心',
    unlocked: false,
    current: 0,
    target: 5,
    progress: true
  }
]);

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()} 解鎖`;
}
</script>

<style scoped>
.achievements-panel {
  padding: var(--space-4);
  position: relative;
}

.bottom-safe-spacer {
  height: 96px; /* space for bottom nav + breathing room */
  width: 100%;
  pointer-events: none;
}

.panel-title {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: #212529;
  margin: 0 0 var(--space-4);
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-3);
}

.achievement-card {
  position: relative;
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 2px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.achievement-card:not(.unlocked) {
  opacity: 0.45;
  filter: grayscale(0.85);
}

.achievement-card.unlocked {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), rgba(102, 187, 106, 0.08));
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.achievement-icon {
  color: #93D4DF;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-card.unlocked .achievement-icon {
  color: #66BB6A;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-size: 15px;
  font-weight: var(--font-weight-bold);
  color: #212529;
  margin: 0 0 4px;
}

.achievement-desc {
  font-size: 13px;
  color: #6C757D;
  margin: 0 0 var(--space-2);
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.mini-progress {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.achievement-card:not(.unlocked) .mini-progress-fill {
  background: linear-gradient(90deg, #9E9E9E, #BDBDBD);
}

.progress-label {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  color: #6C757D;
  white-space: nowrap;
}

.unlock-date {
  font-size: 11px;
  color: #4CAF50;
  margin-top: var(--space-2);
  font-weight: var(--font-weight-medium);
}

.lock-overlay {
  position: absolute;
  top: 50%;
  right: var(--space-4);
  transform: translateY(-50%);
  font-size: 24px;
  opacity: 0.3;
}

@media (max-width: 640px) {
  .achievement-grid {
    grid-template-columns: 1fr;
  }
}
</style>
