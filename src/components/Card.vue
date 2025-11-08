<template>
  <div class="card" :class="[variant, { elevated }]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' }, // default, glass
  elevated: { type: Boolean, default: false }
});
</script>

<style scoped>
.card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--border-color);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card.glass {
  background: var(--bg-elevated);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

.card.elevated {
  box-shadow: var(--shadow-md);
}

.card.elevated:active {
  transform: scale(0.98);
}
</style>
