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
  <div id="allContent">

    <div style="margin-top: 10em;">
    </div>

    <div id="firstPortion">

    </div>

    <div id="features">


      <div id="SocialHub">
        <div>
          <h2>Social Hub</h2>
          <br>
          <img id="socialPic" src="../assets/Icons/RevisedCreateGame.jpg" alt="">
        </div>
        <div class="overlay">
          <div>
            <h2>Join the party!</h2>
            <h3>Discover new drinks and even create your own to share with fellow Mixers</h3>
            <button @click="router.push('/socialHub')">Get Social</button>
          </div>
        </div>
      </div>


      <div id="BrowseCocktails">

        <div>
          <h2>Browse</h2>
          <br>
          <img id="browsePic" src="../assets/Icons/Browse.png" alt="">
        </div>
        <div class="overlay">
          <div>
            <h2>Shaken, not stirred</h2>
            <h3>Find a drink that fancies your palette using our up-and-coming API!</h3>
            <button @click="router.push('/browseCocktails')">Browse</button>
          </div>
        </div>
      </div>


      <div v-if="!signedIn" id="SignUp">

        <div>
          <h2>SignUp</h2>
          <img style="margin-left: 2em;" id="signPic" src="../assets/Icons/Sign.jpg" alt="">
        </div>
        <div class="overlay">
          <div>
            <h2>Become a Mixer!</h2>
            <h3>Join fellow Mixers, earn rewards, and even contribute to the community</h3>
            <button @click="router.push('/signIn')">Sign Up</button>
          </div>
        </div>

      </div>


      <div v-else id="account">

        <div>
          <h2>Account</h2>
          <img style="margin-left: 2em;" id="accountIcon" src="../assets/Icons/usernameIcon.png" alt="">
        </div>
        <div class="overlay">
          <div>
            <h2>Manage your account</h2>
            <h3>See your saved drinks and games from our API and other users</h3>
            <button @click="router.push('/account')">Account</button>
          </div>
        </div>
      </div>

    </div>
  </div>



</template>


<style scoped>

#allContent{
  overflow-y: scroll;
  margin: 0 auto;
}

#allContent::-webkit-scrollbar{
  display: none;
}

#features{
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
  width: 100%;
  margin: 0 auto;
}

#SocialHub, #BrowseCocktails, #SignUp, #account{
  width: 75%;
  aspect-ratio: 1/1;
  border: 1px black solid;
  margin: 5em auto;
  border-radius: 10px;
  overflow: hidden;
  color: white;
  text-align: center;
  position: relative;
  background: linear-gradient(30deg, #F166B3, #6254C9);
  box-shadow: 6px 6px 8px #171717;
}


.overlay{
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 10px;
  bottom: 100%;
  background: rgba(0 ,0, 0, .85);
  overflow: hidden;
  width: 100%;
  height: 0;
  transition: .5s ease;
}

.overlay div{
  margin-top: 4em;
  padding: 1em;
}


#SignUp:hover .overlay, #BrowseCocktails:hover .overlay, #SocialHub:hover .overlay, #account:hover .overlay{
  bottom: 0;
  height: 100%;

}

#socialPic, #browsePic, #signPic, #accountIcon{
  width: 15em;
  height: auto;
}

#accountIcon{
  margin-right: 2em;
}

button{
  width: 12em;
  height: 4em;
  border-radius: 6px;
  background: linear-gradient(30deg, #F166B3, #6254C9);
  color: white;
}

button:hover{
  cursor: pointer;
}


#firstPortion{

  background: linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
  ),
  url('../assets/Image_1.png') center no-repeat;
  color: white;
  text-align: center;
  width: 88%;
  border-radius: 10px;
  height: 18em;
  margin: 7em auto 1em auto;
}

@media screen and (min-width: 0) and (max-width: 550px){
  #features{
    display: block;
  }

  .overlay div{
    margin-top: 2em;
    padding: .5em;
  }

 .overlay div h3{
    font-size: .9em;
  }

 .overlay div h2{
   font-size: 1em;
 }
}

</style>
