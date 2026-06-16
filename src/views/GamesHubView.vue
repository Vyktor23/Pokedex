<script setup>
import { GAME_ITEMS } from '../constants/navigation'
import PageHeader from '../components/PageHeader.vue'
</script>

<template>
  <q-page class="page-shell games-hub">
    <div class="page-content">
      <PageHeader
        title="Arcade Pokémon"
        subtitle="Elige un minijuego y pon a prueba tu conocimiento."
        icon="sports_esports"
      />

      <div class="games-grid">
        <router-link
          v-for="game in GAME_ITEMS"
          :key="game.name"
          :to="game.path"
          class="game-card"
        >
          <div class="game-card__visual" :style="{ background: game.gradient }">
            <q-icon :name="game.icon" size="36px" />
          </div>
          <div class="game-card__body">
            <h2>{{ game.title }}</h2>
            <p>{{ game.description }}</p>
            <span class="game-card__cta">
              Jugar
              <q-icon name="play_arrow" size="18px" />
            </span>
          </div>
        </router-link>
      </div>

      <div class="games-tip">
        <q-icon name="emoji_events" color="accent" />
        <p>Al acertar en cualquier minijuego, el Pokémon se guarda en tu álbum.</p>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.games-hub {
  background: var(--color-bg);
}

.games-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.game-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 4px 24px var(--color-shadow);
  color: var(--color-text);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.game-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
}

.game-card__visual {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  color: #fff;
  flex-shrink: 0;
}

.game-card__body h2 {
  margin: 0 0 0.35rem;
  font-size: clamp(1rem, 3vw, 1.125rem);
}

.game-card__body p {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.game-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.games-tip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: rgba(255, 203, 5, 0.12);
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.games-tip p {
  margin: 0;
}
</style>
