
<script setup>
import router from '../router'
import fire from '../../Firebase.js';
import {useRoute} from "vue-router/dist/vue-router.mjs";
import {reactive} from "vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const UserID = useRoute().params.id;
let UserInformation;

onAuthStateChanged(getAuth(), ()=>{
  if(getAuth().currentUser.uid){
    let currentUser = getAuth().currentUser.uid;
    if(currentUser !== UserID){
      router.push('/account');
    }
  }
})

function GetUserInformation(){

    fire.FirestoreDB()
        .collection("Mixers")
        .doc(UserID.toString())
        .get()
        .then((result)=>{
          UserInformation = result.data();
        })
}

GetUserInformation();



</script>



<template>






</template>



<style scoped>

</style>
