<script setup>
import { RouterLink, RouterView } from 'vue-router';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {reactive, ref} from "vue";

let signedIn = ref(false);


onAuthStateChanged(getAuth(),()=>{
  signedIn.value = getAuth().currentUser !== null;
});




</script>

<template>

<!--Web View-->
  <div class="fixed-top justify-content-center" id="Navigation-Web-View">
    <div class="nav justify-content-center mx-auto d-flex" style="align-items: center">
      <div class="nav-item m-4"><RouterLink to="/">Home</RouterLink></div>
      <div class="nav-item m-4"><RouterLink to="/browseCocktails">Browse</RouterLink></div>
      <div class="navbar-brand">
        <img src="./assets/mixerfixer.png" class="m-2" height="80" alt="">
      </div>
<!--      <div class="nav-item mx-4"><RouterLink to="/socialHub">Social</RouterLink></div>-->
<!--      <div class="nav-item m-4">-->
<!--        <RouterLink v-if="signedIn" to="/account">Account</RouterLink>-->
<!--        <RouterLink v-else to="/signIn">Sign In</RouterLink>-->
<!--      </div>-->
    </div>
  </div>


<!--Phone View-->
  <div id="Navigation-Phone-View">
    <div class="fixed-top d-flex justify-content-between" id="Phone-Nav-Button">
      <a href="#offcanvasRight" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
        <img class="m-1" src="./assets/Icons/whiteHamburger.jpg" alt="" height="55">
      </a>
      <img  src="./assets/mixerfixer.png" class="mt-2 mx-4" style="margin-bottom: -1em" height="60" alt="">
    </div>


    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h4 class="offcanvas-title"  id="offcanvasRightLabel">Menu</h4>
        <button type="button" style="width: fit-content; height: fit-content" class="btn-close p-4 m-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <RouterLink to="/"><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Home</button></RouterLink>
        <br>
        <RouterLink to="/browseCocktails"><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Browse</button></RouterLink>
        <br>
<!--        <RouterLink to="/socialHub"><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Social</button></RouterLink>-->
<!--        <br>-->
<!--        <div>-->
<!--          <RouterLink v-if="signedIn" to="/account"><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Account</button></RouterLink>-->
<!--          <RouterLink v-else to="/signIn"><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Sign In</button></RouterLink>-->
<!--        </div>-->
      </div>
    </div>
  </div>


<div class="view">
  <RouterView />
</div>


</template>





<style>

#Navigation-Phone-View{
  display: none;
}

#Navigation-Web-View a{
  text-decoration: none;
  color: white;
}

#Navigation-Web-View{
  background: rgba(0, 0, 0, .7);
  height: auto;
  box-sizing: border-box;
}

.nav-item{
  color: white;
}

@media screen and (max-width: 570px){
  #Navigation-Phone-View{
    display: contents;
  }

  #Navigation-Web-View{
    display: none;
  }

  #Phone-Nav-Button{
    background-color: rgba(0, 0, 0, .7);
  }

  .offcanvas{
    max-width: 19em !important;
    text-align: center !important;
  }

  .offcanvas a{
    text-decoration: none;

  }

  .offcanvas button{
    width: 60%;
    margin-top: 1em;
    height: 4em;

  }

}


</style>
