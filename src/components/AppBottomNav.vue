<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_ITEMS } from '../constants/navigation'

const route = useRoute()

const activeTab = computed(() => {
  const item = NAV_ITEMS.find((entry) => entry.match(route.path))
  return item?.name || 'home'
})
</script>

<template>
  <nav class="bottom-nav" aria-label="Navegación inferior">
    <router-link
      v-for="item in NAV_ITEMS"
      :key="item.name"
      :to="item.path"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': activeTab === item.name }"
    >
      <q-icon :name="item.icon" size="22px" />
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
  padding: 0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 24px var(--color-shadow);
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.35rem 0.25rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.bottom-nav__item--active {
  color: var(--color-primary);
  background: rgba(227, 53, 13, 0.08);
}

.bottom-nav__item:active {
  transform: scale(0.96);
}
</style>
