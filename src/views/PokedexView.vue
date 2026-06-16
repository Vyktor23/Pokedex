<script setup>
import { ref } from 'vue'
import { fetchPokemonProfile } from '../composables/usePokemonApi'
import { useAlbum } from '../composables/useAlbum'
import {
  pickRandom, LOADING_MESSAGES, NOT_FOUND_MESSAGES, EMPTY_SEARCH_MESSAGES,
  captureNewMessage, captureDuplicateMessage,
} from '../utils/messages'
import PageHeader from '../components/PageHeader.vue'
import PokemonProfile from '../components/PokemonProfile.vue'

const profile = ref(null)
const buscador = ref('')
const loading = ref(false)
const loadingMessage = ref('')
const error = ref('')
const captureMessage = ref('')
const emptyMessage = ref(pickRandom(EMPTY_SEARCH_MESSAGES))

const { capture, hasPokemon } = useAlbum()

function random() {
  traer(Math.floor(Math.random() * 1025) + 1)
}

function buscar() {
  if (!buscador.value.trim()) {
    error.value = 'La Pokédex necesita un nombre o número. ¡No lee mentes!'
    return
  }
  traer(buscador.value.trim())
}

async function traer(numero) {
  loading.value = true
  error.value = ''
  captureMessage.value = ''
  profile.value = null
  loadingMessage.value = pickRandom(LOADING_MESSAGES)

  try {
    const data = await fetchPokemonProfile(numero)
    profile.value = data
    const isNew = capture(data.pokemon, { genus: data.genus })
    captureMessage.value = isNew
      ? captureNewMessage(data.pokemon.name)
      : captureDuplicateMessage(data.pokemon.name)
  } catch {
    error.value = pickRandom(NOT_FOUND_MESSAGES)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-page class="page-shell pokedex-page">
    <div class="page-content">
      <PageHeader
        title="Explora Pokémon"
        subtitle="Datos completos: especie, evolución, habilidades, tipos, movimientos y más."
        icon="catching_pokemon"
      />

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
          <q-btn unelevated color="positive" icon="search" label="Consultar" class="action-btn" :loading="loading" @click="buscar" />
          <q-btn unelevated color="negative" icon="casino" label="Aleatorio" class="action-btn" :loading="loading" @click="random" />
        </div>
      </section>

      <q-banner v-if="error" rounded class="banner banner--error" dense>
        <template #avatar><q-icon name="travel_explore" color="negative" /></template>
        {{ error }}
      </q-banner>

      <q-banner v-if="captureMessage" rounded class="banner banner--success" dense>
        <template #avatar><q-icon name="celebration" color="positive" /></template>
        {{ captureMessage }}
        <template #action>
          <q-btn flat dense label="Ver álbum" to="/album" />
        </template>
      </q-banner>

      <div v-if="loading" class="state-box">
        <q-spinner-hourglass color="primary" size="48px" />
        <p class="loading-text">{{ loadingMessage }}</p>
      </div>

      <PokemonProfile
        v-else-if="profile"
        :profile="profile"
        :in-album="hasPokemon(profile.pokemon.id)"
      />

      <div v-else-if="!error" class="state-box">
        <q-icon name="radar" size="64px" color="grey-5" />
        <p>{{ emptyMessage }}</p>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.pokedex-page { background: var(--color-bg); }

.search-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 640px;
  margin: 0 auto clamp(1rem, 3vw, 1.5rem);
}

@media (min-width: 600px) {
  .search-section { flex-direction: row; align-items: flex-start; flex-wrap: wrap; }
  .search-input { flex: 1 1 220px; }
  .search-actions { flex: 1 1 auto; justify-content: flex-end; }
}

.search-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.action-btn { flex: 1 1 auto; min-width: min(100%, 140px); }

.banner { max-width: 100%; margin-bottom: 1rem; }
.banner--error { background: #fff5f5; color: var(--color-danger); }
.banner--success { background: #f1f8f4; color: var(--color-success); }

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: clamp(2rem, 8vw, 4rem) 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

.loading-text {
  max-width: 28ch;
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
</style>
