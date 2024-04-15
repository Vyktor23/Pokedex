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
</script>

<template>
	<div id="contenidoMain">
		<section class="buscador">
			<!-- buscador -->
			<input type="text" placeholder="Número o nombre del Pokémon..." v-model="buscador" id="texto" />
			<button @click="buscar()">Consultar</button>
			<button @click="random()">Impresióname</button>
		</section>

		<section class="justify-center card">
			<!-- tarjeta -->
			<div class="parte1">
				<div v-if="pokemon.id">
					ID:
					{{ pokemon.id }}
				</div>
				<div>
					{{ pokemon.name }}
				</div>
				<img :src="pokemon.sprites.other['official-artwork'].front_default" alt="" v-if="pokemon.sprites" class="imagen_principal" />
				<div>
					<img :src="pokemon.sprites.other.showdown.front_default" alt="" v-if="pokemon.sprites" />
					<img :src="pokemon.sprites.other.showdown.back_default" alt="" v-if="pokemon.sprites" />
				</div>
			</div>

			<div class="parte2">
				<section id="sub2">
					<div v-for="(e, i) in pokemon.types" :key="i">
						{{ e.type.name }}
					</div>
					<div v-if="pokemon.base_experience">
						Exp. Base:
						{{ pokemon.base_experience }}
					</div>
					<div v-if="pokemon.height">
						Height:
						{{ pokemon.height }}
					</div>
					<div v-if="pokemon.weight">
						Weight:
						{{ pokemon.weight }}
					</div>
				</section>
				<section class="linear-progress-section" id="subb2">
					<!-- Sección de barras de progreso -->
					<div class="linear-progress" v-for="(e, i) in pokemon.stats" :key="i">
						<label :for="'ID' + i" rounded size="14px" color="purple" class="stat-name text-xs font-semibold text-black">
							{{ e.stat.name }}
						</label>
						<q-linear-progress :id="'ID${i}' + i" :value="Number(`0.${e.base_stat}`)" :buffer="Number(`0.${e.base_stat + 10}`)" rounded size="25px" color="blue">
							<div class="absolute-full flex flex-center">
								<q-badge color="white" text-color="accent" :label="e.base_stat" />
							</div>
						</q-linear-progress>
					</div>
				</section>
			</div>
		</section>
	</div>
</template>

<style scoped>
#contenidoMain {
	display: flex;
	align-items: center;
}

.pokedex-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: white;
}

.buscador {
	text-align: center;
	padding: 10px;
	display: flex;
	flex-direction: row;
	gap: 15px;
	position: absolute;
	top: 90px;
}

#texto {
	width: 240px;
}

.imagen_principal {
	width: 250px;
	height: 250px;
}

.card {
	background-color: white;
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 87.7vh;
	color: black;
	gap: 30px;
	text-align: center;
}

.parte1 {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

.parte2 {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	gap: 20px;
}

#sub2 {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

#subb2 {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

/* .parte1 {
	height: 30%;
	width: 20%;
	font-size: 15px;
	position: absolute;
	top: 13rem;
	left: 22rem;
}

.parte2 {
	width: 30%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.parte2 div {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.parte2 div img {
	height: 60px;
}

.parte3 {border: 1px solid green;
	width: 20%;
	height: 70%;
}

.parte4 {
	width: 20%;
	height: 70%;
}

.parte4 section div {
	width: 0px;
	height: 10px;
	display: flex;
	gap: 30px;
} */

.search-section {
	display: grid;
	gap: 15px;
	margin-bottom: 50px;
	margin-top: 30px;
	font-size: 18px;
}

.stats-section {
	margin-top: 10px;
}

.stat-name {
	color: #333;
	font-size: 18px;
}

.linear-progress {
	margin-bottom: 10px;
}

.bg-gradient {
	background: linear-gradient(to right, #673ab7, #2196f3);
}

.linear-progress {
	text-align: center;
}
</style>
