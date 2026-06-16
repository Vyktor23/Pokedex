import { computed, ref } from 'vue'
import { POKEMON_TOTAL } from '../utils/pokemon'

const STORAGE_KEY = 'pokedex-album-v1'
const album = ref(loadAlbum())

function loadAlbum() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(album.value))
}

export function useAlbum() {
  const entries = computed(() => Object.values(album.value).sort((a, b) => a.id - b.id))
  const count = computed(() => entries.value.length)
  const progress = computed(() => Math.round((count.value / POKEMON_TOTAL) * 100))

  function capture(pokemon, extra = {}) {
    if (!pokemon?.id) return false

    const isNew = !album.value[pokemon.id]
    album.value[pokemon.id] = {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites?.other?.['official-artwork']?.front_default
        || pokemon.sprites?.front_default
        || '',
      types: pokemon.types?.map((entry) => entry.type.name) || [],
      genus: extra.genus || album.value[pokemon.id]?.genus || '',
      caughtAt: album.value[pokemon.id]?.caughtAt || Date.now(),
    }
    persist()
    return isNew
  }

  function hasPokemon(id) {
    return Boolean(album.value[id])
  }

  function clearAlbum() {
    album.value = {}
    persist()
  }

  return {
    entries,
    count,
    progress,
    capture,
    hasPokemon,
    clearAlbum,
  }
}
