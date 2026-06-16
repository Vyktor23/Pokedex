<script setup>
import { computed, ref } from 'vue'
import {
  getTypeClass, statPercent, formatHeight, formatWeight, getSprite,
} from '../utils/pokemon'
import {
  getTypeLabel, getHabitatLabel, getColorLabel, getShapeLabel,
  getStatLabel, getCaptureDifficulty,
} from '../utils/pokeapi'

const props = defineProps({
  profile: { type: Object, required: true },
  inAlbum: { type: Boolean, default: false },
})

const shiny = ref(false)
const cryPlaying = ref(false)

const pokemon = computed(() => props.profile.pokemon)

const artwork = computed(() => {
  const art = pokemon.value.sprites?.other?.['official-artwork']
  if (!art) return getSprite(pokemon.value)
  return shiny.value ? (art.front_shiny || art.front_default) : art.front_default
})

const badges = computed(() => {
  const list = []
  if (props.profile.isLegendary) list.push({ label: 'Legendario', color: 'accent', icon: 'stars' })
  if (props.profile.isMythical) list.push({ label: 'Mítico', color: 'purple', icon: 'auto_awesome' })
  if (props.profile.isBaby) list.push({ label: 'Bebé', color: 'pink', icon: 'child_care' })
  return list
})

const captureInfo = computed(() => getCaptureDifficulty(props.profile.captureRate))

const cardStyle = computed(() => {
  const colorMap = {
    red: '#e3350d', blue: '#3b4cca', yellow: '#ffcb05', green: '#78c850',
    purple: '#7b1fa2', pink: '#ee99ac', black: '#1a1a2e', brown: '#8d6e63',
    gray: '#9e9e9e', white: '#f5f5f5',
  }
  const accent = colorMap[props.profile.color] || 'var(--color-primary)'
  return { '--card-accent': accent }
})

function playCry() {
  const cry = pokemon.value.cries?.latest
  if (!cry) return
  const audio = new Audio(cry)
  cryPlaying.value = true
  audio.play().finally(() => { cryPlaying.value = false })
}
</script>

<template>
  <section class="profile" :style="cardStyle">
    <div class="profile__visual">
      <div class="profile__badges-row">
        <span class="profile__id">#{{ String(pokemon.id).padStart(4, '0') }}</span>
        <q-badge v-if="inAlbum" color="positive" label="En álbum" />
        <q-badge
          v-for="b in badges"
          :key="b.label"
          :color="b.color"
          :icon="b.icon"
          :label="b.label"
        />
      </div>

      <p v-if="profile.genus" class="profile__genus">{{ profile.genus }}</p>
      <h2 class="profile__name">{{ pokemon.name }}</h2>

      <div class="profile__image-wrap">
        <img :src="artwork" :alt="pokemon.name" class="profile__image" />
      </div>

      <div class="profile__actions">
        <q-btn
          flat
          round
          :icon="shiny ? 'brightness_7' : 'brightness_2'"
          :color="shiny ? 'accent' : 'grey-7'"
          :aria-label="shiny ? 'Ver normal' : 'Ver shiny'"
          @click="shiny = !shiny"
        />
        <q-btn
          v-if="pokemon.cries?.latest"
          flat
          round
          icon="volume_up"
          color="primary"
          :loading="cryPlaying"
          aria-label="Escuchar cry"
          @click="playCry"
        />
      </div>

      <div v-if="pokemon.sprites" class="profile__sprites">
        <img
          v-if="pokemon.sprites.other?.showdown?.front_default"
          :src="pokemon.sprites.other.showdown.front_default"
          alt="Sprite"
        />
        <img
          v-if="pokemon.sprites.other?.showdown?.back_default"
          :src="pokemon.sprites.other.showdown.back_default"
          alt="Sprite trasero"
        />
      </div>
    </div>

    <div class="profile__content">
      <blockquote v-if="profile.flavorText" class="profile__flavor">
        <q-icon name="format_quote" size="20px" />
        {{ profile.flavorText }}
      </blockquote>

      <div class="profile__grid">
        <div class="profile__chip">
          <span class="profile__chip-label">Tipos</span>
          <div class="profile__types">
            <span
              v-for="t in pokemon.types"
              :key="t.type.name"
              class="type"
              :class="getTypeClass(t.type.name)"
            >
              {{ getTypeLabel(t.type.name) }}
            </span>
          </div>
        </div>

        <div class="profile__chip">
          <span class="profile__chip-label">Hábitat</span>
          <span>{{ profile.habitat ? getHabitatLabel(profile.habitat) : 'Desconocido' }}</span>
        </div>

        <div class="profile__chip">
          <span class="profile__chip-label">Color</span>
          <span>{{ profile.color ? getColorLabel(profile.color) : '—' }}</span>
        </div>

        <div class="profile__chip">
          <span class="profile__chip-label">Forma</span>
          <span>{{ profile.shape ? getShapeLabel(profile.shape) : '—' }}</span>
        </div>

        <div class="profile__chip">
          <span class="profile__chip-label">Altura</span>
          <span>{{ formatHeight(pokemon.height) }}</span>
        </div>

        <div class="profile__chip">
          <span class="profile__chip-label">Peso</span>
          <span>{{ formatWeight(pokemon.weight) }}</span>
        </div>

        <div class="profile__chip">
          <span class="profile__chip-label">Exp. base</span>
          <span>{{ pokemon.base_experience }}</span>
        </div>

        <div class="profile__chip">
          <span class="profile__chip-label">Captura</span>
          <q-badge :color="captureInfo.color" :label="captureInfo.label" />
        </div>

        <div v-if="profile.generation" class="profile__chip">
          <span class="profile__chip-label">Generación</span>
          <span class="profile__cap">{{ profile.generation }}</span>
        </div>

        <div v-if="profile.growthRate" class="profile__chip">
          <span class="profile__chip-label">Crecimiento</span>
          <span class="profile__cap">{{ profile.growthRate }}</span>
        </div>
      </div>

      <div v-if="profile.abilities?.length" class="profile__section">
        <h3><q-icon name="bolt" /> Habilidades</h3>
        <div class="profile__abilities">
          <div v-for="ab in profile.abilities" :key="ab.name" class="profile__ability">
            <div class="profile__ability-head">
              <strong class="profile__cap">{{ ab.name }}</strong>
              <q-badge v-if="ab.isHidden" color="secondary" label="Oculta" />
            </div>
            <p v-if="ab.description">{{ ab.description }}</p>
          </div>
        </div>
      </div>

      <div v-if="profile.moves?.length" class="profile__section">
        <h3><q-icon name="sports_martial_arts" /> Movimientos (nivel)</h3>
        <div class="profile__moves">
          <span v-for="mv in profile.moves" :key="mv.name" class="profile__move">
            <small>Lv.{{ mv.level }}</small> {{ mv.name }}
          </span>
        </div>
      </div>

      <div v-if="profile.typeChart" class="profile__section">
        <h3><q-icon name="shield" /> Efectividad defensiva</h3>
        <div class="profile__effectiveness">
          <div v-if="profile.typeChart.weak.length" class="eff-group eff-group--weak">
            <span class="eff-label">Débil a</span>
            <span v-for="t in profile.typeChart.weak" :key="t" class="type" :class="getTypeClass(t)">
              {{ getTypeLabel(t) }}
            </span>
          </div>
          <div v-if="profile.typeChart.resist.length" class="eff-group eff-group--resist">
            <span class="eff-label">Resiste</span>
            <span v-for="t in profile.typeChart.resist" :key="t" class="type" :class="getTypeClass(t)">
              {{ getTypeLabel(t) }}
            </span>
          </div>
          <div v-if="profile.typeChart.immune.length" class="eff-group eff-group--immune">
            <span class="eff-label">Inmune a</span>
            <span v-for="t in profile.typeChart.immune" :key="t" class="type type-default">
              {{ getTypeLabel(t) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="profile.evolution?.length > 1" class="profile__section">
        <h3><q-icon name="timeline" /> Cadena evolutiva</h3>
        <div class="profile__evo">
          <template v-for="(evo, i) in profile.evolution" :key="evo.id">
            <span
              class="profile__evo-item"
              :class="{ 'profile__evo-item--current': evo.id === pokemon.id }"
            >
              #{{ evo.id }} {{ evo.name }}
            </span>
            <q-icon
              v-if="i < profile.evolution.length - 1"
              name="arrow_forward"
              size="16px"
              color="grey-6"
            />
          </template>
        </div>
      </div>

      <div class="profile__section">
        <h3><q-icon name="bar_chart" /> Estadísticas base</h3>
        <div v-for="s in pokemon.stats" :key="s.stat.name" class="profile__stat">
          <span class="profile__stat-name">{{ getStatLabel(s.stat.name) }}</span>
          <div class="profile__stat-bar">
            <div class="profile__stat-fill" :style="{ width: statPercent(s.base_stat) }">
              {{ s.base_stat }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="profile.eggGroups?.length" class="profile__section profile__section--inline">
        <h3><q-icon name="egg" /> Grupos huevo</h3>
        <p class="profile__cap">{{ profile.eggGroups.join(', ') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 3vw, 1.5rem);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 24px var(--color-shadow);
  padding: clamp(1rem, 4vw, 1.75rem);
  border-top: 4px solid var(--card-accent, var(--color-primary));
}

@media (min-width: 900px) {
  .profile {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.3fr);
    align-items: start;
  }
}

.profile__visual {
  text-align: center;
}

.profile__badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
  align-items: center;
}

.profile__id {
  font-weight: 700;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.profile__genus {
  margin: 0.5rem 0 0;
  font-style: italic;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.profile__name {
  margin: 0.15rem 0 0.75rem;
  font-size: clamp(1.5rem, 5vw, 2rem);
  text-transform: capitalize;
}

.profile__image-wrap {
  max-width: 300px;
  margin: 0 auto;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.profile__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.profile__actions {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.profile__sprites {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.75rem;
}

.profile__sprites img {
  width: 56px;
  height: 56px;
  image-rendering: pixelated;
}

.profile__flavor {
  margin: 0 0 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(59, 76, 202, 0.06), rgba(227, 53, 13, 0.06));
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text);
  border-left: 3px solid var(--card-accent, var(--color-primary));
}

.profile__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.profile__chip {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.profile__chip-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.profile__types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.profile__cap {
  text-transform: capitalize;
}

.profile__section {
  margin-bottom: 1rem;
}

.profile__section h3 {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 0.65rem;
  font-size: 0.95rem;
}

.profile__abilities {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile__ability {
  padding: 0.75rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.profile__ability-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.profile__ability p {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}

.profile__moves {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.profile__move {
  padding: 0.35rem 0.65rem;
  background: var(--color-bg);
  border-radius: 999px;
  font-size: 0.8125rem;
  text-transform: capitalize;
}

.profile__move small {
  opacity: 0.65;
  margin-right: 0.2rem;
}

.profile__effectiveness {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.eff-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.eff-label {
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 72px;
  color: var(--color-text-muted);
}

.eff-group--weak .eff-label { color: var(--color-danger); }
.eff-group--resist .eff-label { color: var(--color-success); }
.eff-group--immune .eff-label { color: var(--color-secondary); }

.profile__evo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.profile__evo-item {
  padding: 0.35rem 0.65rem;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  text-transform: capitalize;
}

.profile__evo-item--current {
  background: rgba(227, 53, 13, 0.12);
  color: var(--color-primary);
  font-weight: 700;
}

.profile__stat {
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.profile__stat-name {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.profile__stat-bar {
  height: 22px;
  background: var(--color-bg);
  border-radius: 999px;
  overflow: hidden;
}

.profile__stat-fill {
  height: 100%;
  min-width: 2rem;
  background: linear-gradient(90deg, var(--card-accent, var(--color-primary)), var(--color-secondary));
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #fff;
  transition: width 0.4s ease;
}
</style>
