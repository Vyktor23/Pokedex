const TYPE_LABELS = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
  grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
  ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
  rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
  steel: 'Acero', fairy: 'Hada',
}

const HABITAT_LABELS = {
  cave: 'Cueva', forest: 'Bosque', grassland: 'Pradera', mountain: 'Montaña',
  rare: 'Raro', 'rough-terrain': 'Terreno árido', sea: 'Mar', urban: 'Ciudad',
  'waters-edge': 'Orilla del agua',
}

const COLOR_LABELS = {
  black: 'Negro', blue: 'Azul', brown: 'Marrón', gray: 'Gris', green: 'Verde',
  pink: 'Rosa', purple: 'Morado', red: 'Rojo', white: 'Blanco', yellow: 'Amarillo',
}

const SHAPE_LABELS = {
  ball: 'Bola', squiggle: 'Serpenteante', fish: 'Pez', arms: 'Brazos',
  blob: 'Amorfo', upright: 'Bípedo', legs: 'Cuadrúpedo', quadruped: 'Cuadrúpedo',
  wings: 'Alas', tentacles: 'Tentáculos', heads: 'Cabezas', humanoid: 'Humanoide',
  'bug-wings': 'Insectoide', armor: 'Armadura',
}

const STAT_LABELS = {
  hp: 'HP', attack: 'Ataque', defense: 'Defensa',
  'special-attack': 'At. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidad',
}

export function getLocalizedText(entries, field = 'flavor_text') {
  if (!entries?.length) return ''
  const es = entries.find((e) => e.language.name === 'es')
  const en = entries.find((e) => e.language.name === 'en')
  const text = (es || en)?.[field] || ''
  return text.replace(/\f/g, ' ').replace(/\n/g, ' ').trim()
}

export function getGenus(species) {
  return getLocalizedText(species?.genera, 'genus')
}

export function getFlavorText(species) {
  return getLocalizedText(species?.flavor_text_entries, 'flavor_text')
}

export function getTypeLabel(type) {
  return TYPE_LABELS[type] || type
}

export function getHabitatLabel(habitat) {
  return HABITAT_LABELS[habitat] || habitat
}

export function getColorLabel(color) {
  return COLOR_LABELS[color] || color
}

export function getShapeLabel(shape) {
  return SHAPE_LABELS[shape] || shape
}

export function getStatLabel(stat) {
  return STAT_LABELS[stat] || stat
}

export function flattenEvolutionChain(chainNode) {
  const result = []

  function walk(node) {
    const id = Number(node.species.url.split('/').filter(Boolean).pop())
    result.push({ id, name: node.species.name })
    node.evolves_to.forEach(walk)
  }

  walk(chainNode.chain)
  return result
}

export function getTopMoves(pokemon, limit = 6) {
  if (!pokemon?.moves) return []

  return pokemon.moves
    .map((entry) => {
      const levelUps = entry.version_group_details.filter(
        (v) => v.move_learn_method.name === 'level-up',
      )
      if (!levelUps.length) return null
      return {
        name: entry.move.name.replace(/-/g, ' '),
        level: Math.min(...levelUps.map((v) => v.level_learned_at)),
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.level - b.level)
    .slice(0, limit)
}

export function buildTypeChart(typeDataList) {
  const weak = new Set()
  const resist = new Set()
  const immune = new Set()

  typeDataList.forEach((typeData) => {
    typeData.damage_relations.double_damage_from.forEach((t) => weak.add(t.name))
    typeData.damage_relations.half_damage_from.forEach((t) => resist.add(t.name))
    typeData.damage_relations.no_damage_from.forEach((t) => immune.add(t.name))
  })

  resist.forEach((t) => weak.delete(t))
  immune.forEach((t) => {
    weak.delete(t)
    resist.delete(t)
  })

  return {
    weak: [...weak],
    resist: [...resist],
    immune: [...immune],
  }
}

export function getCaptureDifficulty(rate) {
  if (rate >= 200) return { label: 'Muy fácil', color: 'positive' }
  if (rate >= 120) return { label: 'Fácil', color: 'info' }
  if (rate >= 60) return { label: 'Normal', color: 'primary' }
  if (rate >= 30) return { label: 'Difícil', color: 'warning' }
  return { label: 'Ultra raro', color: 'negative' }
}

export function extractIdFromUrl(url) {
  return url.split('/').filter(Boolean).pop()
}
