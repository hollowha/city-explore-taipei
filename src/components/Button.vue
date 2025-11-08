<template>
  <button 
    class="btn" 
    :class="[variant, size, { block, icon: !!$slots.icon }]"
    :disabled="disabled"
  >
    <span v-if="$slots.icon" class="btn-icon"><slot name="icon"></slot></span>
    <span v-if="$slots.default" class="btn-label"><slot></slot></span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, ghost, danger
  size: { type: String, default: 'md' }, // sm, md, lg
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  min-height: 44px; /* Touch-friendly */
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.btn.primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-300));
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn.secondary {
  background: linear-gradient(135deg, var(--secondary-500), var(--secondary-300));
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn.ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn.danger {
  background: var(--danger);
  color: white;
  box-shadow: var(--shadow-sm);
}

/* Sizes */
.btn.sm {
  padding: var(--space-2) var(--space-3);
  font-size: 13px;
  min-height: 36px;
}

.btn.md {
  padding: var(--space-3) var(--space-4);
  font-size: 14px;
}

.btn.lg {
  padding: var(--space-4) var(--space-6);
  font-size: 16px;
  min-height: 52px;
}

.btn.block {
  width: 100%;
}

.btn.icon:not(.btn-label) {
  padding: var(--space-3);
  aspect-ratio: 1;
}
</style>
