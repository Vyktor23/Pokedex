<script setup>
import { ref } from "vue";
import axios from "axios";

let pokemon = ref([]);
let buscador = ref("");

function random() {
    let numero = Math.floor(Math.random() * 1025) + 1;
    traer(numero);
}

function buscar() {
    traer(buscador.value);
}

async function traer(numero) {
    try {
        let r = await axios.get("https://pokeapi.co/api/v2/pokemon/" + numero);
        pokemon.value = r.data;
        console.log(r.data);
    } catch (error) {
        console.log(error);
    }
}

// Función para obtener la clase de color asociada a cada tipo de Pokémon
function getTypeClass(type) {
    switch (type) {
        case 'normal':
            return 'type-normal';
        case 'fire':
            return 'type-fire';
        case 'water':
            return 'type-water';
        case 'electric':
            return 'type-electric';
        case 'grass':
            return 'type-grass';
        case 'ice':
            return 'type-ice';
        case 'fighting':
            return 'type-fighting';
        case 'poison':
            return 'type-poison';
        case 'ground':
            return 'type-ground';
        case 'flying':
            return 'type-flying';
        case 'psychic':
            return 'type-psychic';
        case 'bug':
            return 'type-bug';
        case 'rock':
            return 'type-rock';
        case 'ghost':
            return 'type-ghost';
        case 'dragon':
            return 'type-dragon';
        case 'dark':
            return 'type-dark';
        case 'steel':
            return 'type-steel';
        case 'fairy':
            return 'type-fairy';
        default:
            return 'type-default';
    }
}
</script>

<template>
	<div id="contenidoMain">
  
	  <section class="card">
		<!-- tarjeta -->
		<div class="parte1">
		  <div class="pokemon-id" v-if="pokemon.id">
			<span class="info-label">ID:</span>
			<span>{{ pokemon.id }}</span>
		  </div>
		  <div class="pokemon-name">
			{{ pokemon.name }}
		  </div>
		  <img :src="pokemon.sprites.other['official-artwork'].front_default" alt="" v-if="pokemon.sprites" class="imagen_principal" />
		  <div class="sprites-container">
			<img :src="pokemon.sprites.other.showdown.front_default" alt="" v-if="pokemon.sprites" />
			<img :src="pokemon.sprites.other.showdown.back_default" alt="" v-if="pokemon.sprites" />
		  </div>
		</div>
  
		<div class="parte2">
		  <section id="sub2">
			<div v-for="(e, i) in pokemon.types" :key="i">
			  <span class="info-label">Type:</span>
			  <span class="type" :class="getTypeClass(e.type.name)">{{ e.type.name }}</span>
			</div>
			<div v-if="pokemon.base_experience">
			  <span class="info-label">Exp. Base:</span>
			  <span class="value">{{ pokemon.base_experience }}</span>
			</div>
			<div v-if="pokemon.height">
			  <span class="info-label">Height:</span>
			  <span class="value">{{ pokemon.height }}</span>
			</div>
			<div v-if="pokemon.weight">
			  <span class="info-label">Weight:</span>
			  <span class="value">{{ pokemon.weight }}</span>
			</div>
		  </section>
		  <section class="linear-progress-section" id="subb2">
			<!-- Sección de barras de progreso -->
			<div class="linear-progress" v-for="(e, i) in pokemon.stats" :key="i">
			  <label class="stat-name">{{ e.stat.name }}:</label>
			  <div class="progress-bar-container">
				<div class="progress-bar" :style="{ width: `${e.base_stat / 1}px` }">{{ e.base_stat }}</div>
			  </div>
			</div>
		  </section>
		</div>
	  </section>
    <section class="buscador">
      <!-- buscador -->
      <input type="text" placeholder="Número o nombre del Pokémon..." v-model="buscador" id="texto" />
      <button @click="buscar()">Consultar</button>
      <button @click="random()">Impresióname</button>
      </section>
	</div>
  </template>

<style scoped>
/* Estilos base */
html, body {
  background-color: white; /* Fondo blanco para toda la página */
  margin: 0;
  font-family: Arial, sans-serif;
  height: 100%; /* Asegura que el body ocupe toda la altura de la ventana */
}

#contenidoMain {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 60px;
  background-color: white; /* Fondo blanco para el contenedor principal */
}

.buscador {
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 600px;
  margin-top: 20px; /* Espacio superior para separarlo de otros contenidos */
}

#texto {
  width: 100%;
  max-width: 240px;
  padding: 10px;
  border: 2px solid #4caf50;
  border-radius: 5px;
  font-size: 16px;
}

.buscador button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buscador button:first-of-type {
  background-color: #4caf50;
}

.buscador button:last-of-type {
  background-color: #f44336;
}

.buscador button:hover {
  background-color: #333;
}

.buscador button:nth-child(2):hover {
  background-color: #d32f2f;
}

.card {
  background-color: white; /* Fondo blanco para la tarjeta */
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px; /* Reducido de 600px a 500px */
  margin-top: 20px;
  padding: 15px; /* Reducido de 20px a 15px */
  border-radius: 15px; /* Reducido de 20px a 15px */
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1); /* Reducido de 10px a 8px */
  color: black;
}

.parte1,
.parte2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
}

.pokemon-id {
  margin-bottom: 5px;
  font-size: 18px; /* Reducido de 20px a 18px */
  font-weight: bold;
}

.pokemon-name {
  font-size: 22px; /* Reducido de 26px a 22px */
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}

.parte1 .info-label,
.parte2 .info-label {
  font-weight: bold;
}

.parte1 .imagen_principal {
  width: 100%;
  max-width: 200px; /* Reducido de 250px a 200px */
  height: auto;
  margin-top: 15px; /* Reducido de 20px a 15px */
}

.sprites-container {
  display: flex;
  gap: 8px; /* Reducido de 10px a 8px */
  margin-top: 15px; /* Reducido de 20px a 15px */
}

.sprites-container img {
  width: 40px; /* Reducido de 50px a 40px */
  height: 40px; /* Reducido de 50px a 40px */
}

.value,
.type {
  margin-left: 5px;
  padding: 3px 6px; /* Reducido de 3px 8px a 3px 6px */
  border-radius: 8px; /* Reducido de 10px a 8px */
  font-size: 14px; /* Reducido de 16px a 14px */
}

.type-normal { background-color: #A8A878; }
.type-fire { background-color: #F08030; }
.type-water { background-color: #6890F0; }
.type-electric { background-color: #F8D030; }
.type-grass { background-color: #78C850; }
.type-ice { background-color: #98D8D8; }
.type-fighting { background-color: #C03028; }
.type-poison { background-color: #A040A0; }
.type-ground { background-color: #E0C068; }
.type-flying { background-color: #A890F0; }
.type-psychic { background-color: #F85888; }
.type-bug { background-color: #A8B820; }
.type-rock { background-color: #B8A038; }
.type-ghost { background-color: #705898; }
.type-dragon { background-color: #7038F8; }
.type-dark { background-color: #705848; }
.type-steel { background-color: #B8B8D0; }
.type-fairy { background-color: #EE99AC; }

.linear-progress-section {
  width: 100%;
  margin-top: 15px; /* Reducido de 20px a 15px */
}

.progress-bar-container {
  width: 100%;
  height: 18px; /* Reducido de 20px a 18px */
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 6px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
}

/* Estilos para pantallas menores de 600px */
@media (max-width: 599px) {
  #contenidoMain {
    padding: 10px;
  }

  .buscador {
    padding: 5px;
    flex-direction: column;
    gap: 10px;
  }

  #texto {
    max-width: 100%;
    font-size: 14px;
  }

  .buscador button {
    padding: 8px 16px;
    font-size: 14px;
  }

  .card {
    padding: 12px; /* Reducido de 15px a 12px */
    margin-top: 10px;
  }

  .parte1,
  .parte2 {
    flex-direction: column;
    align-items: center;
  }

  .sprites-container {
    flex-direction: column;
    align-items: center;
  }

  .sprites-container img {
    width: 30px; /* Reducido de 40px a 30px */
    height: 30px; /* Reducido de 40px a 30px */
  }

  .pokemon-id,
  .pokemon-name {
    font-size: 16px; /* Reducido de 18px a 16px */
  }

  .value,
  .type {
    font-size: 12px; /* Reducido de 14px a 12px */
  }
}
</style>
