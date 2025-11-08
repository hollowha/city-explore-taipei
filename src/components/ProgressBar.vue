<template>
  <div class="progress-container">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: pct + '%' }">
        <div class="progress-glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ 
  value: { type: Number, default: 0 },
  size: { type: String, default: 'md' } // sm, md, lg
});
const pct = computed(() => Math.max(0, Math.min(100, Math.round(props.value))));
</script>

<style scoped>
.progress-container {
  width: 100%;
}

.progress-track { 
  width: 100%; 
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-fill { 
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-300));
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 0 12px rgba(38, 166, 154, 0.5);
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
