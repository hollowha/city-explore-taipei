<template>
  <span class="badge" :class="[variant, size]">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' }, // default, primary, secondary, success, danger, warning
  size: { type: String, default: 'md' } // sm, md, lg
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Sizes */
.badge.sm {
  padding: 2px 6px;
  font-size: 10px;
}

.badge.md {
  padding: 4px 8px;
  font-size: 11px;
}

.badge.lg {
  padding: 6px 12px;
  font-size: 12px;
}

/* Variants */
.badge.default {
  background: rgba(173, 181, 189, 0.2);
  color: var(--grey-400);
}

.badge.primary {
  background: rgba(38, 166, 154, 0.2);
  color: var(--primary-300);
}

.badge.secondary {
  background: rgba(255, 152, 0, 0.2);
  color: var(--secondary-300);
}

.badge.success {
  background: rgba(76, 175, 80, 0.2);
  color: var(--success);
}

.badge.danger {
  background: rgba(244, 67, 54, 0.2);
  color: var(--danger);
}

.badge.warning {
  background: rgba(255, 152, 0, 0.2);
  color: var(--warning);
}
</style>
