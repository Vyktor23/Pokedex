import { createRouter, createWebHashHistory } from 'vue-router'
import { NAV_ITEMS } from '../constants/navigation'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Inicio', icon: 'home' },
  },
  {
    path: '/pokedex',
    name: 'pokedex',
    component: () => import('../views/PokedexView.vue'),
    meta: { title: 'Pokédex', icon: 'catching_pokemon' },
  },
  {
    path: '/album',
    name: 'album',
    component: () => import('../views/AlbumView.vue'),
    meta: { title: 'Álbum', icon: 'collections_bookmark' },
  },
  {
    path: '/juegos',
    name: 'games',
    component: () => import('../views/GamesHubView.vue'),
    meta: { title: 'Arcade', icon: 'sports_esports' },
  },
  {
    path: '/juegos/adivina',
    name: 'game-adivina',
    component: () => import('../views/games/AdivinaView.vue'),
    meta: { title: '¿Quién es ese Pokémon?', icon: 'visibility_off', game: true },
  },
  {
    path: '/juegos/tipos',
    name: 'game-tipos',
    component: () => import('../views/games/TiposView.vue'),
    meta: { title: 'Maestro de Tipos', icon: 'category', game: true },
  },
  {
    path: '/juegos/stats',
    name: 'game-stats',
    component: () => import('../views/games/StatsView.vue'),
    meta: { title: 'Duelo de Stats', icon: 'fitness_center', game: true },
  },
  {
    path: '/juegos/memoria',
    name: 'game-memoria',
    component: () => import('../views/games/MemoriaView.vue'),
    meta: { title: 'Memoria Pokémon', icon: 'grid_view', game: true },
  },
  { path: '/adivina', redirect: '/juegos/adivina' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title ? `${to.meta.title} | Pokédex` : 'Pokédex'
  document.title = title
})

export { NAV_ITEMS }
