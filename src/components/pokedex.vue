<script setup>
import { ref } from 'vue'
import axios from 'axios'

const pokemon = ref(null)
const buscador = ref('')
const loading = ref(false)
const error = ref('')

function random() {
  const numero = Math.floor(Math.random() * 1025) + 1
  traer(numero)
}

function buscar() {
  if (!buscador.value.trim()) {
    error.value = 'Escribe un número o nombre de Pokémon.'
    return
  }
  traer(buscador.value.trim())
}

async function traer(numero) {
  loading.value = true
  error.value = ''
  pokemon.value = null

  try {
    const r = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numero}`)
    pokemon.value = r.data
  } catch {
    error.value = 'No se encontró ese Pokémon. Intenta con otro nombre o número.'
  } finally {
    loading.value = false
  }
}

function getTypeClass(type) {
  return `type-${type}`
}

function statPercent(value) {
  return `${Math.min((value / 255) * 100, 100)}%`
}

function formatHeight(decimeters) {
  return `${(decimeters / 10).toFixed(1)} m`
}

function formatWeight(hectograms) {
  return `${(hectograms / 10).toFixed(1)} kg`
}
</script>

<template>
  <q-page class="pokedex-page">
    <div class="page-content">
      <header class="page-header">
        <h1 class="page-title">Explora Pokémon</h1>
        <p class="page-subtitle">Busca por nombre o número, o deja que el azar elija uno por ti.</p>
      </header>

      <section class="search-section" aria-label="Buscador de Pokémon">
        <q-input
          v-model="buscador"
          outlined
          dense
          bg-color="white"
          placeholder="Número o nombre del Pokémon..."
          class="search-input"
          @keyup.enter="buscar"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="search-actions">
          <q-btn
            unelevated
            color="positive"
            icon="search"
            label="Consultar"
            class="action-btn"
            :loading="loading"
            @click="buscar"
          />
          <q-btn
            unelevated
            color="negative"
            icon="casino"
            label="Aleatorio"
            class="action-btn"
            :loading="loading"
            @click="random"
          />
        </div>
      </section>

      <q-banner v-if="error" rounded class="error-banner" dense>
        <template #avatar>
          <q-icon name="warning" color="negative" />
        </template>
        {{ error }}
      </q-banner>

      <div v-if="loading" class="loading-state">
        <q-spinner-dots color="primary" size="48px" />
        <p>Cargando Pokémon...</p>
      </div>

      <section v-else-if="pokemon" class="pokemon-card" aria-live="polite">
        <div class="card-visual">
          <span class="pokemon-id">#{{ String(pokemon.id).padStart(4, '0') }}</span>
          <h2 class="pokemon-name">{{ pokemon.name }}</h2>

          <div class="image-wrapper">
            <img
              v-if="pokemon.sprites?.other?.['official-artwork']?.front_default"
              :src="pokemon.sprites.other['official-artwork'].front_default"
              :alt="`Arte oficial de ${pokemon.name}`"
              class="main-image"
            />
          </div>

          <div v-if="pokemon.sprites" class="sprites-row">
            <img
              v-if="pokemon.sprites.other?.showdown?.front_default"
              :src="pokemon.sprites.other.showdown.front_default"
              alt="Sprite frontal"
            />
            <img
              v-if="pokemon.sprites.other?.showdown?.back_default"
              :src="pokemon.sprites.other.showdown.back_default"
              alt="Sprite trasero"
            />
          </div>
        </div>

        <div class="card-details">
          <div class="info-grid">
            <div class="info-block">
              <span class="info-label">Tipos</span>
              <div class="types-row">
                <span
                  v-for="(e, i) in pokemon.types"
                  :key="i"
                  class="type"
                  :class="getTypeClass(e.type.name)"
                >
                  {{ e.type.name }}
                </span>
              </div>
            </div>

            <div v-if="pokemon.base_experience" class="info-block">
              <span class="info-label">Exp. base</span>
              <span class="info-value">{{ pokemon.base_experience }}</span>
            </div>

            <div v-if="pokemon.height" class="info-block">
              <span class="info-label">Altura</span>
              <span class="info-value">{{ formatHeight(pokemon.height) }}</span>
            </div>

            <div v-if="pokemon.weight" class="info-block">
              <span class="info-label">Peso</span>
              <span class="info-value">{{ formatWeight(pokemon.weight) }}</span>
            </div>
          </div>

          <div class="stats-section">
            <h3 class="stats-title">Estadísticas base</h3>
            <div
              v-for="(e, i) in pokemon.stats"
              :key="i"
              class="stat-row"
            >
              <span class="stat-name">{{ e.stat.name }}</span>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :style="{ width: statPercent(e.base_stat) }"
                >
                  <span class="stat-value">{{ e.base_stat }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div v-else-if="!error" class="empty-state">
        <q-icon name="catching_pokemon" size="64px" color="grey-5" />
        <p>Usa el buscador o el botón aleatorio para ver un Pokémon.</p>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.pokedex-page {
  min-height: calc(100dvh - var(--header-height));
  background: var(--color-bg);
}

.page-content {
  width: 100%;
  max-width: var(--max-content);
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 2rem);
}

.page-header {
  text-align: center;
  margin-bottom: clamp(1rem, 4vw, 1.75rem);
}

.page-title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: var(--color-text);
}

.page-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: clamp(0.875rem, 2.5vw, 1rem);
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 640px;
  margin: 0 auto clamp(1rem, 3vw, 1.5rem);
}

@media (min-width: 600px) {
  .search-section {
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .search-input {
    flex: 1 1 220px;
  }

  .search-actions {
    flex: 1 1 auto;
    justify-content: flex-end;
  }
}

.search-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-btn {
  flex: 1 1 auto;
  min-width: min(100%, 140px);
}

.error-banner {
  max-width: 640px;
  margin: 0 auto 1rem;
  background: #fff5f5;
  color: var(--color-danger);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: clamp(2rem, 8vw, 4rem) 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

.pokemon-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 3vw, 1.5rem);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 24px var(--color-shadow);
  padding: clamp(1rem, 4vw, 1.75rem);
  overflow: hidden;
}

@media (min-width: 768px) {
  .pokemon-card {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    align-items: start;
  }
}

.card-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.pokemon-id {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.pokemon-name {
  margin: 0.25rem 0 0.75rem;
  font-size: clamp(1.5rem, 5vw, 2rem);
  text-transform: capitalize;
  color: var(--color-text);
}

.image-wrapper {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sprites-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.sprites-row img {
  width: clamp(48px, 12vw, 72px);
  height: clamp(48px, 12vw, 72px);
  image-rendering: pixelated;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.75rem;
}

.info-block {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.info-value {
  font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
  font-weight: 600;
  text-transform: capitalize;
}

.types-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.stats-section {
  width: 100%;
}

.stats-title {
  margin: 0 0 0.75rem;
  font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
  color: var(--color-text);
}

.stat-row {
  display: grid;
  grid-template-columns: minmax(72px, 90px) 1fr;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.stat-name {
  font-size: clamp(0.75rem, 2vw, 0.8125rem);
  text-transform: capitalize;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-track {
  height: clamp(20px, 4vw, 24px);
  background: var(--color-bg);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  min-width: 2rem;
  background: linear-gradient(90deg, var(--color-success), #81c784);
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  transition: width 0.4s ease;
}

.stat-value {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
