export function pickRandom(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

function withName(name, messages) {
  return messages.map((msg) => msg.replace('{name}', name))
}

export const LOADING_MESSAGES = [
  'Sincronizando con la Pokédex Nacional...',
  'Escaneando datos del Profesor Oak...',
  'Consultando el PC de Bill...',
  'Rastreando señal salvaje en la ruta...',
  'Decodificando el cry del Pokémon...',
  'Cargando cadena evolutiva...',
]

export const NOT_FOUND_MESSAGES = [
  'Ese Pokémon no aparece en ninguna ruta conocida. ¿Seguro que escribiste bien el nombre?',
  'La Pokédex no reconoce esa especie. Prueba con otro número o nombre.',
  'Parece que ese Pokémon se esconde mejor que un Zubat en una cueva.',
  '404: Pokémon no encontrado en la región actual.',
]

export const EMPTY_SEARCH_MESSAGES = [
  'La Pokédex está en standby. Escribe un nombre o suelta el azar.',
  '¿A quién vamos a descubrir hoy? Tu aventura empieza con una búsqueda.',
]

export function captureNewMessage(name) {
  return pickRandom(withName(name, [
    '¡{name} capturado! Tu álbum acaba de brillar un poco más.',
    '¡Nueva entrada desbloqueada! {name} ya es parte de tu leyenda.',
    '¡Click en la Poké Ball! {name} se une a tu colección.',
    '¡Registro exitoso! La Pokédex de {name} acaba de activarse.',
    '¡Increíble hallazgo! {name} no volverá a pasar desapercibido.',
  ]))
}

export function captureDuplicateMessage(name) {
  return pickRandom(withName(name, [
    '{name} ya estaba en tu álbum — pero siempre da gusto verlo de nuevo.',
    'Otra vez {name}. Tu equipo favorito nunca pasa de moda.',
    'Registro duplicado: {name} te saluda otra vez como viejo amigo.',
  ]))
}

export function adivinaWinMessage(name, streak) {
  if (streak >= 10) {
    return pickRandom(withName(name, [
      '¡Racha x{streak}! Eres una enciclopedia con patas. Era {name}.',
      '¡{streak} seguidos! El Profesor Oak estaría orgulloso. Era {name}.',
    ])).replace('{streak}', String(streak))
  }
  if (streak >= 5) {
    return pickRandom(withName(name, [
      '¡En racha! x{streak} aciertos. El misterioso era {name}.',
      '¡Caliente! Llevas {streak} seguidos. Era {name}.',
    ])).replace('{streak}', String(streak))
  }
  return pickRandom(withName(name, [
    '¡Ding ding ding! Era {name}. ¡Pokédex actualizada!',
    '¡Lo clavaste! {name} se revela en todo su esplendor.',
    '¡Correcto! {name} no pudo esconderse de ti.',
    '¡Eso es! Tenías razón: era {name}.',
  ]))
}

export function adivinaLoseMessage(name, genus) {
  const hint = genus ? ` Pista: es un ${genus}.` : ''
  return pickRandom(withName(name, [
    `Casi... pero no. Era {name}.${hint}`,
    `¡Nope! El silencio lo confirma: era {name}.${hint}`,
    `Fallaste, pero aprendiste. Era {name}.${hint}`,
    `Ese no era. La respuesta correcta: {name}.${hint}`,
  ]))
}

export function tiposWinMessage(type, streak) {
  return pickRandom([
    `¡Tipo ${type} confirmado! Llevas una racha de ${streak}.`,
    `¡Exacto! Es ${type}. Tu ojo de entrenador es letal.`,
    `¡Bingo! ${type} era la respuesta. x${streak} y contando.`,
    `¡Maestro elemental! ${type} era el tipo correcto.`,
  ])
}

export function tiposLoseMessage(correct, wrong) {
  return pickRandom([
    `Elegiste ${wrong}, pero su esencia es ${correct}. ¡Siguiente!`,
    `${wrong} no encajaba. El tipo real: ${correct}.`,
    `Fallaste el análisis: era ${correct}, no ${wrong}.`,
    `El radar de tipos dice ${correct}. Tú dijiste ${wrong}.`,
  ])
}

export function statsWinMessage(statName, streak) {
  return pickRandom([
    `¡Lectura perfecta en ${statName}! Racha: ${streak}.`,
    `Tu instinto de combate no falla. ${statName} dominado.`,
    `¡Análisis correcto! ${statName} fue la clave. x${streak}.`,
    `¡Victoria táctica! Acertaste en ${statName}.`,
  ])
}

export function statsLoseMessage(nameA, valA, nameB, valB, statName) {
  return pickRandom([
    `${nameA} (${valA}) vs ${nameB} (${valB}) en ${statName}. La suerte cambia.`,
    `El duelo en ${statName} fue ${valA} a ${valB}. Mejor suerte en la revancha.`,
    `Stats reveladas: ${nameA} ${valA}, ${nameB} ${valB}. Analiza y vuelve.`,
  ])
}

export function statsTieMessage(value, statName) {
  return pickRandom([
    `¡Empate técnico en ${statName}! Ambos en ${value}. Cualquiera valía.`,
    `${value} vs ${value} en ${statName}. Un duelo de espejos.`,
    `Tablas en ${statName} con ${value} puntos. ¡Tú lo viste venir!`,
  ])
}

export function memoriaWinMessage(moves) {
  if (moves <= 12) {
    return pickRandom([
      `¡${moves} movimientos! Cerebro de Mewtwo confirmado.`,
      `Solo ${moves} movs. ¿Eres un Psyduck o un Alakazam?`,
    ])
  }
  if (moves <= 20) {
    return pickRandom([
      `¡Tablero limpio en ${moves} movimientos! Memoria de campeón.`,
      `${moves} movs y victoria. Tu concentración es legendaria.`,
    ])
  }
  return pickRandom([
    `¡Lo lograste en ${moves} movimientos! La práctica hace al maestro.`,
    `Victoria en ${moves} movs. Cada pareja cuenta en el álbum.`,
  ])
}

export function memoriaMatchMessage(name) {
  return pickRandom(withName(name, [
    '¡Pareja de {name}! +1 en tu colección.',
    '¡Match! {name} registrado en el álbum.',
    '¡Dos cartas, un Pokémon! {name} capturado.',
  ]))
}

export function apiErrorMessage() {
  return pickRandom([
    'La conexión con la Pokédex falló. Los Pidgey interfieren la señal.',
    'Error de red. El servidor está tomando una siesta tipo Snorlax.',
    'No pudimos contactar la API. Reintenta en unos segundos.',
  ])
}

export function albumEmptyMessage() {
  return pickRandom([
    'Tu álbum está más vacío que la Ruta 1 al amanecer. ¡A explorar!',
    'Cero registros. Cada leyenda empieza con un primer Pokémon.',
  ])
}

export function albumClearConfirm() {
  return pickRandom([
    '¿Vaciar el álbum? Esta acción no tiene Ctrl+Z.',
    '¿Seguro? Perderás toda tu colección local.',
  ])
}
