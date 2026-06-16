<script setup>
import { computed, ref } from 'vue'
import { useAlbum } from '../composables/useAlbum'
import { fetchPokemonProfile } from '../composables/usePokemonApi'
import { POKEMON_TOTAL, ALL_TYPES } from '../utils/pokemon'
import { getTypeLabel } from '../utils/pokeapi'
import { albumEmptyMessage, albumClearConfirm } from '../utils/messages'
import PageHeader from '../components/PageHeader.vue'
import PokemonProfile from '../components/PokemonProfile.vue'

const { entries, count, progress, clearAlbum, hasPokemon } = useAlbum()

const search = ref('')
const typeFilter = ref('all')
const page = ref(1)
const perPage = 24
const detailOpen = ref(false)
const detailProfile = ref(null)
const detailLoading = ref(false)

const emptyText = albumEmptyMessage()

const filtered = computed(() => {
  let list = entries.value

  if (typeFilter.value !== 'all') {
    list = list.filter((entry) => entry.types.includes(typeFilter.value))
  }

  if (search.value.trim()) {
    const query = search.value.trim().toLowerCase()
    list = list.filter(
      (entry) => entry.name.includes(query) || String(entry.id).includes(query),
    )
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))

const paginated = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

function onFilterChange() {
  page.value = 1
}

async function openDetail(entry) {
  detailOpen.value = true
  detailLoading.value = true
  detailProfile.value = null
  try {
    detailProfile.value = await fetchPokemonProfile(entry.id)
  } finally {
    detailLoading.value = false
  }
}

function confirmClear() {
  if (window.confirm(albumClearConfirm())) {
    clearAlbum()
    page.value = 1
  }
}
</script>

<template>
  <q-page class="page-shell album-page">
    <div class="page-content">
      <PageHeader
        title="Álbum de colección"
        subtitle="Todos los Pokémon que has descubierto jugando y explorando."
        icon="collections_bookmark"
      />

      <section class="progress-card">
        <div class="progress-card__ring">
          <q-circular-progress
            :value="progress"
            size="88px"
            :thickness="0.14"
            color="primary"
            track-color="grey-3"
            show-value
            class="progress-ring"
          />
        </div>
        <div class="progress-card__info">
          <h2>{{ count }} <span>/ {{ POKEMON_TOTAL }}</span></h2>
          <p>{{ progress }}% completado</p>
          <q-linear-progress :value="progress / 100" color="primary" rounded class="q-mt-sm" />
        </div>
      </section>

      <section class="filters">
        <q-input
          v-model="search"
          outlined
          dense
          bg-color="white"
          placeholder="Buscar por nombre o número..."
          class="filter-input"
          @update:model-value="onFilterChange"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          v-model="typeFilter"
          :options="[{ label: 'Todos los tipos', value: 'all' }, ...ALL_TYPES.map((t) => ({ label: t, value: t }))]"
          emit-value
          map-options
          outlined
          dense
          bg-color="white"
          class="filter-select"
          @update:model-value="onFilterChange"
        />
      </section>

      <div v-if="count === 0" class="empty-state">
        <q-icon name="photo_album" size="64px" color="grey-5" />
        <h3>Tu álbum está vacío</h3>
        <p>{{ emptyText }}</p>
        <div class="empty-actions">
          <q-btn unelevated color="primary" icon="catching_pokemon" label="Ir a Pokédex" to="/pokedex" />
          <q-btn outline color="secondary" icon="sports_esports" label="Jugar" to="/juegos" />
        </div>
      </div>

      <template v-else>
        <div v-if="filtered.length === 0" class="empty-state">
          <q-icon name="search_off" size="48px" color="grey-5" />
          <p>No hay resultados con esos filtros.</p>
        </div>

        <div v-else class="album-grid">
          <article
            v-for="entry in paginated"
            :key="entry.id"
            class="album-card"
            role="button"
            tabindex="0"
            @click="openDetail(entry)"
            @keyup.enter="openDetail(entry)"
          >
            <span class="album-card__id">#{{ String(entry.id).padStart(4, '0') }}</span>
            <div class="album-card__image">
              <img :src="entry.sprite" :alt="entry.name" loading="lazy" />
            </div>
            <h3 class="album-card__name">{{ entry.name }}</h3>
            <p v-if="entry.genus" class="album-card__genus">{{ entry.genus }}</p>
            <div class="album-card__types">
              <span
                v-for="type in entry.types"
                :key="type"
                class="type"
                :class="`type-${type}`"
              >
                {{ getTypeLabel(type) }}
              </span>
            </div>
          </article>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <q-btn
            flat
            round
            icon="chevron_left"
            :disable="page <= 1"
            @click="page -= 1"
          />
          <span>Página {{ page }} de {{ totalPages }}</span>
          <q-btn
            flat
            round
            icon="chevron_right"
            :disable="page >= totalPages"
            @click="page += 1"
          />
        </div>

        <div class="album-footer">
          <q-btn flat color="negative" icon="delete_outline" label="Vaciar álbum" @click="confirmClear" />
        </div>
      </template>

      <q-dialog v-model="detailOpen" maximized class="detail-dialog">
        <q-card class="detail-card">
          <q-bar class="detail-bar">
            <q-space />
            <q-btn flat round dense icon="close" v-close-popup aria-label="Cerrar" />
          </q-bar>
          <q-card-section class="detail-body">
            <div v-if="detailLoading" class="empty-state">
              <q-spinner-hourglass color="primary" size="48px" />
              <p>Cargando ficha completa desde la API...</p>
            </div>
            <PokemonProfile
              v-else-if="detailProfile"
              :profile="detailProfile"
              :in-album="hasPokemon(detailProfile.pokemon.id)"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<style scoped>
.album-page {
  background: var(--color-bg);
}

.progress-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 4px 24px var(--color-shadow);
}

@media (min-width: 480px) {
  .progress-card {
    flex-direction: row;
    text-align: left;
  }
}

.progress-card__info {
  flex: 1;
}

.progress-card__info h2 {
  margin: 0;
  font-size: clamp(1.5rem, 5vw, 2rem);
}

.progress-card__info h2 span {
  font-size: 1rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.progress-card__info p {
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
}

.filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

@media (min-width: 600px) {
  .filters {
    grid-template-columns: 1fr 200px;
  }
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 140px), 1fr));
  gap: 0.75rem;
}

.album-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: 0 2px 12px var(--color-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.album-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.album-card__id {
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.album-card__image {
  width: 100%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 0.25rem;
}

.album-card__image img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.album-card__name {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  text-transform: capitalize;
  text-align: center;
}

.album-card__genus {
  margin: 0 0 0.25rem;
  font-size: 0.6875rem;
  font-style: italic;
  color: var(--color-text-muted);
  text-align: center;
}

.album-card__types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
}

.album-card__types .type {
  font-size: 0.625rem;
  padding: 0.15rem 0.5rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.album-footer {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 2.5rem 1rem;
  color: var(--color-text-muted);
}

.empty-state h3 {
  margin: 0;
  color: var(--color-text);
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.detail-card {
  background: var(--color-bg);
  min-height: 100%;
}

.detail-bar {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: #fff;
}

.detail-body {
  padding: clamp(0.5rem, 3vw, 1rem);
  max-width: var(--max-content);
  margin: 0 auto;
}
</style>
