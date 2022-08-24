import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import sigIn from '../views/signIn.vue'
import SocialHub from '../views/SocialHub.vue';
import UserAccount from '../views/Account.vue';
import CreateDrink from '../views/CreateNewDrink.vue';
import Browse from '../views/Browse.vue';
import Mixer from '../views/Mixer.vue';
import {getAuth, onAuthStateChanged} from "firebase/auth";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signIn',
      name: 'SignIn',
      component: sigIn
    },
    {
      path: '/browseCocktails',
      name: 'browseCocktails',
      component: Browse
    },
    {
      path: '/socialHub',
      name: 'socialHub',
      component: SocialHub
    },
    {
      path: '/account',
      name: 'account',
      component: UserAccount
    },
    {
      path: '/createDrink',
      name: 'createDrink',
      component: CreateDrink
    },
    {
      path: '/Mixer/:id',
      name: 'Mixer',
      component: Mixer
    }
  ]


})

export default router
