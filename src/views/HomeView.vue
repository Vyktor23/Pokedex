<script setup>
import { computed } from 'vue'
import { useAlbum } from '../composables/useAlbum'
import { GAME_ITEMS } from '../constants/navigation'
import PageHeader from '../components/PageHeader.vue'

const { count, progress } = useAlbum()

const featuredGames = computed(() => GAME_ITEMS.slice(0, 2))
</script>

<template>
  <q-page class="page-shell home-page">
    <div class="page-content">
      <section class="hero">
        <div class="hero__glow hero__glow--one" />
        <div class="hero__glow hero__glow--two" />
        <div class="hero__content">
          <q-avatar size="72px" class="hero__avatar">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokéball"
            />
          </q-avatar>
          <h1 class="hero__title">Tu aventura Pokémon</h1>
          <p class="hero__text">
            Explora, colecciona en tu álbum y desafía tu conocimiento con minijuegos.
          </p>
          <div class="hero__stats">
            <div class="stat-pill">
              <q-icon name="collections_bookmark" />
              <span>{{ count }} capturados</span>
            </div>
            <div class="stat-pill">
              <q-icon name="trending_up" />
              <span>{{ progress }}% del álbum</span>
            </div>
          </div>
        </div>
      </section>

      <section class="quick-grid" aria-label="Accesos rápidos">
        <router-link to="/pokedex" class="feature-card feature-card--pokedex">
          <q-icon name="catching_pokemon" size="32px" />
          <div>
            <h2>Pokédex</h2>
            <p>Busca y descubre Pokémon</p>
          </div>
          <q-icon name="arrow_forward" class="feature-card__arrow" />
        </router-link>

        <router-link to="/album" class="feature-card feature-card--album">
          <q-icon name="collections_bookmark" size="32px" />
          <div>
            <h2>Álbum</h2>
            <p>Tu colección personal</p>
          </div>
          <q-badge color="accent" text-color="dark" :label="`${count}`" class="feature-card__badge" />
        </router-link>

        <router-link to="/juegos" class="feature-card feature-card--games">
          <q-icon name="sports_esports" size="32px" />
          <div>
            <h2>Arcade</h2>
            <p>4 minijuegos para jugar</p>
          </div>
          <q-icon name="arrow_forward" class="feature-card__arrow" />
        </router-link>
      </section>

      <section class="section-block">
        <div class="section-head">
          <h2>Destacados</h2>
          <router-link to="/juegos" class="section-link">Ver todos</router-link>
        </div>
        <div class="mini-games-row">
          <router-link
            v-for="game in featuredGames"
            :key="game.name"
            :to="game.path"
            class="mini-game-card"
            :style="{ background: game.gradient }"
          >
            <q-icon :name="game.icon" size="28px" />
            <span>{{ game.title }}</span>
          </router-link>
        </div>
      </section>

      <section class="tip-card">
        <q-icon name="lightbulb" color="accent" size="24px" />
        <p>
          <strong>Tip:</strong> cada Pokémon que consultes en la Pokédex o aciertes en un juego
          se guarda automáticamente en tu álbum.
        </p>
      </section>
    </div>
  </q-page>
</template>

<style scoped>
.home-page {
  background:
    radial-gradient(circle at 10% 0%, rgba(255, 203, 5, 0.15), transparent 40%),
    radial-gradient(circle at 90% 20%, rgba(59, 76, 202, 0.12), transparent 35%),
    var(--color-bg);
}

.hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding: clamp(1.5rem, 5vw, 2.5rem);
  margin-bottom: clamp(1rem, 4vw, 1.75rem);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: #fff;
  box-shadow: 0 12px 40px rgba(59, 76, 202, 0.25);
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
}

.hero__glow--one {
  width: 180px;
  height: 180px;
  background: var(--color-accent);
  top: -60px;
  right: -40px;
}

.hero__glow--two {
  width: 140px;
  height: 140px;
  background: #fff;
  bottom: -50px;
  left: -30px;
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero__avatar {
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
}

.hero__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.75rem, 6vw, 2.5rem);
}

.hero__text {
  margin: 0 auto 1.25rem;
  max-width: 38ch;
  opacity: 0.92;
  font-size: clamp(0.9rem, 2.5vw, 1.05rem);
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 0.8125rem;
  font-weight: 600;
}

.quick-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: clamp(1rem, 4vw, 1.75rem);
}

@media (min-width: 640px) {
  .quick-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: 0 4px 20px var(--color-shadow);
  color: var(--color-text);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}

.feature-card h2 {
  margin: 0;
  font-size: 1rem;
}

.feature-card p {
  margin: 0.15rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.feature-card--pokedex .q-icon:first-child { color: var(--color-primary); }
.feature-card--album .q-icon:first-child { color: var(--color-secondary); }
.feature-card--games .q-icon:first-child { color: #7b1fa2; }

.feature-card__arrow {
  color: var(--color-text-muted);
}

.feature-card__badge {
  font-weight: 700;
}

.section-block {
  margin-bottom: 1.25rem;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.section-head h2 {
  margin: 0;
  font-size: 1.125rem;
}

.section-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary);
}

.mini-games-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 480px) {
  .mini-games-row {
    grid-template-columns: 1fr 1fr;
  }
}

.mini-game-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  color: #fff;
  font-weight: 600;
  font-size: 0.9375rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.mini-game-card:hover {
  transform: translateY(-2px);
}

.tip-card {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.tip-card p {
  margin: 0;
}
</style>
