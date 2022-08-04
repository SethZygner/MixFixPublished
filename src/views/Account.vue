<script setup>
import fire from '../../Firebase.js';
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebase from "firebase/compat";

window.scrollTo(0, 0);



</script>


<template>
  <div class="container-fluid">
    <div class="row row-cols-md-3 row-cols-sm-2 row-cols-1 justify-content-evenly " style="border: 1px black solid;">


      <div class="col-sm-5 col-md-2 text-center p-2 Account-Web-Column">


        <div class="container-fluid d-flex p-0 my-3" style="width: 80%; aspect-ratio: 1/1; border-radius: 50%; border: 1px black solid; overflow: hidden">

        </div>

        <h2>Name</h2>

        <p>Following: 0</p>
        <p>Followers: 0</p>
        <p>Mixes: 0</p>
        <p>Posts: 0</p>
        <i>"This will be the test bio that is used for this example!"</i>
        <button class="btn btn-outline-dark m-2">Log Out</button>

      </div>





      <div class="col-sm-12 col-md-4" style="border: 1px black solid;">

      </div>




      <div class="col-md-5" style="border: 1px black solid;">

      </div>

    </div>
  </div>


</template>






<style scoped>

.Account-Web-Column{
  height: 100%;
  border: 1px black solid;
}


</style>
