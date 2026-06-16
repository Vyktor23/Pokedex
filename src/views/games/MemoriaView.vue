<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { fetchPokemonGameBundle } from '../../composables/usePokemonApi'
import { useAlbum } from '../../composables/useAlbum'
import { getShowdownSprite } from '../../utils/pokemon'
import {
  memoriaWinMessage, memoriaMatchMessage, apiErrorMessage, pickRandom, LOADING_MESSAGES,
} from '../../utils/messages'
import PageHeader from '../../components/PageHeader.vue'
import GameFeedback from '../../components/GameFeedback.vue'

const $q = useQuasar()
const cards = ref([])
const flipped = ref([])
const matched = ref([])
const moves = ref(0)
const loading = ref(true)
const loadingMessage = ref('')
const error = ref('')
const lock = ref(false)
const won = ref(false)
const winMessage = ref('')

const { capture } = useAlbum()

const pairsFound = computed(() => matched.value.length / 2)

async function initGame() {
  loading.value = true
  error.value = ''
  flipped.value = []
  matched.value = []
  moves.value = 0
  won.value = false
  lock.value = false
  loadingMessage.value = pickRandom(LOADING_MESSAGES)

  try {
    const bundles = []
    const ids = new Set()

    while (ids.size < 6) {
      const bundle = await fetchPokemonGameBundle()
      if (!ids.has(bundle.pokemon.id)) {
        ids.add(bundle.pokemon.id)
        bundles.push(bundle)
      }
    }

    cards.value = bundles.flatMap((bundle, index) => [
      { uid: `${index}-a`, pairId: index, bundle },
      { uid: `${index}-b`, pairId: index, bundle },
    ]).sort(() => Math.random() - 0.5)
  } catch {
    error.value = apiErrorMessage()
    cards.value = []
  } finally {
    loading.value = false
  }
}

initGame()

function isFlipped(card) {
  return flipped.value.includes(card.uid) || matched.value.includes(card.pairId)
}

function flipCard(card) {
  if (lock.value || isFlipped(card) || flipped.value.length >= 2) return

  flipped.value.push(card.uid)

  if (flipped.value.length === 2) {
    moves.value += 1
    const [first, second] = flipped.value.map(
      (uid) => cards.value.find((c) => c.uid === uid),
    )

    lock.value = true

    if (first.pairId === second.pairId) {
      matched.value.push(first.pairId)
      capture(first.bundle.pokemon, { genus: first.bundle.genus })
      flipped.value = []
      lock.value = false

      $q.notify({
        message: memoriaMatchMessage(first.bundle.pokemon.name),
        color: 'positive',
        icon: 'favorite',
        position: 'top',
        timeout: 1800,
      })

      if (matched.value.length === cards.value.length / 2) {
        winMessage.value = memoriaWinMessage(moves.value)
        won.value = true
      }
    } else {
      setTimeout(() => {
        flipped.value = []
        lock.value = false
      }, 800)
    }
  }
}

function restart() {
  won.value = false
  initGame()
}
</script>

<template>
  <q-page class="page-shell game-page">
    <div class="page-content">
      <div class="game-topbar">
        <q-btn flat round icon="arrow_back" to="/juegos" aria-label="Volver" />
        <div class="score-bar">
          <span class="score-chip"><q-icon name="touch_app" /> {{ moves }} movs</span>
          <span class="score-chip"><q-icon name="check_circle" color="positive" /> {{ pairsFound }}/6</span>
        </div>
      </div>

      <PageHeader
        title="Memoria Pokémon"
        subtitle="Voltea, recuerda y completa las parejas."
        icon="grid_view"
      />

      <q-banner v-if="error" rounded class="error-banner" dense>{{ error }}</q-banner>

      <div v-if="loading" class="state-box">
        <q-spinner-dots color="primary" size="48px" />
        <p>{{ loadingMessage }}</p>
      </div>

      <template v-else>
        <div class="memory-grid">
          <button
            v-for="card in cards"
            :key="card.uid"
            class="memory-card"
            :class="{
              'memory-card--flipped': isFlipped(card),
              'memory-card--matched': matched.includes(card.pairId),
            }"
            :aria-label="isFlipped(card) ? card.bundle.pokemon.name : 'Carta oculta'"
            @click="flipCard(card)"
          >
            <span class="memory-card__face memory-card__back">
              <q-icon name="catching_pokemon" />
            </span>
            <span class="memory-card__face memory-card__front">
              <img :src="getShowdownSprite(card.bundle.pokemon)" :alt="card.bundle.pokemon.name" />
            </span>
          </button>
        </div>

        <div class="memory-actions">
          <q-btn outline color="grey-8" icon="refresh" label="Reiniciar" @click="restart" />
        </div>
      </template>

      <GameFeedback
        v-model="won"
        variant="success"
        icon="emoji_events"
        :title="winMessage"
        subtitle="Todos los Pokémon de esta partida están en tu álbum."
        primary-label="Otra partida"
        @primary="restart"
      />
    </div>
  </q-page>
</template>

<style scoped>
@import '../../styles/game-shared.css';

.memory-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
}
</style>
