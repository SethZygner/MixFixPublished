<script setup>


  import fire from '../../Firebase.js'; //Firebase import
  import {getAuth, onAuthStateChanged} from "firebase/auth"; //Authentication import
  import {onValue, ref as fireRef, set} from "firebase/database"; //Firebase Database import
  import firebase from "firebase/compat";
  import DrinkCard from "../Slots/DrinkCard.vue";
  import {reactive, ref} from "vue"; //Reactive and Ref import
  import {useRouter} from "vue-router"; //Router import to switch between routes


  let ListOfUserMixes = reactive([]);

  let router = useRouter();

  function getPublicMixes(){

  }



</script>






<template>

<div class="container-fluid">


  <div class="row mx-auto justify-content-evenly">

    <div class="col-md-6 col-12 text-center" style="border: 1px black solid;">
      <div class="mb-2">
        <button class="btn btn-outline-dark m-3" @click="router.push('/createDrink')">Create A New Drink</button>
      </div>

      <div class="row row-cols-2 row-cols-md-3 g-2 p-3 justify-content-between">
        <div><DrinkCard /></div>
        <div><DrinkCard /></div>
        <div><DrinkCard /></div>
      </div>

    </div>


    <div class="col-md-5" style="border: 1px black solid;">

    </div>


  </div>



</div>


</template>






<style scoped >




</style>
