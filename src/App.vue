<script setup>
import {RouterLink, RouterView, useRouter} from 'vue-router';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {onMounted, reactive, ref} from "vue";
import AOS from "aos";


onMounted(() => {
  AOS.init();
})

const router = useRouter();

let signedIn = ref(false);



onAuthStateChanged(getAuth(),()=>{
  signedIn.value = getAuth().currentUser !== null;
});




</script>

<template>

  <div id="Main-Menu" class="container-fluid d-flex justify-content-between fixed-top" >
    <img class="img-fluid m-2" src="./assets/mixerfixer.png" data-aos="fade-right" alt="">


    <img alt="" src="./assets/Icons/whiteHamburger.jpg" class="img-fluid hamburger" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />


    <div id="Menu" class="d-flex align-items-center text-center justify-content-between" data-aos="fade-left" style="margin-right: 4em; color: white;">
      <h6 class="mx-3" @click="router.push('/')">HOME</h6>
      <h6 class="mx-3" @click="router.push('/browseCocktails')">BROWSE MIXES</h6>
<!--      <h6 class="mx-3">SOCIAL HUB</h6>-->
<!--      <h6 v-if="signedIn" class="mx-3">ACCOUNT</h6>-->
<!--      <h6 v-else class="mx-3">SIGN IN</h6>-->
    </div>
  </div>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header">
      <h5 id="offcanvasRightLabel">Menu</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"  @click="router.push('/')">Home</button>
      <br>
      <button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" @click="router.push('/browseCocktails')">Browse</button>
    </div>
  </div>




<div id="View">
  <RouterView />
</div>


</template>





<style>

#Main-Menu{
  background-color: rgba(0, 0, 0, .4);
  height: 6em;
}

#View{
  margin-top: 6em;
  overflow-y: hidden;
}

.hamburger{
  display: none;
}

@media screen and (min-width: 0) and (max-width: 992px){
  .hamburger{
    display: block;
    padding: 1.5em;
  }

  #offcanvasRight{
    max-width: 80%;
  }

  #Menu{
    display: none !important;
  }
}

</style>
