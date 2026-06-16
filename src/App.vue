<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_ITEMS } from './constants/navigation'
import AppBottomNav from './components/AppBottomNav.vue'

const drawerOpen = ref(false)
const route = useRoute()

function closeDrawer() {
  drawerOpen.value = false
}

function isNavActive(item) {
  return item.match(route.path)
}
</script>

<template>
  <q-layout view="hHh lpR fFf" class="app-layout">
    <q-header elevated class="app-header">
      <q-toolbar class="app-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Abrir menú"
          class="menu-btn"
          @click="drawerOpen = true"
        />

        <router-link to="/" class="brand" @click="closeDrawer">
          <q-avatar size="40px">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokéball"
            />
          </q-avatar>
          <span class="brand-title">Pokédex</span>
        </router-link>

        <q-space />

        <nav class="desktop-nav" aria-label="Navegación principal">
          <router-link
            v-for="item in NAV_ITEMS"
            :key="item.name"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link--active': isNavActive(item) }"
            @click="closeDrawer"
          >
            <q-icon :name="item.icon" size="18px" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      side="left"
      bordered
      behavior="mobile"
      :width="300"
      class="mobile-drawer"
    >
      <div class="drawer-brand">
        <q-avatar size="48px">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokéball"
          />
        </q-avatar>
        <div>
          <strong>Pokédex</strong>
          <p>Tu aventura Pokémon</p>
        </div>
      </div>

      <q-list padding>
        <q-item-label header class="drawer-header">Navegación</q-item-label>
        <q-item
          v-for="item in NAV_ITEMS"
          :key="item.name"
          clickable
          v-ripple
          :to="item.path"
          :active="isNavActive(item)"
          active-class="drawer-item--active"
          @click="closeDrawer"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-sm" />

      <q-list padding>
        <q-item-label header class="drawer-header">Arcade</q-item-label>
        <q-item clickable v-ripple to="/juegos/adivina" @click="closeDrawer">
          <q-item-section avatar><q-icon name="visibility_off" color="negative" /></q-item-section>
          <q-item-section>¿Quién es ese Pokémon?</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/juegos/tipos" @click="closeDrawer">
          <q-item-section avatar><q-icon name="category" color="primary" /></q-item-section>
          <q-item-section>Maestro de Tipos</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/juegos/stats" @click="closeDrawer">
          <q-item-section avatar><q-icon name="fitness_center" color="positive" /></q-item-section>
          <q-item-section>Duelo de Stats</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/juegos/memoria" @click="closeDrawer">
          <q-item-section avatar><q-icon name="grid_view" color="purple" /></q-item-section>
          <q-item-section>Memoria Pokémon</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>

    <AppBottomNav />
  </q-layout>
</template>

<style scoped>
.app-layout {
  background: var(--color-bg);
}

.app-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: #fff;
}

.app-toolbar {
  min-height: var(--header-height);
  padding: 0 clamp(0.75rem, 3vw, 1.5rem);
  gap: 0.5rem;
}

.menu-btn {
  color: #fff;
}

@media (min-width: 768px) {
  .menu-btn {
    display: none;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: #fff;
  text-decoration: none;
  min-width: 0;
}

.brand-title {
  font-size: clamp(1.125rem, 3.5vw, 1.5rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.desktop-nav {
  display: none;
  align-items: center;
  gap: 0.35rem;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.nav-link--active {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

.page-container {
  padding-bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));
}

@media (min-width: 768px) {
  .page-container {
    padding-bottom: 0;
  }
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem 0.5rem;
}

.drawer-brand p {
  margin: 0.15rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.drawer-header {
  font-weight: 700;
  color: var(--color-text);
}

.drawer-item--active {
  background: rgba(227, 53, 13, 0.08);
  color: var(--color-primary);
  font-weight: 600;
}
</style>
