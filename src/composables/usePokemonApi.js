import axios from 'axios'
import { randomPokemonId } from '../utils/pokemon'
import {
  flattenEvolutionChain,
  buildTypeChart,
  getFlavorText,
  getGenus,
  getTopMoves,
  extractIdFromUrl,
} from '../utils/pokeapi'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
})

const cache = new Map()

async function cachedGet(url) {
  if (cache.has(url)) return cache.get(url)
  const response = await api.get(url)
  cache.set(url, response.data)
  return response.data
}

export async function fetchPokemon(idOrName) {
  return cachedGet(`/pokemon/${idOrName}`)
}

export async function fetchRandomPokemon() {
  return fetchPokemon(randomPokemonId())
}

export async function fetchPokemonList(limit = 20, offset = 0) {
  const response = await api.get('/pokemon', { params: { limit, offset } })
  return response.data
}

export async function fetchSpecies(idOrName) {
  return cachedGet(`/pokemon-species/${idOrName}`)
}

export async function fetchType(name) {
  return cachedGet(`/type/${name}`)
}

export async function fetchAbility(name) {
  return cachedGet(`/ability/${name}`)
}

export async function fetchEvolutionChain(urlOrId) {
  const path = String(urlOrId).startsWith('http')
    ? urlOrId.replace('https://pokeapi.co/api/v2', '')
    : `/evolution-chain/${urlOrId}`
  return cachedGet(path)
}

export async function fetchPokemonProfile(idOrName) {
  const pokemon = await fetchPokemon(idOrName)
  const speciesId = extractIdFromUrl(pokemon.species.url)

  const species = await fetchSpecies(speciesId)

  const typeNames = [...new Set(pokemon.types.map((t) => t.type.name))]
  const abilityNames = [...new Set(pokemon.abilities.map((a) => a.ability.name))]

  const [evolutionData, ...rest] = await Promise.all([
    fetchEvolutionChain(species.evolution_chain.url),
    ...typeNames.map((name) => fetchType(name)),
    ...abilityNames.map((name) => fetchAbility(name)),
  ])

  const types = rest.slice(0, typeNames.length)
  const abilities = rest.slice(typeNames.length)

  const evolution = flattenEvolutionChain(evolutionData)
  const typeChart = buildTypeChart(types)
  const moves = getTopMoves(pokemon)
  const flavorText = getFlavorText(species)
  const genus = getGenus(species)

  const abilityDetails = pokemon.abilities.map((slot) => {
    const detail = abilities.find((a) => a.name === slot.ability.name)
    const effect = detail?.effect_entries?.find((e) => e.language.name === 'es')
      || detail?.effect_entries?.find((e) => e.language.name === 'en')
    return {
      name: slot.ability.name.replace(/-/g, ' '),
      isHidden: slot.is_hidden,
      description: effect?.effect?.replace(/\n/g, ' ') || '',
    }
  })

  return {
    pokemon,
    species,
    evolution,
    typeChart,
    moves,
    flavorText,
    genus,
    abilities: abilityDetails,
    habitat: species.habitat?.name || null,
    color: species.color?.name || null,
    shape: species.shape?.name || null,
    generation: species.generation?.name?.replace(/-/g, ' ') || null,
    captureRate: species.capture_rate,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    isBaby: species.is_baby,
    growthRate: species.growth_rate?.name?.replace(/-/g, ' ') || null,
    eggGroups: species.egg_groups?.map((g) => g.name.replace(/-/g, ' ')) || [],
    baseHappiness: species.base_happiness,
  }
}

export async function fetchPokemonGameBundle() {
  const pokemon = await fetchRandomPokemon()
  const speciesId = extractIdFromUrl(pokemon.species.url)
  const species = await fetchSpecies(speciesId)
  return {
    pokemon,
    genus: getGenus(species),
    flavorText: getFlavorText(species),
    habitat: species.habitat?.name,
    color: species.color?.name,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
  }
}
