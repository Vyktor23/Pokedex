export const NAV_ITEMS = [
  {
    name: 'home',
    path: '/',
    label: 'Inicio',
    icon: 'home',
    match: (path) => path === '/',
  },
  {
    name: 'pokedex',
    path: '/pokedex',
    label: 'Pokédex',
    icon: 'catching_pokemon',
    match: (path) => path.startsWith('/pokedex'),
  },
  {
    name: 'album',
    path: '/album',
    label: 'Álbum',
    icon: 'collections_bookmark',
    match: (path) => path.startsWith('/album'),
  },
  {
    name: 'games',
    path: '/juegos',
    label: 'Juegos',
    icon: 'sports_esports',
    match: (path) => path.startsWith('/juegos'),
  },
]

export const GAME_ITEMS = [
  {
    name: 'adivina',
    path: '/juegos/adivina',
    title: '¿Quién es ese Pokémon?',
    description: 'Adivina el nombre mirando la silueta y las pistas.',
    icon: 'visibility_off',
    color: '#e3350d',
    gradient: 'linear-gradient(135deg, #e3350d 0%, #ff6b35 100%)',
  },
  {
    name: 'tipos',
    path: '/juegos/tipos',
    title: 'Maestro de Tipos',
    description: 'Identifica el tipo principal del Pokémon en pantalla.',
    icon: 'category',
    color: '#3b4cca',
    gradient: 'linear-gradient(135deg, #3b4cca 0%, #6c63ff 100%)',
  },
  {
    name: 'stats',
    path: '/juegos/stats',
    title: 'Duelo de Stats',
    description: '¿Cuál Pokémon tiene la estadística más alta?',
    icon: 'fitness_center',
    color: '#2e7d32',
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
  },
  {
    name: 'memoria',
    path: '/juegos/memoria',
    title: 'Memoria Pokémon',
    description: 'Encuentra las parejas antes de quedarte sin movimientos.',
    icon: 'grid_view',
    color: '#7b1fa2',
    gradient: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
  },
]
