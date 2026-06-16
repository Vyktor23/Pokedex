export const POKEMON_TOTAL = 1025

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

export function randomPokemonId() {
  return Math.floor(Math.random() * POKEMON_TOTAL) + 1
}

export function getTypeClass(type) {
  return `type-${type}`
}

export function statPercent(value) {
  return `${Math.min((value / 255) * 100, 100)}%`
}

export function formatHeight(decimeters) {
  return `${(decimeters / 10).toFixed(1)} m`
}

export function formatWeight(hectograms) {
  return `${(hectograms / 10).toFixed(1)} kg`
}

export function getSprite(pokemon) {
  return pokemon?.sprites?.other?.['official-artwork']?.front_default
    || pokemon?.sprites?.front_default
    || ''
}

export function getShowdownSprite(pokemon) {
  return pokemon?.sprites?.other?.showdown?.front_default
    || pokemon?.sprites?.front_default
    || ''
}

export function getPrimaryType(pokemon) {
  return pokemon?.types?.[0]?.type?.name || 'normal'
}

export function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickRandomTypes(correctType, count = 4) {
  const pool = ALL_TYPES.filter((type) => type !== correctType)
  const options = shuffle(pool).slice(0, count - 1)
  options.push(correctType)
  return shuffle(options)
}
