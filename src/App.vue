<script setup>
import { ref } from "vue"
import axios from "axios"

let pokemon = ref([])
let buscador = ref("")

async function traer() {
  try {
    let r = await axios.get("https://pokeapi.co/api/v2/pokemon/" + buscador.value)
    pokemon.value = r.data
    console.log(r.data);
  } catch (error) {
    console.log(error);
  }
}

const progressValue = (baseStat) => `0.${baseStat}`
const bufferValue = (baseStat) => `0.${baseStat + 10}`
</script>



<template>
  <div class="pokedex-container">
    <!-- Encabezado -->
    <q-layout view="hHh lpR fFf">
      <q-header bordered class="bg-gradient text-white">
        <q-toolbar>
          <q-toolbar-title class="font-bold text-3xl">
            <q-avatar>
              <img src="https://th.bing.com/th/id/OIP.lWzIJdxoji12EX_MwqP1MAHaHw?w=199&h=208&c=7&r=0&o=5&cb=11&pid=1.7">
            </q-avatar>
            Pokédex
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container> <!-- contenedor -->
        <section class="search-section flex justify-center items-center"> <!-- buscador -->
          <input type="text" placeholder="Número o nombre del Pokémon..." v-model="buscador"
            class="py-2 px-4 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 w-80">
          <button @click="traer()"
            class="ml-4 py-2 px-6 bg-primary text-white font-semibold rounded-lg shadow-md">Consultar</button>
        </section>

        <section class="card"> <!-- tarjeta -->

          <section class="parte1">
            <h4 v-if="pokemon.id" class="text-lg font-semibold text-black">Nro.{{ pokemon.id }}</h4>
            <h4 class="text-2xl font-bold text-black">{{ pokemon.name }}</h4>
          </section>

          <section class="parte2">
            <img :src="pokemon.sprites.other['official-artwork'].front_default" alt="" v-if="pokemon.sprites" class="imagen_principal">
            <img :src="pokemon.sprites.other.showdown.front_default" alt="" v-if="pokemon.sprites">
            <img :src="pokemon.sprites.other.showdown.back_default" alt="" v-if="pokemon.sprites">
            <h4 v-for="(e, i) in pokemon.types" :key="i" class="text-sm font-medium text-gray-800">{{ e.type.name }}
            </h4>
            <h4 v-if="pokemon.base_experience" class="text-sm font-medium text-gray-800">Exp. Base: {{
            pokemon.base_experience }}</h4>
            <h4 v-if="pokemon.height" class="text-sm font-medium text-gray-800">Altura: {{ pokemon.height }}</h4>
            <h4 v-if="pokemon.weight" class="text-sm font-medium text-gray-800">Peso: {{ pokemon.weight }}</h4>
          </section>

          <section class="parte3">
            <section class="linear-progress-section"> <!-- Sección de barras de progreso -->
              <div class="linear-progress" v-for="(e, i) in pokemon.stats" :key="i">
                <label :for="'ID' + i" class="stat-name text-xs font-semibold text-black">{{ e.stat.name }}</label>
                <q-linear-progress :id="'ID${i}' + i" :value="Number(`0.${e.base_stat}`)"
                  :buffer="Number(`0.${e.base_stat + 10}`)" rounded size="10px" color="blue">
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="accent" :label="e.base_stat" />
                  </div>
                </q-linear-progress>
              </div>
            </section>
          </section>

        </section>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>


<style scoped>
.pokedex-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.imagen_principal{
  width: 300px;
  height: 300px;
}

.card {
  background-color: #f9fafb;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: black;
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
  background: linear-gradient(to right, #673AB7, #2196F3);
}

.linear-progress{
  text-align: left;
}
.q-header {
  height: 80px;
  padding: 10px;
  text-align: center;
}
</style>