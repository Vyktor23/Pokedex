<script setup>
import { ref } from 'vue'
import axios from 'axios'

const pokemon = ref(null)
const respuesta = ref('')
const imagenColor = ref('gris')
const dialogVisible = ref(false)
const mensajeTitulo = ref('')
const mensajeTexto = ref('')
const loading = ref(true)
const error = ref('')

async function cargarPokemon() {
  loading.value = true
  error.value = ''
  imagenColor.value = 'gris'
  respuesta.value = ''

  try {
    const numero = Math.floor(Math.random() * 1025) + 1
    const r = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numero}`)
    pokemon.value = r.data
  } catch {
    error.value = 'No se pudo cargar un Pokémon. Intenta de nuevo.'
    pokemon.value = null
  } finally {
    loading.value = false
  }
}

cargarPokemon()

function revisar() {
  if (!pokemon.value || !respuesta.value.trim()) return

  if (respuesta.value.trim().toLowerCase() === pokemon.value.name) {
    imagenColor.value = 'clara'
    mensajeTitulo.value = '¡Excelente, acertaste!'
    mensajeTexto.value = `Era ${pokemon.value.name}.`
  } else {
    mensajeTitulo.value = 'Parece que no era, vuelve a intentarlo.'
    mensajeTexto.value = ''
  }
  dialogVisible.value = true
}

function nuevoJuego() {
  dialogVisible.value = false
  cargarPokemon()
}

function formatHeight(decimeters) {
  return `${(decimeters / 10).toFixed(1)} m`
}

function formatWeight(hectograms) {
  return `${(hectograms / 10).toFixed(1)} kg`
}
</script>

<template>
  <q-page class="adivina-page">
    <div class="page-content">
      <header class="page-header">
        <h1 class="page-title">¿Quién es ese Pokémon?</h1>
        <p class="page-subtitle">Observa la silueta y las pistas, luego escribe el nombre.</p>
      </header>

      <q-banner v-if="error" rounded class="error-banner" dense>
        <template #avatar>
          <q-icon name="warning" color="negative" />
        </template>
        {{ error }}
        <template #action>
          <q-btn flat dense label="Reintentar" @click="cargarPokemon" />
        </template>
      </q-banner>

      <div v-if="loading" class="loading-state">
        <q-spinner-dots color="primary" size="48px" />
        <p>Preparando desafío...</p>
      </div>

      <template v-else-if="pokemon">
        <section class="game-card">
          <div class="card-image-section">
            <div class="image-frame">
              <img
                v-if="pokemon.sprites?.other?.['official-artwork']?.front_default"
                :src="pokemon.sprites.other['official-artwork'].front_default"
                :alt="imagenColor === 'gris' ? 'Pokémon misterioso' : pokemon.name"
                class="main-image"
                :class="{ 'main-image--hidden': imagenColor === 'gris' }"
              />
            </div>

            <div class="types-row">
              <span
                v-for="(e, i) in pokemon.types"
                :key="i"
                class="type"
                :class="e.type.name"
              >
                {{ e.type.name }}
              </span>
            </div>
          </div>

          <div class="card-info-section">
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Altura</span>
                <span class="info-value">{{ formatHeight(pokemon.height) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Peso</span>
                <span class="info-value">{{ formatWeight(pokemon.weight) }}</span>
              </div>
              <div v-if="pokemon.stats?.[0]" class="info-item">
                <span class="info-label">HP</span>
                <span class="info-value">{{ pokemon.stats[0].base_stat }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="answer-section" aria-label="Responder">
          <q-input
            v-model="respuesta"
            outlined
            dense
            bg-color="white"
            placeholder="Nombre del Pokémon"
            class="answer-input"
            @keyup.enter="revisar"
          >
            <template #prepend>
              <q-icon name="edit" />
            </template>
          </q-input>

          <div class="answer-actions">
            <q-btn
              unelevated
              color="primary"
              icon="check"
              label="Responder"
              class="answer-btn"
              @click="revisar"
            />
            <q-btn
              outline
              color="grey-8"
              icon="refresh"
              label="Nuevo"
              class="answer-btn"
              @click="nuevoJuego"
            />
          </div>
        </section>
      </template>

      <q-dialog v-model="dialogVisible" persistent>
        <q-card class="dialog-card">
          <q-card-section class="dialog-body">
            <q-icon
              :name="imagenColor === 'clara' ? 'celebration' : 'sentiment_dissatisfied'"
              :color="imagenColor === 'clara' ? 'positive' : 'warning'"
              size="48px"
              class="dialog-icon"
            />
            <h2 class="dialog-title">{{ mensajeTitulo }}</h2>
            <p v-if="mensajeTexto" class="dialog-text">{{ mensajeTexto }}</p>
          </q-card-section>
          <q-card-actions align="center" class="dialog-actions">
            <q-btn
              v-if="imagenColor === 'clara'"
              unelevated
              color="positive"
              label="Siguiente"
              @click="nuevoJuego"
            />
            <q-btn
              v-else
              unelevated
              color="primary"
              label="Seguir intentando"
              @click="dialogVisible = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<style scoped>
.adivina-page {
  min-height: calc(100dvh - var(--header-height));
  background: var(--color-bg);
}

.page-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 2rem);
}

.page-header {
  text-align: center;
  margin-bottom: clamp(1rem, 4vw, 1.75rem);
}

.page-title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.375rem, 5vw, 1.875rem);
  color: var(--color-text);
}

.page-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: clamp(0.875rem, 2.5vw, 1rem);
}

.error-banner {
  margin-bottom: 1rem;
  background: #fff5f5;
  color: var(--color-danger);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
}

.game-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 3vw, 1.5rem);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 24px var(--color-shadow);
  padding: clamp(1rem, 4vw, 1.75rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
}

@media (min-width: 640px) {
  .game-card {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
}

.card-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.image-frame {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.main-image {
  width: 90%;
  height: 90%;
  object-fit: contain;
  transition: filter 0.4s ease;
}

.main-image--hidden {
  filter: brightness(0) contrast(0);
}

.types-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.card-info-section {
  width: 100%;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: clamp(0.75rem, 3vw, 1rem);
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.info-label {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.info-value {
  font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
  font-weight: 700;
}

.answer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 480px) {
  .answer-section {
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .answer-input {
    flex: 1 1 200px;
  }
}

.answer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 480px) {
  .answer-actions {
    width: auto;
    flex: 0 0 auto;
  }
}

.answer-btn {
  flex: 1 1 auto;
  min-width: min(100%, 130px);
}

.dialog-card {
  width: min(90vw, 380px);
  border-radius: var(--radius-lg);
}

.dialog-body {
  text-align: center;
  padding: 1.5rem;
}

.dialog-icon {
  margin-bottom: 0.5rem;
}

.dialog-title {
  margin: 0 0 0.5rem;
  font-size: clamp(1rem, 4vw, 1.25rem);
  color: var(--color-text);
}

.dialog-text {
  margin: 0;
  color: var(--color-text-muted);
  text-transform: capitalize;
}

.dialog-actions {
  padding: 0 1rem 1rem;
}
</style>
