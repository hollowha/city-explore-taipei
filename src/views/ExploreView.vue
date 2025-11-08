<template>
  <div class="explore-view">
    <MissionsPanel :weekNumber="currentWeek" :streak="weekStreak" />
    <StatsOverview />
    <AchievementsPanel />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MissionsPanel from '../components/MissionsPanel.vue';
import StatsOverview from '../components/StatsOverview.vue';
import AchievementsPanel from '../components/AchievementsPanel.vue';

const currentWeek = ref(1);
const weekStreak = ref(1);
</script>

<style scoped>
.explore-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
  background: #F8F9FA;
  min-height: 100%;
  overflow-y: auto;
  /* Leave breathing space at bottom so content isn't tight with bottom nav */
  padding-bottom: calc(120px + env(safe-area-inset-bottom));
}

@media (max-width: 640px) {
  .explore-view {
    padding: var(--space-3);
  }
}
</style>
