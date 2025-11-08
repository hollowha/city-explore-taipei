<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <span>地圖</span>
    </router-link>

    <router-link to="/explore" class="nav-item" :class="{ active: $route.path === '/explore' }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span>探索</span>
    </router-link>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: var(--space-2) var(--space-4);
  padding-bottom: max(var(--space-2), env(safe-area-inset-bottom));
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08);
  z-index: 1000; /* Higher than map */
  pointer-events: auto;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: var(--space-2);
  color: #6C757D;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  min-height: 56px;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item svg {
  transition: transform 0.2s ease;
}

.nav-item.active {
  color: #93D4DF;
}

.nav-item.active svg {
  transform: scale(1.1);
}

.nav-item span {
  font-size: 12px;
  font-weight: var(--font-weight-medium);
}
</style>
