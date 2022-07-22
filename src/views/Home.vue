<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import fire from "../../Firebase.js";

const router = useRouter();

let signedIn = ref(false);

window.scrollTo(0, 0);


onAuthStateChanged(getAuth(), ()=>{
  signedIn.value = getAuth().currentUser !== null;
})


</script>



<template>
  <div id="Top-Portion" class="d-flex text-center mx-auto container-fluid px-0" style="">
    <div style="background-color: rgba(0, 0, 0, .6);" class="mx-auto container-fluid">
      <h4>Welcome to MixerFixer</h4>
      <i>"Where all your drinks come true!"</i>
    </div>
  </div>


  <div class="Section Gradient-Portion row container-fluid text-center">
    <div class="col">
      <img src="../assets/Icons/Browse.png" alt="" height="300">
    </div>
    <div class="col">
      <h2>Browse Drinks</h2>
      <h5>Have a drink in mind that you're not quite sure how to make?<br>Browse drinks and cocktails by entering the name or<br>
      ingredients you have on hand to find a drink best suited<br>for you!</h5>
      <button class="btn" @click="router.push('/browseCocktails')">Browse</button>
    </div>
  </div>

  <div class="Section White-Portion row container-fluid text-center">
    <div class="col">
      <h2>Get Social</h2>
      <h5>Discover new drinks from fellow mixers!<br>Explore drinks and add them to your favorites.<br>Feeling creative?
      Create your own mix to share with the community!</h5>
<!--      <RouterLink to="/socialHub"><button class="btn">Discover</button></RouterLink>-->

    </div>
    <div class="col">
      <img src="../assets/Icons/Discover.png" alt="" height="300">
    </div>
  </div>

  <div class="Section Gradient-Portion row container-fluid text-center">
    <div class="col">
      <img src="../assets/Icons/Tools.png" alt="" height="300">
    </div>
    <div class="col">
      <h2>Tools</h2>
      <h5>Want to know some tips and tricks to make drinks? Or even find out properties of your current drink.<br>Use our Mixer tools!</h5>
<!--      <button class="btn">Tools</button>-->
    </div>
  </div>

</template>


<style scoped>

#Top-Portion{
  height: 15em;
  background-image: url("../assets/Image_1.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: 6em;
  color: white; align-items: center;
}

.Section{
  margin: 0 auto;
  padding: 1.5em;
  box-sizing: border-box;
  border-top: 2px white solid;
}

.Gradient-Portion{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  color: white;
}

.Gradient-Portion button{
  background: white;
}

.White-Portion{
  background-color: white;
  color: black;
}

.White-Portion button{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  color: white;
}

button{
  width: 70%;
  font-weight: bold;
  text-align: center;
}


@media screen and (max-width: 560px){

  #Top-Portion{
    margin-top: 0;
  }

  .Section img{
    height: 10em;
  }

  .Section h2{
    font-size: 1em;
    margin-top: 1em;
  }

  .Section h5{
    font-size: .70em;
  }


}


</style>
