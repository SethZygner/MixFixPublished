<script setup>
import {reactive, ref} from "vue";
import fire from '../../Firebase.js';
import DrinkCard from '../Slots/DrinkCard.vue';
import DrinkInformation from '../Slots/DrinkInformationCard.vue';
import PhoneDrinkInformation from '../Slots/PhoneDrinkInformationCard.vue'
import DRINKS from '../Drinks.json';
import {getAuth, onAuthStateChanged} from "firebase/auth";



//=========================================== I/O ===========================================//

let ShowIngredientsAdded = ref(false);
let DrinkSaved = ref(false);
let ShowSaveButton = ref(false);


//========================================== Inputs ==========================================//

let Enter_Ingredient_Input = ref("");


//===================================== Arrays and Objects =====================================//

let Filterable_Drinks = reactive([]); //A list of filtered drinks after the filter
let alphabetical = ref(true); //Checks weather the list is in alphabetical order or not
let SelectedDrink = reactive([]); // Filled with a selected drink's information
let Ingredients_Searched_For = reactive([]);


//Arrays of Filters
let Glass = reactive([]); //Different Glass Filter Options
let Category = reactive([]); //Category Options

//=================================== Initial Functions to Run ===================================//

//Scroll to the top automatically when page is loaded
window.scrollTo(0, 0);

onAuthStateChanged(getAuth(), ()=>{
  if(getAuth().currentUser){
    ShowSaveButton.value = true;
  }
})


//Get Filter Options
DRINKS.forEach((drink)=>{
  if(!Glass.includes(drink.strGlass)){
    Glass.push(drink.strGlass);
    Glass.sort();
  }
  if(!Category.includes(drink.strCategory)){
    Category.push(drink.strCategory);
    Category.sort();
  }
})

//Drink sorting functions
function SortArray(x, y){
  return x.strDrink.localeCompare(y.strDrink, 'en', { sensitivity: 'base' });
}
function SortAlphabetically(){
  alphabetical.value = !alphabetical.value;

  if(alphabetical.value){
    if(Filterable_Drinks.length){
      Filterable_Drinks.sort(SortArray);
    }
    DRINKS.sort(SortArray)
  }else{
    if(Filterable_Drinks.length){
      Filterable_Drinks.sort(SortArray).reverse();
    }
    DRINKS.sort(SortArray).reverse();
  }
}


//When a drink is clicked, this function displays it into the SelectedDrink array
function GetDrinkInfo(index){

  let SavedDrinksArray = fire.UserInformation[1];

  if(Filterable_Drinks.length){
    SelectedDrink.push(Filterable_Drinks[index]);
  }else{
    SelectedDrink.push(DRINKS[index]);
  }


  SavedDrinksArray.forEach((drink)=>{
    if(SelectedDrink[0].idDrink === drink.idDrink){
      DrinkSaved.value = true;
    }
  })

}

function FilterByIngredients(){

  //This Searches by Ingredients Entered
  if(Ingredients_Searched_For.length){

    const items = DRINKS.filter((cocktail) => {
      return Ingredients_Searched_For.every((ing) => {
        return cocktail.Ingredients.find(cocIng => cocIng.Ingredient.toLowerCase().includes(ing.toLowerCase()))
      })
    })
    Filterable_Drinks.length = 0;
    Filterable_Drinks.push(...items);
  }else{
    Filterable_Drinks.length = 0;
  }
}

function DeleteIngredient(index){
  Ingredients_Searched_For.splice(index, 1);
  Enter_Ingredient_Input.value = "";
  FilterByIngredients();
}


function AddIngredient(){
  if(Enter_Ingredient_Input.value){
    Ingredients_Searched_For.push(Enter_Ingredient_Input.value);
    Enter_Ingredient_Input.value = "";
    FilterByIngredients();
  }
}

function DeleteAllIngredients(){
  Ingredients_Searched_For.length = 0;
  FilterByIngredients();
}

function SaveToFavorites(){
  fire.AddDrinkToFavorites(SelectedDrink[0]);
  DrinkSaved.value = true;
}

function RemoveFromFavorites(){
  fire.RemoveDrinkFromFavorites(SelectedDrink[0]);
  DrinkSaved.value = false;
}

function ExitSelectedDrink(){
  SelectedDrink.length = 0;
  DrinkSaved.value = false;
}


</script>

<template>
<!--======================================= Overlays And Selected Drinks =================================== -->
  <div class="Black-Overlay" v-if="SelectedDrink.length" @click="ExitSelectedDrink()"></div>

  <div v-if="SelectedDrink.length" id="Drink-Information">
    <DrinkInformation  >
      <template #Drink-Image>
        <img :src="SelectedDrink[0].strDrinkThumb" class="Pop-Up-Drink-Image img-fluid"  alt="">
      </template>

      <template #Drink-Name>
        <h3>{{SelectedDrink[0].strDrink}}</h3>
      </template>

      <template #SaveDrinkButton>
        <div v-if="ShowSaveButton">
          <div @click="RemoveFromFavorites" v-if="DrinkSaved" class="simple-input-sm d-flex align-items-center justify-content-center mx-auto Hover">Unsave</div>
          <div v-else @click="SaveToFavorites" class="simple-input-sm d-flex align-items-center justify-content-center mx-auto Hover">Save Drink</div>
        </div>

      </template>

      <template #Ingredients>
        <div class="col-md-4 col-5" v-for="ingredients in SelectedDrink[0].Ingredients">
          <p>{{ingredients.Ingredient}} - {{ingredients.Measurement}}</p>
        </div>
      </template>

      <template #Instructions>
        <p>{{SelectedDrink[0].strInstructions}}</p>
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
        <div v-if="ShowSaveButton">
          <div @click="RemoveFromFavorites" v-if="DrinkSaved" class="simple-input-sm d-flex align-items-center justify-content-center mx-auto Hover">Unsave</div>
          <div v-else @click="SaveToFavorites" class="simple-input-sm d-flex align-items-center justify-content-center mx-auto Hover">Save Drink</div>
        </div>
      </template>

    </PhoneDrinkInformation>
  </div>




  <div class="offcanvas offcanvas-bottom mr-0"  tabindex="-1" id="offcanvasBottom" >
    <div class="offcanvas-header">

      <h5 class="offcanvas-title">Filters</h5>

      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>

    </div>
    <div class="offcanvas-body d-flex">
      <select>

      </select>

      <select name="" id="">

      </select>
    </div>
  </div>



<!--============================================== Main Content ============================================== -->
  <div class="container-fluid text-center">

    <div class="my-3">
      <div class="d-flex col-md-4 col-10 mx-auto">

        <input type="text" placeholder="Enter Ingredient" class="simple-input-left-radius" v-model="Enter_Ingredient_Input" @keydown.enter="AddIngredient">
        <div class="simple-input-sm-right-radius d-flex align-items-center justify-content-center">
          <div class="px-4" @click="AddIngredient">Add</div>
        </div>

      </div>
      <hr>
      <div v-if="Ingredients_Searched_For.length">
        <p class="P-Hover" v-if="!ShowIngredientsAdded" @click="ShowIngredientsAdded = true;">Show Ingredients Added +</p>
        <p class="P-Hover" v-else @click="ShowIngredientsAdded = false;">Hide Ingredients -</p>
      </div>


      <div id="ShownIngredients" class="row" v-if="Ingredients_Searched_For.length && ShowIngredientsAdded">
        <div  class=" px-5 text-center col-md-3 col-6" v-for="ingredient in Ingredients_Searched_For">
          <h4 @click="DeleteIngredient(Ingredients_Searched_For.indexOf(ingredient))" class="P-Hover ">{{ingredient}} </h4>

        </div>
        <div class="col-12">
          <button @click="DeleteAllIngredients">Clear All</button>
        </div>

      </div>




<!--      <button class="p-2"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom"><b>Filters</b></button>-->

    </div>




    <!-- ++++++++++++++++++++++++++++++++++++++ Shows List of Drinks and Filtered Drinks ++++++++++++++++++++++++++++++++++++++-->

    <div class="  p-3" id="Drink-List-View">

      <!-- Create a row that is responsive for a phone view as well. 3 columns on wide screen, 2 columns on a phone screen -->
      <div class="row justify-content-evenly display-flex" >

        <!-- For every drink in the Drinks.json, show a drink card of it in the list -->
        <div v-if="!Filterable_Drinks.length" class="col-md-2 col-6" v-for="drink in DRINKS">
          <DrinkCard class="mb-5 Hover" @click="GetDrinkInfo(DRINKS.indexOf(drink))">
            <template #Image-Slot>
              <img :src=drink.strDrinkThumb class="img-fluid" alt="">
            </template>
            <template #DrinkName-Slot>
              <div style="overflow: hidden;">
                <h6>{{drink.strDrink}}</h6>
              </div>

            </template>
          </DrinkCard>
        </div>

        <div v-else class="col-md-2 col-6" v-for="drink in Filterable_Drinks">
          <DrinkCard class="mb-5 Hover" @click="GetDrinkInfo(Filterable_Drinks.indexOf(drink))">
            <template #Image-Slot>
              <img  :src=drink.strDrinkThumb class="img-fluid" alt="">
            </template>
            <template #DrinkName-Slot>
              <div style="overflow: hidden;">
                <h6>{{drink.strDrink}}</h6>
              </div>
            </template>
          </DrinkCard>
        </div>

      </div>

    </div>





  </div>


</template>





<style scoped>


#Drink-List-View{
  max-height: 37em;
  overflow-y: scroll;
}


#Drink-Information{
  position: fixed; z-index: 2000;
  height: 80%;
}

#Phone-Drink-Information{
  display: none;
}

.Phone-Filters{
  display: none;
}






@media screen and (max-width: 767px){

  /*Regular Drink Information is Hidden when seen on a phone*/
  #Drink-Information{
    display: none;
  }

  #Phone-Drink-Information{
    display: contents;
  }

  #Drink-List-View{
    max-height: 45em;
  }


  .Phone-Filters{
    display: contents;
  }


}



</style>










