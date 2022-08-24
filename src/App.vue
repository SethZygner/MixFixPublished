<script setup>
import {RouterLink, RouterView, useRouter} from 'vue-router';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {onMounted, ref} from "vue";
import AOS from "aos";
import fire from '../Firebase.js'

let HasUserInformation = ref(false);

let LocalStorage = window.localStorage;

onMounted(() => {
  AOS.init();
})
const router = useRouter();

let signedIn = ref(false);

onAuthStateChanged(getAuth(),()=>{
  signedIn.value = getAuth().currentUser !== null;
  if(getAuth().currentUser){

  }
});

</script>

<template>

  <div id="Phone-Menu">
    <div class="d-flex align-items-center justify-content-between Phone fixed-top">
      <img src="./assets/Icons/hamburger.png" class="icon-sm ml-3 mt-3 mb-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" alt="">
      <img src="./assets/FinishedLogo.png" class="img-fluid mt-2 mr-3" style="height: 3em;" alt="">
    </div>


    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 id="offcanvasRightLabel">Main Menu</h5>
        <button type="button" class="btn-close text-reset mr-3" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <h6 class="mx-5 mt-4" data-bs-dismiss="offcanvas"> <RouterLink to="/" active-class="active">Home Page</RouterLink></h6>
        <h6 class="mx-5 mt-4" data-bs-dismiss="offcanvas"><RouterLink to="/browseCocktails" active-class="active">Browse</RouterLink></h6>
        <h6 class="mx-5 mt-4" data-bs-dismiss="offcanvas"><RouterLink to="/socialHub" active-class="active">Social Hub</RouterLink></h6>
        <h6 v-if="signedIn" class="mx-5 mt-2"><RouterLink to="/account" data-bs-dismiss="offcanvas" active-class="active">
          <img v-if="fire.HasProfilePicture" @click="router.push('/account')" class="ProfilePicture" :src="fire.UserInformation.GeneralInformation.ProfilePicture" alt="">
          <h6 v-else @click="router.push('/account')">Account</h6>
        </RouterLink></h6>
        <h6 v-else class="mx-5 mt-4" data-bs-dismiss="offcanvas"><RouterLink to="/signIn" active-class="active">Login</RouterLink></h6>
      </div>
    </div>
  </div>




  <div class="container-fluid d-flex  justify-content-between Main-Menu fixed-top" id="Computer-menu">
    <div>
      <img src="./assets/FinishedLogo.png" class="Logo align-middle m-2" alt="">
    </div>

    <div class="Menu-Items p-1 d-inline-flex">
      <h6 class="mx-5 mt-4"> <RouterLink to="/" active-class="active">Home Page</RouterLink></h6>
      <h6 class="mx-5 mt-4"><RouterLink to="/browseCocktails" active-class="active">Browse</RouterLink></h6>
      <h6 class="mx-5 mt-4"><RouterLink to="/socialHub" active-class="active">Social Hub</RouterLink></h6>
      <h6 v-if="signedIn" class="mx-5 mt-2"><RouterLink to="/account" active-class="active">
        <img v-if="fire.HasProfilePicture" class="ProfilePicture" :src="fire.UserInformation.GeneralInformation.ProfilePicture" alt="">
        <h6 v-else>Account</h6>
      </RouterLink></h6>
      <h6 v-else class="mx-5 mt-4"><RouterLink to="/signIn" active-class="active">Login</RouterLink></h6>
    </div>

  </div>


<div id="View">
  <RouterView />
</div>


</template>





<style>

.Main-Menu{
  background: #F3F3F3;
  height: 5em;
  box-sizing: border-box;
}

#Phone-Menu{
  display: none;
}

.Logo{
  max-height: 80%;
}

.ProfilePicture{
  width: 3em;
  aspect-ratio: 1/1;
  border-radius: 50%;
  margin-top: 0;
  object-fit: cover !important;
}

.active{
  text-decoration: underline !important;
  color: black;
}

a{
  text-decoration: none !important;
  color: black !important;
}

#View{
  margin-top: 6em;
}

@media screen and (max-width: 912px){
  #Computer-menu{
    display: none !important;
  }

  #Phone-Menu{
    display: contents !important;
  }

  .Phone{
    background: #F3F3F3;
    height: 5em;
    box-sizing: border-box;
  }


  #offcanvasRight{
    max-width: 80%;
  }

}


</style>
