<template>
  <div class="missions-panel">
    <div class="panel-header">
      <h2 class="panel-title">本週任務</h2>
      <span class="week-badge">第 {{ weekNumber }} 週</span>
    </div>

    <div class="mission-cards">
      <div class="mission-card" v-for="mission in missions" :key="mission.id" :class="{ completed: mission.completed }">
        <div class="mission-icon">
          <Footprints v-if="mission.icon === 'footprints'" :size="32" stroke-width="2" />
          <MapPin v-else-if="mission.icon === 'map-pin'" :size="32" stroke-width="2" />
        </div>
        <div class="mission-content">
          <h3 class="mission-title">{{ mission.title }}</h3>
          <p class="mission-desc">{{ mission.description }}</p>
          <div class="mission-progress">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: mission.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ mission.current }} / {{ mission.target }}</span>
          </div>
        </div>
        <div class="mission-status">
          <div v-if="mission.completed" class="status-badge completed">
            <span>✓</span> 完成
          </div>
          <div v-else class="status-badge pending">進行中</div>
        </div>
      </div>
    </div>

    <div class="streak-info" v-if="streak > 0">
      <Flame :size="32" class="streak-icon" stroke-width="2" />
      <div class="streak-content">
        <div class="streak-title">探索連勝</div>
        <div class="streak-value">{{ streak }} 週</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Footprints, MapPin, Flame } from 'lucide-vue-next';

const props = defineProps({
  weekNumber: { type: Number, default: 1 },
  streak: { type: Number, default: 0 }
});

const missions = ref([
  {
    id: 'new-roads',
    icon: 'footprints',
    title: '新路 1000 步',
    description: '在未探索的街道上累積 800 公尺',
    current: 620,
    target: 1000,
    unit: 'm',
    completed: false,
    progress: 62
  },
  {
    id: 'new-landmark',
    icon: 'map-pin',
    title: '新地標 x1',
    description: '解鎖一個從未造訪過的地標',
    current: 0,
    target: 1,
    unit: '個',
    completed: false,
    progress: 0
  }
]);
</script>

<style scoped>
.missions-panel {
  padding: var(--space-4);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.panel-title {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: #212529;
  margin: 0;
}

.week-badge {
  padding: 4px 12px;
  background: rgba(70, 141, 155, 0.1);
  color: #468D9B;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
}

.mission-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.mission-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #F8F9FA;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.mission-card.completed {
  border-color: #468D9B;
  background: rgba(70, 141, 155, 0.05);
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

.mission-status {
  min-width: 72px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-align: center;
}

.status-badge.completed {
  background: rgba(76, 175, 80, 0.15);
  color: #2E7D32;
}

.status-badge.pending {
  background: rgba(231, 164, 60, 0.15);
  color: #C9812E;
}

.streak-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: linear-gradient(135deg, rgba(231, 164, 60, 0.1), rgba(240, 184, 85, 0.1));
  border-radius: var(--radius-md);
  border: 1px solid rgba(231, 164, 60, 0.2);
}

.streak-icon {
  color: #E7A43C;
  flex-shrink: 0;
}

.streak-content {
  flex: 1;
}

.streak-title {
  font-size: 12px;
  color: #6C757D;
  margin-bottom: 2px;
}

.streak-value {
  font-size: 18px;
  font-weight: var(--font-weight-bold);
  color: #C9812E;
}
</style>
