<script setup>
import { ref } from "vue";
import axios from "axios";

let pokemon = ref([]);
let respuesta = ref("");
let imagenColor = ref("gris");

(async function traer() {
	try {
        let numero = Math.floor(Math.random() * 1025) + 1;
		let r = await axios.get("https://pokeapi.co/api/v2/pokemon/" + numero);
		pokemon.value = r.data;
		console.log(r.data);
	} catch (error) {
		console.log(error);
	}
})()

function revisar() {
	if (respuesta.value.toLowerCase() == pokemon.value.name) {
		alert('Todo bien');
		imagenColor.value = 'clara';
	} else {
		alert('Parece que no era')
	}
}
</script>

<template>
    <div id="contenidoMain">
        <section class="justify-center card">
			<!-- tarjeta -->

			<!-- <div class="parte1">
				<div v-if="pokemon.id">
					ID:
					{{ pokemon.id }}
				</div>
				<div>
					{{ pokemon.name }}
				</div>
			</div> -->

			<div class="parte2">
				<img :src="pokemon.sprites.other['official-artwork'].front_default" alt="" v-if="pokemon.sprites" class="imagen_principal" :style="{ filter: imagenColor === 'gris' ? 'contrast(1%)' : '' }" />
				<div v-for="(e, i) in pokemon.types" :key="i">
					{{ e.type.name }}
				</div>
				<!-- <div v-if="pokemon.base_experience">
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
				</div> -->
			</div>

			<div class="parte3">
				<section class="linear-progress-section">
					<!-- Sección de barras de progreso -->
					<div class="linear-progress">
						<label rounded size="14px" color="purple" class="stat-name text-xs font-semibold text-black">
							{{ pokemon.stats[0].stat.name }}
							<q-linear-progress :id="'ID${i}' + i" :value="Number(`0.${pokemon.stats[0].base_stat}`)" :buffer="Number(`0.${pokemon.stats[0].base_stat + 10}`)" rounded size="25px" color="blue">
								<div class="absolute-full flex flex-center">
									<q-badge color="white" text-color="accent" :label="pokemon.stats[0].base_stat" />
								</div>
							</q-linear-progress>
						</label>
						<label rounded size="14px" color="purple" class="stat-name text-xs font-semibold text-black">
							{{ pokemon.stats[1].stat.name }}
							<q-linear-progress :id="'ID${i}' + i" :value="Number(`0.${pokemon.stats[1].base_stat}`)" :buffer="Number(`0.${pokemon.stats[1].base_stat + 10}`)" rounded size="25px" color="blue">
								<div class="absolute-full flex flex-center">
									<q-badge color="white" text-color="accent" :label="pokemon.stats[1].base_stat" />
								</div>
							</q-linear-progress>
						</label>
						<label rounded size="14px" color="purple" class="stat-name text-xs font-semibold text-black">
							{{ pokemon.stats[2].stat.name }}
							<q-linear-progress :id="'ID${i}' + i" :value="Number(`0.${pokemon.stats[2].base_stat}`)" :buffer="Number(`0.${pokemon.stats[2].base_stat + 10}`)" rounded size="25px" color="blue">
								<div class="absolute-full flex flex-center">
									<q-badge color="white" text-color="accent" :label="pokemon.stats[2].base_stat" />
								</div>
							</q-linear-progress>
						</label>
					</div>
				</section>
			</div>
			
        </section>
		<div id="respuestaAqui">
			<input type="text" v-model="respuesta">
			<button @click="revisar()">Responder</button>
		</div>
		
    </div>
</template>

<style scoped>
#respuestaAqui {
	position: absolute;
	top: 85vh;
	left: 50%;
	transform: translate(-50%, -50%);
}

#contenidoMain {
	height: 100%;
}

.pokedex-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: white;
}

.imagen_principal {
	width: 250px;
	height: 250px;
}

.card {
	background-color: white;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	color: black;
	gap: 30px;
	text-align: center;
}

.parte3 {
	width: 20rem;
}

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

.q-page-container {
	flex: 1;
}
</style>