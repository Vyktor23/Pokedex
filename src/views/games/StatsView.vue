<script setup>
import { ref } from 'vue'
import { fetchPokemonGameBundle } from '../../composables/usePokemonApi'
import { useAlbum } from '../../composables/useAlbum'
import { getShowdownSprite } from '../../utils/pokemon'
import { getStatLabel } from '../../utils/pokeapi'
import {
  statsWinMessage, statsLoseMessage, statsTieMessage, apiErrorMessage, pickRandom, LOADING_MESSAGES,
} from '../../utils/messages'
import PageHeader from '../../components/PageHeader.vue'

const bundleA = ref(null)
const bundleB = ref(null)
const statName = ref('')
const statKey = ref('')
const loading = ref(true)
const loadingMessage = ref('')
const error = ref('')
const score = ref(0)
const streak = ref(0)
const answered = ref(false)
const result = ref('')
const resultOk = ref(false)
const winner = ref(null)

const { capture } = useAlbum()

async function loadDuel() {
  loading.value = true
  error.value = ''
  answered.value = false
  result.value = ''
  winner.value = null
  loadingMessage.value = pickRandom(LOADING_MESSAGES)

  try {
    const [a, b] = await Promise.all([fetchPokemonGameBundle(), fetchPokemonGameBundle()])
    bundleA.value = a
    bundleB.value = b

    const stat = a.pokemon.stats[Math.floor(Math.random() * a.pokemon.stats.length)]
    statKey.value = stat.stat.name
    statName.value = getStatLabel(stat.stat.name)
  } catch {
    error.value = apiErrorMessage()
    bundleA.value = null
    bundleB.value = null
  } finally {
    loading.value = false
  }
}

loadDuel()

function getStat(pokemon) {
  return pokemon?.stats?.find((s) => s.stat.name === statKey.value)?.base_stat ?? 0
}

function pick(side) {
  if (answered.value || !bundleA.value || !bundleB.value) return

  answered.value = true
  const valueA = getStat(bundleA.value.pokemon)
  const valueB = getStat(bundleB.value.pokemon)

  let correctSide = 'tie'
  if (valueA > valueB) correctSide = 'a'
  else if (valueB > valueA) correctSide = 'b'

  winner.value = correctSide
  const isCorrect = correctSide === 'tie' || side === correctSide

  if (isCorrect) {
    score.value += 1
    streak.value += 1
    resultOk.value = true
    result.value = correctSide === 'tie'
      ? statsTieMessage(valueA, statName.value)
      : statsWinMessage(statName.value, streak.value)
    const captured = correctSide === 'b' ? bundleB.value : bundleA.value
    capture(captured.pokemon, { genus: captured.genus })
  } else {
    streak.value = 0
    resultOk.value = false
    result.value = statsLoseMessage(
      bundleA.value.pokemon.name,
      valueA,
      bundleB.value.pokemon.name,
      valueB,
      statName.value,
    )
  }
}
</script>

<template>
  <q-page class="page-shell game-page">
    <div class="page-content">
      <div class="game-topbar">
        <q-btn flat round icon="arrow_back" to="/juegos" aria-label="Volver" />
        <div class="score-bar">
          <span class="score-chip"><q-icon name="star" color="accent" /> {{ score }}</span>
          <span class="score-chip"><q-icon name="local_fire_department" color="negative" /> x{{ streak }}</span>
        </div>
      </div>

      <PageHeader
        title="Duelo de Stats"
        subtitle="Datos reales de la API. ¿Quién gana en la stat sorteada?"
        icon="fitness_center"
      />

      <q-banner v-if="error" rounded class="error-banner" dense>{{ error }}</q-banner>

      <div v-if="loading" class="state-box">
        <q-spinner-dots color="primary" size="48px" />
        <p>{{ loadingMessage }}</p>
      </div>

      <template v-else-if="bundleA && bundleB">
        <div class="stat-question">
          <q-icon name="bolt" color="accent" />
          <span>Stat en juego: <strong>{{ statName }}</strong></span>
        </div>

        <div class="duel-arena">
          <button
            class="duel-card"
            :class="{ 'duel-card--disabled': answered, 'duel-card--winner': answered && winner === 'a' }"
            :disabled="answered"
            @click="pick('a')"
          >
            <img :src="getShowdownSprite(bundleA.pokemon)" :alt="bundleA.pokemon.name" />
            <span class="duel-name">{{ bundleA.pokemon.name }}</span>
            <span v-if="bundleA.genus" class="duel-genus">{{ bundleA.genus }}</span>
            <span v-if="answered" class="duel-stat">{{ getStat(bundleA.pokemon) }}</span>
          </button>

          <div class="duel-vs">VS</div>

          <button
            class="duel-card"
            :class="{ 'duel-card--disabled': answered, 'duel-card--winner': answered && winner === 'b' }"
            :disabled="answered"
            @click="pick('b')"
          >
            <img :src="getShowdownSprite(bundleB.pokemon)" :alt="bundleB.pokemon.name" />
            <span class="duel-name">{{ bundleB.pokemon.name }}</span>
            <span v-if="bundleB.genus" class="duel-genus">{{ bundleB.genus }}</span>
            <span v-if="answered" class="duel-stat">{{ getStat(bundleB.pokemon) }}</span>
          </button>
        </div>

        <q-banner
          v-if="result"
          rounded
          class="q-mb-md feedback-banner"
          :class="resultOk ? 'feedback-banner--ok' : 'feedback-banner--fail'"
          dense
        >
          <template #avatar>
            <q-icon :name="resultOk ? 'military_tech' : 'analytics'" />
          </template>
          {{ result }}
        </q-banner>

        <div class="text-center">
          <q-btn unelevated color="primary" icon="refresh" label="Nuevo duelo" :disable="!answered" @click="loadDuel" />
        </div>
      </template>
    </div>
  </q-page>
</template>

<style scoped>
@import '../../styles/game-shared.css';

.stat-question {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-size: 0.9375rem;
}

.duel-name {
  display: block;
  text-transform: capitalize;
  font-weight: 700;
  margin-top: 0.25rem;
}

.duel-genus {
  display: block;
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-text-muted);
}

.duel-stat {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-secondary);
}

.duel-card--winner {
  border-color: var(--color-success) !important;
  background: #f1f8f4;
}

.feedback-banner--ok { background: #f1f8f4; color: var(--color-success); }
.feedback-banner--fail { background: #fff8f0; color: #e65100; }
</style>
