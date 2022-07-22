<!--================================================ SCRIPT ======================================================-->

<script setup>
//Imports
import {reactive, ref} from "vue";
import {Swiper, SwiperSlide} from "swiper/vue";
import { EffectCoverflow, FreeMode } from 'swiper';
import DrinkCard from "../Slots/DrinkCard.vue"
import DrinkInformationCard from "../Slots/DrinkInformationCard.vue"



//Misc
window.scrollTo(0, 0);


let AutocompleteIngredient = reactive([]);


//API Links

const randomDrinkURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
let searchByName = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
let Drinks = reactive([]);
let DrinkInfo = reactive([]);
let IngredientListAPI = reactive([]);
let Ingredient = ref("");


let clickedDrink = ref(false);


function getByIngredient(){
  Drinks.length = 0;
  if(IngredientListAPI.length){
    let multipleIngredientUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=";
    multipleIngredientUrl += IngredientListAPI.toString();
    Ingredient.value = "";
    fetch(multipleIngredientUrl)
        .then((result)=>{
          return result.json();
        })
        .then((compData)=>{
          Drinks.push(...compData.drinks);
        })
  }
}


function IngredientManipulation(action, index){

  switch (action){
    case "Add":
      if(Ingredient.value){
        IngredientListAPI.push(Ingredient.value);
      }
      getByIngredient();
      break;


    case "Remove":
        IngredientListAPI.splice(index, 1);
        getByIngredient();
      break;


  }

}

function specificDrinkClicked(index){
  let getByIdURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+Drinks[index].idDrink;
  fetch(getByIdURL)
  .then((result)=>{
    return result.json();
  })
  .then((compData)=>{

    let obj = compData.drinks[0];
    let IngObj = [];
    let GeneralInfo = [{
      DrinkName: obj.strDrink,
      DrinkID: obj.idDrink,
      Image: obj.strDrinkThumb,
      Instructions: obj.strInstructions
    }];


    let i = 1;
    for(let key in obj){
      let strIng = "strIngredient"+i.toString();
      let strMes = "strMeasure"+i.toString();
      if(strIng in obj){
        if(obj[strIng]){
          if(obj[strMes]){
            IngObj.push({
              Ingredient: obj[strIng],
              Measurement: obj[strMes]
            });
          }else{
            IngObj.push({
              Ingredient: obj[strIng],
              Measurement: "Users' Choice"
            });
          }
        }
      }
      i++;
    }



    DrinkInfo.push(IngObj, ...GeneralInfo);

  });

  console.log(DrinkInfo);

  clickedDrink.value = true;
}


</script>




<!--================================================== HTML ======================================================-->

<template>

  <div v-if="DrinkInfo.length" @click="DrinkInfo.length = 0;" class="fixed-top" style="width: 100%; height: 500em; background-color: rgba(0, 0, 0, .7); z-index: 3;">
      <DrinkInformationCard style="z-index: 4;">
        <template #DrinkImage>
          <img class="img-fluid" :src="DrinkInfo[1].Image" alt="">
        </template>
        <template #Ingredients>
          <h5 class="my-3" v-for="item in DrinkInfo[0]">{{item.Ingredient}} ({{item.Measurement}})</h5>
        </template>
        <template #Description>
          <p>{{DrinkInfo[1].Instructions}}</p>
        </template>
      </DrinkInformationCard>
  </div>

  <div class="container-fluid text-center mb-4 input-group" style="margin-top: 7em">
    <div class="input-group-text">
      <button @click="IngredientManipulation('Add')" class="btn" id="Phone-Ingredient-Add-Button">Add Ingredient</button>
    </div>
    <input maxlength="20" class="form-control" style="font-size: 1.1em" type="text" placeholder="Enter ingredient here..." v-model="Ingredient">
  </div>

  <div v-if="IngredientListAPI.length" class="accordion my-4" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Entered Ingredients
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body" style="max-height: 14em; padding: 1em">
          <div class="row row-cols-2 text-center g-2" >
            <div @click="IngredientManipulation('Remove', IngredientListAPI.indexOf(item))" id="Ingredient" class="col"  v-for="item in IngredientListAPI">
              <h3 >{{item}}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>



<div v-if="Drinks.length" >
  <div id="Drink-Display" class="pb-3">
    <swiper v-if="Drinks.length <= 10" :effect="'coverflow'" :grabCursor="true" :centeredSlides="true" :slidesPerView="'auto'"
            :coverflowEffect="{rotate: 50,stretch: 10,depth: 100,modifier: 1, slideShadows: true,}"
            :modules=[EffectCoverflow]>

      <swiper-slide @click="specificDrinkClicked(Drinks.indexOf(item));" v-for="item in Drinks" class="Swipe-Slide">
        <DrinkCard>
          <template #Image-Slot>
            <img :src=item.strDrinkThumb alt="">
          </template>
          <template #DrinkName-Slot>
            <h4 style="text-overflow: ellipsis; overflow: hidden; height: 1em">{{item.strDrink}}</h4>
          </template>
        </DrinkCard>
      </swiper-slide>

    </swiper>

    <swiper v-else :slidesPerView="1.5" :spaceBetween="10" :freeMode="true" :modules=[FreeMode]>
      <swiper-slide @click="specificDrinkClicked(Drinks.indexOf(item));" v-for="item in Drinks" class="Swipe-Slide">
        <DrinkCard @click="clickedDrink = !clickedDrink">
          <template #Image-Slot>
            <img :src=item.strDrinkThumb alt="">
          </template>
          <template #DrinkName-Slot>
            <h4 style="text-overflow: ellipsis; overflow: hidden; height: 1em">{{item.strDrink}}</h4>
          </template>
        </DrinkCard>
      </swiper-slide>
    </swiper>
  </div>
  <div  class="container-fluid text-center mt-2">
    <h3>Want to delete an Ingredient?</h3>
    <h5>Simply click on the ingredient to get rid of it!</h5>
  </div>

</div>
  <div v-else class="container-fluid text-center">
    <div class="Section Gradient-Section p-4 ">
      <h2>Let's Browse!</h2>
      <h4>Add some ingredients (e.g. Vodka, Rum, Lemonade...) in the input field above and find out what Mix you can Fix!</h4>
    </div>
    <div class="Section White-Section p-4">
      <h2>What's Popular?</h2>
      <h4>Click <strong>HERE</strong> to see the latest updated popular Mixes our database has to offer.</h4>

    </div>

  </div>







</template>





<!--================================================== STYLING ====================================================-->

<style scoped>
.Swipe-Slide{
  display: none;
}

.accordion button{
  color: white;
  background: linear-gradient(30deg, #F166B3, #6254C9);
}
.accordion-button:after{
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>") !important;
}

@media screen and (min-width: 0) and (max-width: 600px){
  .Swipe-Slide{
    width: 75%;
    display: block;
  }

  .Section{
    width: 100%;
    height: auto;
    border-radius: 10px;
  }

  .Gradient-Section{
    background: linear-gradient(30deg, #F166B3, #6254C9);
    color: white;
  }

  #Drink-Display{
    -moz-box-shadow: inset 0 -10px 10px -10px #000000;
    -webkit-box-shadow: inset 0 -10px 10px -10px #000000;
    box-shadow: inset 0 -10px 10px -10px #000000;
  }

}

</style>










