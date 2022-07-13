<script setup>
import fire from '../../Firebase.js';
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebase from "firebase/compat";

window.scrollTo(0, 0);



let router = useRouter();
let loading = ref(false);
let UserFavoritesClicked = ref(true);


let UserInfo = reactive([]);
let clickedDrink = reactive([]);

//Functions
function signOut(){
  try{
    fire.signOut(fire.getAuth());
    loading.value = true;
    setTimeout(()=>{
      loading.value = false;
      router.push('/');
    }, 3000);
  }catch(err){
    alert(err.message)
  }
}

function getSpecificDrink(index){
  clickedDrink.length = 0;
  clickedDrink.push(...index);
}

onAuthStateChanged(getAuth(), ()=>{

  const getUserInfo = firebase.database().ref();
  getUserInfo.child("users").get()
      .then((snapshot)=>{
        snapshot.forEach((user)=>{

          if(user.key === getAuth().currentUser.uid && getAuth().currentUser){
            UserInfo.push(user.val());
            console.log(UserInfo)
            return 0;
          }
        })
      })
})


</script>


<template>

  <div v-if="loading" id="loadingScreen">
    <h1>Processing...</h1>
  </div>

  <div @click="clickedDrink.length = 0" class="Black-Overlay" v-if="clickedDrink.length">

  </div>

  <Transition name="bounce">
    <div class="DrinkDisplay" v-if="clickedDrink.length">
      <h2>{{clickedDrink[0].DrinkName}} ({{clickedDrink[0].ABV.toFixed(0)}}% ABV)</h2>
      <div  class="DrinkInformation" >
        <div>
          <h2>Mixer : {{clickedDrink[0].Username}}</h2>
          <img v-if="clickedDrink[0].Image" :src="clickedDrink[0].Image" alt="">
          <img v-else src="../assets/Image_1.png" alt="">
        </div>


        <div class="Ingredients">
          <div class="Ingredient" v-for="ingredient in clickedDrink[1]">
            <h3>{{ingredient.Ingredient}}</h3>
            <h3>{{ingredient.Percent}} <span v-if="ingredient.PercentOrProof === '%'">%</span><span v-if="ingredient.PercentOrProof === 'Proof'"> Proof</span></h3>
            <p>{{ingredient.Measurement+" "+ingredient.Unit}}</p>
          </div>
        </div>

      </div>
      <p style="margin: 0 auto" class="PClose" @click="clickedDrink.length = 0">Close</p>
    </div>

  </Transition>






  <div v-if="UserInfo.length"  class="All-Content">

    <div style="display: block; clear:both; box-sizing: border-box" >
      <div  class="Profile-Heading">
        <h1>{{UserInfo[0].Username}}</h1>
        <button @click="signOut">Sign Out</button>

      </div>
    </div>



    <div class="Saved-And-Made-Drinks">

      <div class="Saved-Drinks-Display">
        <h2>Favorites</h2>
        <div class="Saved-Drinks">

        </div>

      </div>

      <div class="Made-Drinks-Display">
        <h2>Drinks Made</h2>
        <div class="Made-Drinks">
          <div @click="getSpecificDrink(drink)"  v-if="UserInfo.length" class="Specific-Made-Drink" v-for="drink in UserInfo[0].publicDrinks">
            {{drink[0].DrinkName}}
            <img  :src="drink[0].Image" alt="">
            <h3>{{drink[0].ABV.toFixed(0)}}% ABV</h3>
          </div>
        </div>

      </div>

    </div>



  </div>





</template>






<style scoped>



button:hover{
  cursor: pointer;
}


#loadingScreen{
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
  position: absolute;
  top: 0;
  color: white;
  text-align: center;
}

#loadingScreen h1{
  margin: 10em auto;
}

.Profile-Heading{
  height: 18em;
  border-radius: 1em;
  width: 95%;
  text-align: center;
  justify-content: center;
  color: white;
  margin: 6em auto 2em auto;
  background: linear-gradient(30deg, #F166B3, #6254C9);
}


.Saved-And-Made-Drinks{
  display: grid;
  grid-template-columns: 50% 50%;
  width: 95%;
  height: 30em;
  margin: 0 auto 3em auto;
  box-sizing: border-box;
  overflow: hidden;
  justify-content: center;
  text-align: center;
  color: white;
}

.Made-Drinks-Display, .Saved-Drinks-Display{
  padding: 0 1em 1em 1em;
  height: auto;
}

.Made-Drinks, .Saved-Drinks{
  height: 25em;
  width: 100%;
  display: grid;
  padding: 1em;
  box-sizing: border-box;
  grid-template-columns: 50% 50%;
  box-shadow: inset 0 0 10px #000000;
}

.Specific-Made-Drink{
  border-radius: 1em;
  height: 14em;
  margin: 0 auto;
  padding: .5em;
  width: 90%;
  box-sizing: border-box;
  background: linear-gradient(30deg, #F166B3, #6254C9);
}

.Specific-Made-Drink:hover{
  cursor: pointer;
}

.Specific-Made-Drink img{
  width: 75%;
  border: 1px white solid;
  border-radius: 1em;
  margin: 1em auto .5em auto;
}

.Specific-Made-Drink h3{
  margin: 0;
}


.DrinkDisplay{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  width: 80%;
  top: 7em;
  height: 35em;
  margin-left: auto;
  margin-right: auto;
  position: fixed;
  left: 0;
  right: 0;
  color: white;
  border-radius: 1em;
  text-align: center;
  z-index: 30;

}

.DrinkInformation{
  display: grid;
  grid-template-columns: 50% 50%;
  box-sizing: border-box;
  padding: 2em;
}

.DrinkInformation h2{
  margin: 0 auto;
}

.DrinkInformation h1{
  margin: 0 auto;
}

.DrinkInformation h3{
  margin: .1em auto;
}

.DrinkInformation p{
  margin: .2em auto;
}

.DrinkInformation img{
  width: 75%;
  height: auto;
  border-radius: 1em;
  border: 2px white solid;
}

.PClose:hover{
  cursor: pointer;
  text-decoration: underline;
}

.Ingredients{
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 1em;
}

.Ingredient{
  border: 1px white solid;
  border-radius: 1em;
}

.Black-Overlay{
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .7);
}


.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}




</style>
