<script setup>
import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css/bundle'
import { Navigation, EffectCube } from 'swiper';
import {reactive, ref} from "vue";


let Alcoholic = ref(false);
let Proof = ref(false);
let IngredientMayBeAdded = ref(false);

let IngredientName = ref("");
let IngredientAmount = ref("");
let IngredientUnit = ref("");
let AlcoholicAmount = ref(0);



let IngredientsEntered = reactive([1, 2]);
let FlavorProfile = reactive([
  {
    Profile: "Boozy",
    Description: "Flavor and aroma of the presence of alcohol in a large percentage. It may be sharp, warming, nose-tingling, or burning."
  },
  {
    Profile: "Sweet",
    Description: "Perception of the presence of sugars. Ex: Honey, fruits, maple syrup."
  },
  {
    Profile: "Sour",
    Description: "Perception of the presence of acids. Ex: Lemon, Citrus, Vinegar."
  },
  {
    Profile: "Bitter",
    Description: "Perception of the presence of bases. Ex: Tonic Water, Coffee, Dark Chocolate, Beer, Cranberries, Bitters (duh)."
  },
  {
    Profile: "Umami",
    Description: "Perception of savory flavors."
  },
  {
    Profile: "Salty",
    Description: "Perception of sodium chloride. Ex:  Sea Salt, Pickles."
  }
  ]);

let EnteredFlavorProfiles = reactive([]);


function selectFlavorProfile(action, index){

  switch (action){
    case "Add":
      EnteredFlavorProfiles.push(FlavorProfile[index]);
      FlavorProfile.splice(index, 1);
      break;

    case "Remove":
      FlavorProfile.push(EnteredFlavorProfiles[index]);
      EnteredFlavorProfiles.splice(index, 1);
      break;
  }


}

function checkIfIngredientCanBeAdded(){
  //there has to be a name for EVERY ingredient
  if(IngredientName.value.length >= 3){
    IngredientMayBeAdded.value = true;

    if(Alcoholic.value){
      if(!AlcoholicAmount.value || !IngredientUnit.value){
        IngredientMayBeAdded.value = false;
      }
    }

    if(IngredientUnit.value){
      if(!IngredientAmount.value){
        IngredientMayBeAdded.value = false;
      }
    }

  }else{
    IngredientMayBeAdded.value = false;
  }
}


window.addEventListener("keyup", ()=>{
  checkIfIngredientCanBeAdded();

});

function ingredientToggle(action, index){


  switch (action){

    //Add an ingredient
    case "Add":



      break;


    //Remove an ingredient
    case "Remove":

      break;


    //Edit an ingredient
    case "Edit":

      break;

  }
}


</script>

<template>


</template>


<style scoped>




</style>
