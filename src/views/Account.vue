<script setup>
import fire from '../../Firebase.js';
import uniqid from 'uniqid';
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {getAuth} from "firebase/auth";
import DrinkCard from '../Slots/DrinkCard.vue';
import DrinkInformation from '../Slots/DrinkInformationCard.vue';
import PhoneDrinkInformation from '../Slots/PhoneDrinkInformationCard.vue'

window.scrollTo(0, 0);

let LocalStorage = window.localStorage;

let HasProfilePicture = ref(false);

let Settings = ref(false);

let SigningOut = ref(false);

let Loading = ref(false);

let router = useRouter();

let SelectedDrink = reactive([]); // Filled with a selected drink's information


//Changes the User's profile image
function ChangeProfileImage(e){
  let ID = uniqid();
  HasProfilePicture.value = false;
  Loading.value = true;
  let ImageInformation = e.target.files[0];

  fire.firebase.storage().ref("Mixers/"+getAuth().currentUser.uid+'/ProfilePictures/'+ID)
    .put(ImageInformation)
    .then((snapshot)=>{
      snapshot.ref.getDownloadURL()
      .then((URL)=>{
        fire.FirestoreDB()
            .collection("Mixers")
            .doc(getAuth().currentUser.uid)
            .update({
              ProfilePicture: URL.toString()
            }).then(()=>{
              fire.GetBasicUserInformation();
              Loading.value = false;
            })
        .catch(()=>{
          Loading.value = false;
        })
      }).then(()=>{
        location.reload();
      })
    })
}


//Gets the drink's information
function ClickedDrink(index){
  console.log(index)
  let SavedDrinks = fire.UserInformation[1][index];
   SelectedDrink.push(SavedDrinks);
   console.log(SelectedDrink);
}

function ClickedMadeDrink(index){
  let MadeDrinks = fire.UserInformation[2][index];
  SelectedDrink.push(MadeDrinks);
}


//Remove a drink from the user's favorites
function RemoveFromFavorites(){
  fire.RemoveDrinkFromFavorites(SelectedDrink[0]);
  SelectedDrink.length = 0;
}


//Log out the user and return to the home page
function LogOut(){
  fire.signOut(getAuth());
  Settings.value = false;
  SigningOut.value = true;
  router.push('/');
}


</script>


<template>


  <!-- ================================================= Overlays ================================================= -->
  <div class="Black-Overlay" v-if="SigningOut || Settings" @click="Settings = false;"></div>

  <div class="Black-Overlay" v-if="SelectedDrink.length" @click="SelectedDrink.length = 0;"></div>




  <!-- ======================================== Selected Drink Information ======================================== -->
  <div v-if="SelectedDrink.length" id="Drink-Information">
    <DrinkInformation  >
      <template #Drink-Image>
        <img v-if="SelectedDrink[0].strDrinkThumb" :src="SelectedDrink[0].strDrinkThumb" class="Pop-Up-Drink-Image img-fluid"  alt="">
      </template>

      <template #Drink-Name>
        <h3>{{SelectedDrink[0].strDrink}}</h3>
      </template>

      <template #Ingredients>
        <div class="col-md-4 col-5" v-for="ingredients in SelectedDrink[0].Ingredients">
          <p>{{ingredients.Ingredient}} - {{ingredients.Measurement}}</p>
        </div>
      </template>

      <template #Instructions>
        <p>{{SelectedDrink[0].strInstructions}}</p>
      </template>

      <template #SaveDrinkButton>
        <div @click="RemoveFromFavorites" class="mx-auto d-flex col-7 align-items-center simple-input-md justify-content-center">
          <h6>Remove</h6>
          <img src="../assets/Icons/TrashButton.png" class="icon-xs mb-2 ml-3" alt="">
        </div>
      </template>
    </DrinkInformation>
  </div>

  <div v-if="SelectedDrink.length" id="Phone-Drink-Information">
    <PhoneDrinkInformation>
      <template #Drink-Image>
        <img :src="SelectedDrink[0].strDrinkThumb" class="img-fluid" alt="">
      </template>

      <template #Drink-Name>
        <h3><b>{{SelectedDrink[0].strDrink}}</b></h3>
      </template>


      <template #Ingredients>
        <div class="col-10 text-center mx-auto" v-for="ingredients in SelectedDrink[0].Ingredients">
          <p>{{ingredients.Ingredient}} - {{ingredients.Measurement}}</p>
        </div>
      </template>

      <template #SaveDrinkButton>
        <div @click="RemoveFromFavorites" class="mx-auto d-flex col-7 align-items-center simple-input-md justify-content-center">
          <h6>Remove</h6>
          <img src="../assets/Icons/TrashButton.png" class="icon-xs mb-2 ml-3" alt="">
        </div>
      </template>

    </PhoneDrinkInformation>
  </div>




  <!-- ================================================== Settings ================================================== -->

  <div class="col-md-5 col-10 text-center p-4" v-if="Settings"  id="Settings">
      <img v-if="fire.UserInformation[0].ProfilePicture"  :src="fire.UserInformation[0].ProfilePicture" class="img-fluid Hover Profile-Image " alt="">
      <img v-else  src="../assets/Icons/usernameIcon.png" class="img-fluid Hover Profile-Image" alt="">
      <h3><b>{{fire.UserInformation[0].Username}}</b></h3>
      <button @click="LogOut">Sign Out</button>
    </div>

  <div class="container-fluid d-flex align-items-center justify-content-center" id="Header">
    <img id="Header-Image" src="../assets/Image_1.png" alt="">
  </div>


  <!-- ========================================== Top Portion of Profiles ========================================== -->

  <div v-if="fire.UserInformation.length">
    <!-- -------------------------------------- Profile Picture -------------------------------------- -->
    <div class="text-center">
      <label>
        <input @change="ChangeProfileImage" type="file" style="display: none;">
        <img v-if="fire.UserInformation[0].ProfilePicture"  :src="fire.UserInformation[0].ProfilePicture" class="img-fluid Hover Profile-Image" alt="">
        <img v-else  src="../assets/Icons/usernameIcon.png" class="img-fluid Hover Profile-Image" alt="">
      </label>
    </div>

    <!-- ------------------------------ User's Username and Setting Icon ------------------------------ -->
    <div class="text-center d-flex justify-content-center align-items-center">
      <h3><b>{{fire.UserInformation[0].Username}}</b></h3>
      <img id="SettingsCog" src="../assets/Icons/SettingsCog.jpg" @click="Settings = true;" class="icon-xs mb-2 ml-3" alt="">
    </div>
  </div>


  <!-- =========================================== Main Content of Profile =========================================== -->

  <div class="row justify-content-evenly text-center mt-md-3 mt-5 mb-5">

    <!-- ++++++++++++++++++++++++++++++++++ Favorites Portion ++++++++++++++++++++++++++++++++++ -->

    <div class="Profile-Column col-md-5 col-11" id="Favorites">
      <h4>Favorites</h4>
      <hr>


      <!-- ------------------------------------ Favorites Container ------------------------------------ -->
      <div class="Shown row justify-content-evenly">

        <!-- ------------------------------------ List View ------------------------------------ -->

        <div v-for="drinks in fire.UserInformation[1]" class="col-md-4 col-5">
          <DrinkCard @click="ClickedDrink(fire.UserInformation[1].indexOf(drinks))" class="Hover">
            <template #Image-Slot>
              <img :src="drinks.strDrinkThumb" alt="">
            </template>
            <template #DrinkName-Slot>
              <h5 class="Card-Text">{{drinks.strDrink}}</h5>
            </template>
          </DrinkCard>
        </div>

      </div>
    </div>




    <!-- +++++++++++++++++++++++++++++++++ Made Drinks Portion +++++++++++++++++++++++++++++++++ -->

    <div class="Profile-Column col-md-5 col-11 mt-md-0 mt-4" id="Made_Drinks">
      <h4>Made Drinks</h4>
      <hr>

      <!-- -------------------------------- Made Drinks Container -------------------------------- -->

      <div class="Shown row justify-content-evenly">

        <!-- -------------------------------- Made Drinks List View -------------------------------- -->
        <div v-for="drinks in fire.UserInformation[2]" class="col-md-4 col-5">
          <DrinkCard @click="ClickedMadeDrink(fire.UserInformation[2].indexOf(drinks))" class="Hover">
            <template #Image-Slot>
              <img :src="drinks.strDrinkThumb" alt="">
            </template>
            <template #DrinkName-Slot>
              <h5>{{drinks.strDrink}}</h5>
            </template>
          </DrinkCard >
        </div>

      </div>

    </div>

  </div>


</template>






<style scoped>
#Header {
  overflow: hidden;
  height: 15em;
  margin-top: 5em;
  margin-bottom: -9em;
}
#Header-Image {
  flex-shrink: 0;
  min-width: 100%;
  min-height: 100%;

}


.Profile-Image{
  border-radius: 50% !important;
  max-width: 12em !important;
  aspect-ratio: 1/1 !important;
  border: 5px #F3F3F3 solid !important;
  object-fit: cover !important;
}


.Shown{
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 2px inset;
  max-height: 20em;
  min-height: 10em;
  border-radius: 1em;
  overflow-y: scroll;
}
.Shown::-webkit-scrollbar{
  display: none;
}

#SettingsCog{
  transition: transform .7s ease-in-out;
}
#SettingsCog:hover{
  transform: rotate(360deg);
  cursor: pointer;
}


#Settings{
  height: 80%;
  background-color: #F3F3F3;
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 2000;
  border-radius: 1em;
}


#Drink-Information{
  position: fixed; z-index: 2000;
  height: 80%;
}


#Phone-Drink-Information{
  display: none;
}


@media screen and (max-width: 767px) {

  #Drink-Information {
    display: none;
  }


  #Phone-Drink-Information {
    display: contents;
  }


  #Drink-List-View {
    max-height: 45em;
  }
}




</style>
