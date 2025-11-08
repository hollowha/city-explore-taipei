<template>
  <div class="layout-root">
    <header class="app-bar">
      <div class="nav-content">
        <div class="title-group">
          <div class="icon-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <h1 class="title">探索地圖</h1>
            <p class="subtitle">City Explorer</p>
          </div>
        </div>
        <div class="user-badge" v-if="userInfo">
          <div class="avatar">{{ userInfo.userId.charAt(0).toUpperCase() }}</div>
        </div>
      </div>
    </header>
    <div class="main-content">
      <router-view />
    </div>
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { parseBootstrapContext } from './lib/bootstrap';
import BottomNav from './components/BottomNav.vue';

const userInfo = ref(null);

onMounted(() => {
  userInfo.value = parseBootstrapContext();
});
</script>

<style scoped>
.layout-root { 
  display: flex; 
  flex-direction: column; 
  height: 100%;
  background: #F8F9FA;
}

.app-bar { 
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(147, 212, 223, 0.15);
  padding: var(--space-4);
  padding-top: max(var(--space-4), env(safe-area-inset-top));
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.title-group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.icon-badge {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #93D4DF, #7BCBD9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(147, 212, 223, 0.3);
}

.title { 
  font-size: 18px;
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: #212529;
  letter-spacing: -0.3px;
}

.subtitle {
  font-size: 11px;
  color: #6C757D;
  margin: 2px 0 0;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #E7A43C, #F0B855);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: white;
  box-shadow: 0 2px 8px rgba(231, 164, 60, 0.3);
  border: 2px solid white;
}
</style>
