import Adivina from "../components/adivina.vue";
import Pokedex from "../components/pokedex.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
	{ path: "/", component: Pokedex },
	{ path: "/adivina", component: Adivina },
];

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
