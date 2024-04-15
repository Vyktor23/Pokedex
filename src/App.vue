<script setup></script>

<template>
	<div class="pokedex-container">
		<!-- Encabezado -->
		<q-layout view="hHh lpR fFf">
			<q-header bordered class="bg-gradient text-white">
				<q-toolbar>
					<q-toolbar-title class="font-bold text-3xl">
						<q-avatar>
							<img src="https://th.bing.com/th/id/OIP.lWzIJdxoji12EX_MwqP1MAHaHw?w=199&h=208&c=7&r=0&o=5&cb=11&pid=1.7" />
						</q-avatar>
						Pokédex
					</q-toolbar-title>
					<router-link to="/" class="boton" id="pokedexx">Pokedex</router-link><br />
					<router-link to="/adivina" class="boton"> Adivinar Pokemón </router-link>
				</q-toolbar>
			</q-header>
			<q-page-container>
				<!-- contenedor -->
				<router-view></router-view>
			</q-page-container>
		</q-layout>
	</div>
</template>

<style scoped>
#pokedexx {
	margin-right: 20px;
}

.q-header {
	height: 80px;
	padding: 10px;
	text-align: center;
}

.q-page-container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.boton {
	display: inline-block;
	margin: 10px 0;
	padding: 10px 20px;
	background-color: #2196f3;
	color: white;
	text-decoration: none;
	border-radius: 5px;
	transition: background-color 0.3s ease;
}

.boton:hover {
	background-color: #0d47a1;
}
</style>
