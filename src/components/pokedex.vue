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
	  <section class="buscador">
		<!-- buscador -->
		<input type="text" placeholder="Número o nombre del Pokémon..." v-model="buscador" id="texto" />
		<button @click="buscar()">Consultar</button>
		<button @click="random()">Impresióname</button>
	  </section>
  
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
	</div>
  </template>

<style scoped>
#contenidoMain {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -100px;
}

.buscador {
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
}


.pokemon-id {
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: bold;
}

.pokemon-name {
  font-size: 26px;
  font-weight: bold;
  color: #333;
}

#texto {
  width: 240px;
}

.card {
  background-color: white;
  display: flex;
  flex-direction: row;
  width: 80%;
  height: 100%;
  margin-top: 20px;
  padding: 30px;
  border-radius: 70px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  color: black;
  font-size: 16px;
}

.parte1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.parte1 .info-label {
  font-weight: bold;
}

.parte1 .imagen_principal {
  width: 250px;
  height: 250px;
  margin-top: 20px;
}

.sprites-container {
  display: flex;
  gap: 80px;
  margin-top: 40px;
}

.parte2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.parte2 .info-label {
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 10px;
}


.value {
  margin-left: 5px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 16px;
  background-color: rgb(126, 192, 212);
}

.type {
  margin-left: 5px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 16px;
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
  margin-top: 40px;
}

.progress-bar-container {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 6px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
}
</style>
