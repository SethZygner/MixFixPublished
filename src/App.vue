<script setup>
import { RouterLink, RouterView } from 'vue-router';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {reactive, ref} from "vue";

let signedIn = ref(false);


onAuthStateChanged(getAuth(),()=>{
  signedIn.value = getAuth().currentUser !== null;
});


let sideMenu = ref(false);


</script>

<template>
  <div id="desktopView">
    <div id="nav-menu">
      <ul id="menu_items">
        <li style="margin-top: 2.5em;"><RouterLink to="/">Home</RouterLink></li>
        <li style="margin-top: 2em;"><RouterLink to="/browseCocktails">Browse<br>Cocktails</RouterLink></li>
        <li id="logo_li"><RouterLink to="/"><img id="logo" src="./assets/mixerfixer.png" alt=""></RouterLink></li>
        <li style="margin-top: 2em;"><RouterLink to="/socialHub">Social<br>Hub</RouterLink></li>

        <li style="margin-top: 2.5em;">
          <div v-if="!signedIn">
            <RouterLink to="/signIn">Log In</RouterLink>
          </div>
          <div v-else>
            <RouterLink to="/account">Account</RouterLink>
          </div>
        </li>
      </ul>
    </div>
  </div>


  <div id="phoneDisplay">
    <div id="phoneNavBar">
      <div id="hamburgerMenu">
        <img @click="sideMenu = !sideMenu" v-if="!sideMenu" id="hamburger" src="../src/assets/Icons/whiteHamburger.jpg" alt="Menu">
        <img @click="sideMenu = !sideMenu" id="blackX" v-else src="../src/assets/Icons/whiteX.png" alt="Exit Menu">
      </div>
      <RouterLink to="/"><img id="phoneLogo" src="./assets/mixerfixer.png" alt=""></RouterLink>
    </div>


  <Transition name="bounce">
    <div  class="phoneSideBar" v-if="sideMenu" >
          <div id="phoneMenuOptions">
            <RouterLink @click="sideMenu = !sideMenu" to="/" id="homeMenu"><h3>Home</h3></RouterLink>
            <RouterLink @click="sideMenu = !sideMenu" to="/browseCocktails"><h3>Browse Cocktails</h3></RouterLink>
            <RouterLink @click="sideMenu = !sideMenu" to="/socialHub"><h3>Social Hub</h3></RouterLink>
            <div v-if="!signedIn">
              <RouterLink @click="sideMenu = !sideMenu" to="/signIn"><h3>Log In</h3></RouterLink>
            </div>
            <div v-else>
              <RouterLink @click="sideMenu = !sideMenu" to="/account"><h3>Account</h3></RouterLink>
            </div>
          </div>
    </div>
  </Transition>

  </div>



<div class="view">
  <RouterView />
</div>


</template>

<style>

.view{
  min-height: 35em;
}

#phoneDisplay{
  display: none;
}

#nav-menu{
  height: 5em;
  width: 100%;
  background-color: rgba(0, 0, 0, .5);
  justify-content: center;
  position: fixed;
  top: 0;
  overflow: hidden;
  z-index: 100;

}


#menu_items{
  list-style-type: none;
  display: flex;
  margin: 0 auto;
  justify-content: center;
}

#menu_items:last-child{
  margin-right: 4em;
}

li{
  text-align: center;
  margin-left: 2.5em;
  margin-right: 2.5em;
}


a{
  text-decoration: none;
  color: white;
}



#logo{
  width: 4em;
  height: auto;
  margin-top: 1em;
}


@media screen and (min-width: 0) and (max-width: 550px) {


  #desktopView{
    display: none;

  }

  #phoneDisplay{
    overflow-x: hidden;
    width: 100%;
    display: block !important;
  }

  #phoneNavBar{
    margin-bottom: 0;
    height: 5em;
    background-color: rgba(0, 0, 0, .5);
    justify-content: center;
    position: fixed;
    top: 0;
    z-index: 90;
    width: 100%;
  }



  #phoneLogo{
    width: 5em;
    height: auto;
    margin: 1em auto 0 auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }


  .phoneSideBar{
    position: fixed;
    background: rgba(0, 0, 0 ,.5);
    width: 85%;
    height: 100%;
    z-index: 100;
    margin: 0 auto;
    right: -1em;
    color: white;
  }



  a h3{
    color: white;
    width: 80%;
    height: 2em;
    margin: 1em auto;
    padding-top: 1em;
    border-radius: 10px;

  }

  a h3:hover{
    text-decoration: none !important;
    background: linear-gradient(30deg, #F166B3, #6254C9);
  }


  #phoneMenuOptions{
    margin-top: 5em;
    margin-left: 1em;
    text-align: center;
    background: rgba(0, 0, 0, .1);
    padding-top: 1em;
    padding-bottom: 1em;
    border-radius: 10px;
    width: 90%;
    box-shadow: inset 0 0 10px #000000;
  }

  #hamburger{
    width: 3.5em;
    margin-top: .5em;
    margin-left: 1em;
  }

  #blackX{
    width: 2.5em;
    margin-top: 1em;
    margin-left: 1.3em;
  }


  @keyframes slideInLeft {
    0%{
      right: -30em;
    }
    50%{
      right: 1em;
    }
    100%{
      right: -1em;
    }
  }

  /*Animations*/
  .bounce-enter-active {
    animation: slideInLeft  .5s forwards;
  }
  .bounce-leave-active {
    animation: slideInLeft  .5s reverse;
  }
}


</style>
