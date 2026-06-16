<script setup>
import { ref } from 'vue'
import { fetchPokemonGameBundle } from '../../composables/usePokemonApi'
import { useAlbum } from '../../composables/useAlbum'
import { getSprite, pickRandomTypes, getPrimaryType } from '../../utils/pokemon'
import { getTypeLabel } from '../../utils/pokeapi'
import {
  tiposWinMessage, tiposLoseMessage, apiErrorMessage, pickRandom, LOADING_MESSAGES,
} from '../../utils/messages'
import PageHeader from '../../components/PageHeader.vue'

const bundle = ref(null)
const options = ref([])
const loading = ref(true)
const loadingMessage = ref('')
const error = ref('')
const score = ref(0)
const streak = ref(0)
const answered = ref(false)
const selected = ref('')
const feedback = ref('')
const feedbackOk = ref(false)

const { capture } = useAlbum()

async function nextRound() {
  loading.value = true
  error.value = ''
  answered.value = false
  selected.value = ''
  feedback.value = ''
  loadingMessage.value = pickRandom(LOADING_MESSAGES)

  try {
    bundle.value = await fetchPokemonGameBundle()
    const correct = getPrimaryType(bundle.value.pokemon)
    options.value = pickRandomTypes(correct, 4)
  } catch {
    error.value = apiErrorMessage()
    bundle.value = null
  } finally {
    loading.value = false
  }
}

nextRound()

function choose(type) {
  if (answered.value || !bundle.value) return

  selected.value = type
  answered.value = true
  const correct = getPrimaryType(bundle.value.pokemon)

  if (type === correct) {
    score.value += 1
    streak.value += 1
    feedbackOk.value = true
    feedback.value = tiposWinMessage(getTypeLabel(correct), streak.value)
    capture(bundle.value.pokemon, { genus: bundle.value.genus })
  } else {
    streak.value = 0
    feedbackOk.value = false
    feedback.value = tiposLoseMessage(getTypeLabel(correct), getTypeLabel(type))
  }
}
</script>

<template>
  <q-page class="page-shell game-page">
    <div class="page-content">
      <div class="game-topbar">
        <q-btn flat round icon="arrow_back" to="/juegos" aria-label="Volver" />
        <div class="score-bar">
          <span class="score-chip"><q-icon name="star" color="accent" /> {{ score }} pts</span>
          <span class="score-chip"><q-icon name="local_fire_department" color="negative" /> x{{ streak }}</span>
        </div>
      </div>

      <PageHeader
        title="Maestro de Tipos"
        subtitle="Analiza al Pokémon y elige su tipo principal."
        icon="category"
      />

      <q-banner v-if="error" rounded class="error-banner" dense>{{ error }}</q-banner>

      <div v-if="loading" class="state-box">
        <q-spinner-dots color="primary" size="48px" />
        <p>{{ loadingMessage }}</p>
      </div>

      <template v-else-if="bundle">
        <section class="game-card">
          <div class="card-image-section">
            <div class="image-frame">
              <img :src="getSprite(bundle.pokemon)" :alt="bundle.pokemon.name" class="main-image" />
            </div>
            <p v-if="bundle.genus" class="genus-hint">{{ bundle.genus }}</p>
            <p class="hint-text">¿Cuál es su tipo principal?</p>
          </div>
        </section>

        <div class="options-grid">
          <q-btn
            v-for="type in options"
            :key="type"
            unelevated
            class="option-btn type"
            :class="[
              `type-${type}`,
              {
                'option-btn--wrong': answered && type === selected && type !== getPrimaryType(bundle.pokemon),
                'option-btn--right': answered && type === getPrimaryType(bundle.pokemon),
              },
            ]"
            :disable="answered"
            :label="getTypeLabel(type)"
            @click="choose(type)"
          />
        </div>

        <q-banner
          v-if="feedback"
          rounded
          class="q-mt-md feedback-banner"
          :class="feedbackOk ? 'feedback-banner--ok' : 'feedback-banner--fail'"
          dense
        >
          <template #avatar>
            <q-icon :name="feedbackOk ? 'verified' : 'highlight_off'" />
          </template>
          {{ feedback }}
        </q-banner>

        <div class="q-mt-md text-center">
          <q-btn unelevated color="primary" icon="skip_next" label="Siguiente" :disable="!answered" @click="nextRound" />
        </div>
      </template>
    </div>
  </q-page>
</template>

<style scoped>
@import '../../styles/game-shared.css';

.genus-hint {
  margin: 0;
  font-style: italic;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.hint-text {
  margin: 0.25rem 0 0;
  font-weight: 600;
  color: var(--color-text-muted);
}

.option-btn--right { outline: 3px solid var(--color-success); }
.option-btn--wrong { outline: 3px solid var(--color-danger); opacity: 0.75; }

.feedback-banner--ok { background: #f1f8f4; color: var(--color-success); }
.feedback-banner--fail { background: #fff5f5; color: var(--color-danger); }
</style>
