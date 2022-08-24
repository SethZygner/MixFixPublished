<script setup>
import fire from '../../Firebase.js';
import uniqid from 'uniqid';
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {getAuth, onAuthStateChanged} from "firebase/auth";
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
            })
            .then(()=>{
              LocalStorage.removeItem(getAuth().currentUser.uid+'-UserInformation');
            })
            .then(()=>{
              fire.GetBasicUserInformation();
              Loading.value = false;
            })
        .catch(()=>{
          Loading.value = false;
        })
      })
    })
}

function ClickedDrink(index){
  let SavedDrinks = fire.UserInformation.SavedDrinks;

  SelectedDrink.push(SavedDrinks[index]);

  console.log(SavedDrinks[index]);
}


function RemoveFromFavorites(){
  fire.RemoveDrinkFromFavorites(SelectedDrink[0]);
  SelectedDrink.length = 0;
}

function LogOut(){
  fire.signOut(getAuth());
  Settings.value = false;
  SigningOut.value = true;
  router.push('/');
}

onAuthStateChanged(getAuth(), ()=>{
  console.log(fire.UserInformation)
})



</script>


<template>


    <div class="Black-Overlay" v-if="SigningOut || Settings" @click="Settings = false;"></div>

    <div class="Black-Overlay" v-if="SelectedDrink.length" @click="SelectedDrink.length = 0;"></div>

  <div v-if="SelectedDrink.length" id="Drink-Information">
    <DrinkInformation  >
      <template #Drink-Image>
        <img :src="SelectedDrink[0].strDrinkThumb" class="Pop-Up-Drink-Image img-fluid"  alt="">
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




    <div class="col-md-5 col-10 text-center p-4" v-if="Settings"  id="Settings">
      <img v-if="fire.HasProfilePicture"  :src="fire.UserInformation.GeneralInformation.ProfilePicture" class="img-fluid Hover Profile-Image " alt="">
      <img v-else  src="../assets/Icons/usernameIcon.png" class="img-fluid Hover Profile-Image" alt="">
      <h3><b>{{fire.UserInformation.GeneralInformation.Username}}</b></h3>
      <button @click="LogOut">Sign Out</button>
    </div>

    <div class="container-fluid d-flex align-items-center justify-content-center" id="Header">
      <img id="Header-Image" src="../assets/Image_1.png" alt="">
    </div>

  <div v-if="fire.UserInformation">
    <div class="text-center">
      <label>
        <input @change="ChangeProfileImage" type="file" style="display: none;">

        <img v-if="fire.HasProfilePicture && fire.UserInformation.GeneralInformation.ProfilePicture"  :src="fire.UserInformation.GeneralInformation.ProfilePicture" class="img-fluid Hover Profile-Image" alt="">
        <img v-else  src="../assets/Icons/usernameIcon.png" class="img-fluid Hover Profile-Image" alt="">
      </label>
    </div>
    <div class="text-center d-flex justify-content-center align-items-center">
      <h3><b>{{fire.UserInformation.GeneralInformation.Username}}</b></h3>
      <img id="SettingsCog" src="../assets/Icons/SettingsCog.jpg" @click="Settings = true;" class="icon-xs mb-2 ml-3" alt="">
    </div>
  </div>

  <div class="row justify-content-evenly text-center mt-md-3 mt-5 mb-5">
    <div class="Profile-Column col-md-5 col-11" id="Favorites">
      <h4>Favorites</h4>
      <hr>
      <div class="Shown row justify-content-evenly">
        <div v-for="drinks in fire.UserInformation.SavedDrinks" class="col-md-4 col-5">
          <DrinkCard @click="ClickedDrink(fire.UserInformation.SavedDrinks.indexOf(drinks))">
            <template #Image-Slot>
              <img :src="drinks.strDrinkThumb" alt="">
            </template>
            <template #DrinkName-Slot>
              <h5>{{drinks.strDrink}}</h5>
            </template>
          </DrinkCard>
        </div>

      </div>
    </div>

    <div class="Profile-Column col-md-5 col-11 mt-md-0 mt-4" id="Made_Drinks">
      <h4>Made Drinks</h4>
      <hr>
      <div class="Shown row justify-content-evenly">
        <div v-for="drinks in fire.UserInformation.MadeDrinks" class="col-md-4 col-5">
          <DrinkCard>
            <template #Image-Slot>
              <img :src="drinks.strDrinkThumb" alt="">
            </template>
            <template #DrinkName-Slot>
              <h5>{{drinks.strDrink}}</h5>
            </template>
          </DrinkCard>
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

  /*Regular Drink Information is Hidden when seen on a phone*/
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
