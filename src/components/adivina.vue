<template>
  <div id="contenidoMain">
    <q-card class="pokemon-card">
      <div class="q-card-section">
        <img :src="pokemon.sprites.other['official-artwork'].front_default" alt="" v-if="pokemon.sprites" class="imagen_principal" :style="{ filter: imagenColor === 'gris' ? 'contrast(1%)' : '' }" />
        <div class="pokemon-type-container">
          <div v-for="(e, i) in pokemon.types" :key="i" class="pokemon-type" :class="e.type.name">
            {{ e.type.name }}
          </div>
        </div>
      </div>

      <div class="q-card-section">
        <div class="pokemon-info">
          <div class="info-item">
            <span class="info-label">Altura:</span>
            <span>{{ pokemon.height }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Peso:</span>
            <span>{{ pokemon.weight }}</span>
          </div>
		  <div class="info-item" v-if="pokemon.id">
            <span class="info-label">Hp:</span>
            <span>{{ pokemon.stats[0].base_stat}}</span>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Sección para ingresar respuesta -->
    <div id="respuestaAqui">
      <q-input v-model="respuesta" @keyup.enter="revisar" placeholder="Nombre del Pokémon" />
      <q-btn color="primary" @click="revisar">Responder</q-btn>
    </div>

    <!-- Diálogo para mostrar mensajes de respuesta -->
    <q-dialog v-model="dialogVisible">
      <q-card class="dialog-card">
        <q-card-section class="text-center">
          <q-card-title class="dialog-title">{{ mensajeTitulo }}</q-card-title>
          <q-card-text class="dialog-text">{{ mensajeTexto }}</q-card-text>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn color="primary" label="Aceptar" @click="dialogVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

let pokemon = ref([]);
let respuesta = ref("");
let imagenColor = ref("gris");
let dialogVisible = ref(false);
let mensajeTitulo = ref("");
let mensajeTexto = ref("");

(async function traer() {
    try {
        let numero = Math.floor(Math.random() * 1025) + 1;
        let r = await axios.get("https://pokeapi.co/api/v2/pokemon/" + numero);
        pokemon.value = r.data;
        console.log(r.data);
    } catch (error) {
        console.log(error);
    }
})();

function revisar() {
    if (respuesta.value.toLowerCase() == pokemon.value.name) {
        imagenColor.value = 'clara';
        dialogVisible.value = true;
        mensajeTitulo.value = '¡Excelente acertaste, felicidades!';
        mensajeTexto.value = '';
    } else {
        dialogVisible.value = true;
        mensajeTitulo.value = 'Parece que no era, vuelve a intentarlo.';
    }
}
</script>

<style scoped>

.pokemon-info {
  padding: 10px;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.info-item {
  margin-bottom: 8px;
  padding: 5px 10px;
  background-color:darkkhaki;
}


.info-item{
    margin: 0 5px;
    padding: 5px 10px;
    border-radius: 40px;
    font-weight: bold;
}


#contenidoMain {
  height: 100%;
  background-color: white;
}

.pokemon-card {
  max-width: 800px;
  max-height: 8000px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
  font-size: 18px;
}

.pokemon-type-container {
  display: flex;
  justify-content: center;
}

.pokemon-type {
  margin: 0 5px;
  padding: 5px 10px;
  border-radius: 40px;
  font-weight: bold;
}

.normal { background-color: #A8A878; }
.fire { background-color: #F08030; }
.water { background-color: #6890F0; }
.electric { background-color: #F8D030; }
.grass { background-color: #78C850; }
.ice { background-color: #98D8D8; }
.fighting { background-color: #C03028; }
.poison { background-color: #A040A0; }
.ground { background-color: #E0C068; }
.flying { background-color: #A890F0; }
.psychic { background-color: #F85888; }
.bug { background-color: #A8B820; }
.rock { background-color: #B8A038; }
.ghost { background-color: #705898; }
.dragon { background-color: #7038F8; }
.dark { background-color: #705848; }
.steel { background-color: #B8B8D0; }
.fairy { background-color: #EE99AC; }

.imagen_principal {
  width: 300px;
  height: 300px;
  margin-left: 280px;
}

.pokemon-info {
  margin-top: 20px;
  color: black;
}

.info-item {
  margin-bottom: 10px;
  display: flex;
  color: black;
}

.info-label {
  font-weight: bold;
  color: black;
}

#respuestaAqui {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.dialog-card {
  max-width: 300px;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.dialog-title {
  font-size: 18px;
  color: #333;
}

.dialog-text {
  font-size: 16px;
  color: #666;
}
</style>
