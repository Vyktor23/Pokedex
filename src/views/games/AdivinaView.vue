<script setup>
import { ref } from 'vue'
import { fetchPokemonGameBundle } from '../../composables/usePokemonApi'
import { useAlbum } from '../../composables/useAlbum'
import { formatHeight, formatWeight } from '../../utils/pokemon'
import { getTypeLabel } from '../../utils/pokeapi'
import {
  adivinaWinMessage, adivinaLoseMessage, apiErrorMessage, pickRandom, LOADING_MESSAGES,
} from '../../utils/messages'
import PageHeader from '../../components/PageHeader.vue'
import GameFeedback from '../../components/GameFeedback.vue'

const bundle = ref(null)
const respuesta = ref('')
const imagenColor = ref('gris')
const dialogVisible = ref(false)
const dialogVariant = ref('success')
const mensajeTitulo = ref('')
const mensajeTexto = ref('')
const loading = ref(true)
const loadingMessage = ref('')
const error = ref('')
const streak = ref(0)
const showHint = ref(false)

const { capture } = useAlbum()

async function cargarPokemon() {
  loading.value = true
  error.value = ''
  imagenColor.value = 'gris'
  respuesta.value = ''
  showHint.value = false
  loadingMessage.value = pickRandom(LOADING_MESSAGES)

  try {
    bundle.value = await fetchPokemonGameBundle()
  } catch {
    error.value = apiErrorMessage()
    bundle.value = null
  } finally {
    loading.value = false
  }
}

cargarPokemon()

function revisar() {
  if (!bundle.value || !respuesta.value.trim()) return

  const name = bundle.value.pokemon.name

  if (respuesta.value.trim().toLowerCase() === name) {
    imagenColor.value = 'clara'
    streak.value += 1
    capture(bundle.value.pokemon, { genus: bundle.value.genus })
    dialogVariant.value = 'success'
    mensajeTitulo.value = adivinaWinMessage(name, streak.value)
    mensajeTexto.value = bundle.value.flavorText
      ? `"${bundle.value.flavorText.slice(0, 120)}..."`
      : (bundle.value.genus ? `Clasificación: ${bundle.value.genus}` : '')
  } else {
    streak.value = 0
    dialogVariant.value = 'error'
    mensajeTitulo.value = adivinaLoseMessage(name, bundle.value.genus)
    mensajeTexto.value = bundle.value.habitat
      ? `Suele habitar: ${bundle.value.habitat.replace(/-/g, ' ')}.`
      : ''
    showHint.value = true
  }
  dialogVisible.value = true
}

function nuevoJuego() {
  dialogVisible.value = false
  cargarPokemon()
}
</script>

<template>
  <q-page class="page-shell game-page">
    <div class="page-content">
      <div class="game-topbar">
        <q-btn flat round icon="arrow_back" to="/juegos" aria-label="Volver" />
        <q-badge color="accent" text-color="dark" :label="`Racha x${streak}`" />
      </div>

      <PageHeader
        title="¿Quién es ese Pokémon?"
        subtitle="Silueta + pistas de la API. ¿Podrás nombrarlo?"
        icon="visibility_off"
      />

      <q-banner v-if="error" rounded class="error-banner" dense>
        <template #avatar><q-icon name="cloud_off" color="negative" /></template>
        {{ error }}
        <template #action>
          <q-btn flat dense label="Reintentar" @click="cargarPokemon" />
        </template>
      </q-banner>

      <div v-if="loading" class="state-box">
        <q-spinner-dots color="primary" size="48px" />
        <p>{{ loadingMessage }}</p>
      </div>

      <template v-else-if="bundle">
        <section class="game-card">
          <div class="card-image-section">
            <div class="image-frame">
              <img
                v-if="bundle.pokemon.sprites?.other?.['official-artwork']?.front_default"
                :src="bundle.pokemon.sprites.other['official-artwork'].front_default"
                :alt="imagenColor === 'gris' ? 'Pokémon misterioso' : bundle.pokemon.name"
                class="main-image"
                :class="{ 'main-image--hidden': imagenColor === 'gris' }"
              />
            </div>
            <p v-if="showHint && bundle.genus" class="hint-reveal">{{ bundle.genus }}</p>
            <div v-else class="types-row">
              <span v-for="(e, i) in bundle.pokemon.types" :key="i" class="type" :class="e.type.name">
                {{ getTypeLabel(e.type.name) }}
              </span>
            </div>
            <q-badge
              v-if="bundle.isLegendary || bundle.isMythical"
              color="accent"
              text-color="dark"
              :label="bundle.isMythical ? 'Mítico' : 'Legendario'"
            />
          </div>

          <div class="card-info-section">
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Altura</span>
                <span class="info-value">{{ formatHeight(bundle.pokemon.height) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Peso</span>
                <span class="info-value">{{ formatWeight(bundle.pokemon.weight) }}</span>
              </div>
              <div v-if="bundle.pokemon.stats?.[0]" class="info-item">
                <span class="info-label">HP</span>
                <span class="info-value">{{ bundle.pokemon.stats[0].base_stat }}</span>
              </div>
              <div v-if="bundle.color" class="info-item">
                <span class="info-label">Color</span>
                <span class="info-value">{{ bundle.color }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="answer-section">
          <q-input
            v-model="respuesta"
            outlined
            dense
            bg-color="white"
            placeholder="Escribe el nombre..."
            class="answer-input"
            @keyup.enter="revisar"
          >
            <template #prepend><q-icon name="edit" /></template>
          </q-input>
          <div class="answer-actions">
            <q-btn unelevated color="primary" icon="check" label="Responder" @click="revisar" />
            <q-btn outline color="grey-8" icon="refresh" label="Nuevo" @click="nuevoJuego" />
          </div>
        </section>
      </template>

      <GameFeedback
        v-model="dialogVisible"
        :variant="dialogVariant"
        :title="mensajeTitulo"
        :subtitle="mensajeTexto"
        :primary-label="dialogVariant === 'success' ? 'Siguiente desafío' : 'Seguir intentando'"
        @primary="dialogVariant === 'success' ? nuevoJuego() : (dialogVisible = false)"
      />
    </div>
  </q-page>
</template>

<style scoped>
@import '../../styles/game-shared.css';

.hint-reveal {
  margin: 0;
  font-style: italic;
  color: var(--color-secondary);
  font-weight: 600;
}
</style>
