<script setup>
//Imports
import {reactive, ref} from "vue";
import DrinkCard from "../Slots/DrinkCard.vue"
import DrinkInformationCard from "../Slots/DrinkInformationCard.vue";
import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css/bundle'


//Misc
window.scrollTo(0, 0);



//API Links


let popularDrinks = "https://www.thecocktaildb.com/api/json/v2/9973533/popular.php";
let Drinks = reactive([]);
let DrinkInfo = reactive([]);
let IngredientListAPI = reactive([]);
let Ingredient = ref("");

let DrinkName = ref("");

let showIngredients = ref(false);
let searchByIngredient = ref(false);



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
          if(compData.drinks !== "None Found" || compData.drinks)
          Drinks.push(...compData.drinks);
        })
  }
}

function IngredientManipulation(action, index){

  switch (action){
    case "Add":
      if(Ingredient.value){
        DrinkName.value = "";
        IngredientListAPI.push(Ingredient.value);

      }
      getByIngredient();
      break;


    case "Remove":
        IngredientListAPI.splice(index, 1);
        if(IngredientListAPI.length){
          getByIngredient();
        }else {
          getPopularDrinks();
        }

      break;


  }

}

function specificDrinkClicked(index){
  DrinkInfo.length = 0;
  let getByIdURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+Drinks[index].idDrink;
  fetch(getByIdURL)
  .then((result)=>{
    return result.json();
  })
  .then((compData)=>{
    cleanData(compData.drinks[0]);

  });

}

function cleanData(data){
  let Ingredients = [];

  //Gets rid of all null data
  Object.keys(data).forEach((key)=>{
    if(!data[key]){
      delete data[key];
    }
  });

  //Separate the ingredients and measurements
  for(let i = 1; i <= 15; i++){
    if(("strIngredient"+i.toString()) in data){
      if(data["strMeasure"+i.toString()]){
        Ingredients.push({Ingredient: data["strIngredient"+i.toString()], Measurement: data["strMeasure"+i.toString()]})
      }else{
        Ingredients.push({Ingredient: data["strIngredient"+i.toString()], Measurement: "User's Choice"})
      }
    }
  }

  let GeneralInfo = [{
    DrinkName: data.strDrink,
    Image: data.strDrinkThumb,
    Instructions: data.strInstructions
  }]

  DrinkInfo.push(Ingredients, ...GeneralInfo)
  console.log(DrinkInfo);

}

function getPopularDrinks(){
  Drinks.length = 0;
  fetch(popularDrinks)
  .then((result)=>{
    return result.json();
  })
  .then((compData)=>{
    Drinks.push(...compData.drinks);
    console.log(Drinks);
  })
}

function clearIngredients(){
  IngredientListAPI.length = 0;
  IngredientManipulation('Remove');
}

function getByDrinkName(){
  if(DrinkName.value.length){
    IngredientListAPI.length = 0;
    Drinks.length = 0;
    let searchByName = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

    fetch(searchByName+DrinkName.value)
        .then((result)=>{
          return result.json();
        })
        .then((compData)=>{
          Drinks.push(...compData.drinks);


        })
  }else{
    getPopularDrinks();
  }

}



getPopularDrinks();

</script>






<template>


  <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
    <div class="offcanvas-header">
      <h5 id="offcanvasTopLabel">Ingredients Entered</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body text-center">
      <div class="row row-cols-2 justify-content-evenly g-2">
        <div class="col-md-5 col-8 row row-cols-2 my-3 justify-content-evenly" id="Ingredients">
          <div @click="IngredientManipulation('Remove', IngredientListAPI.indexOf(item))"  class="col-5" id="Ing" v-for="item in IngredientListAPI">{{item}}</div>
        </div>
        <div class="col-8 col-md-5">
          <button class="btn btn-outline-dark my-3" @click="clearIngredients">Clear</button>
        </div>
      </div>

    </div>
  </div>


  <div class="Overlay"  v-if="DrinkInfo.length || showIngredients" @click="DrinkInfo.length=0;">

  </div>



  <div class="container-fluid row row-flex mt-3 mx-auto justify-content-between text-center col-12" id="Filter-Input">

    <div class="col-lg-8 col-md-10 mx-auto">
      <div class="input-group mb-3" v-if="searchByIngredient">
        <div class="input-group-prepend hover">
          <span class="input-group-text" @click="searchByIngredient = !searchByIngredient"><img src="../assets/IngredientIcon.png" class="img-fluid" width="25" alt=""></span>
        </div>
        <input type="text" class="form-control" placeholder="Enter Ingredient" @keyup.enter="IngredientManipulation('Add')" v-model="Ingredient">
        <div class="input-group-append hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
          <span class="input-group-text">({{IngredientListAPI.length}}) Ingredients</span>
        </div>
      </div>

      <div class="input-group mb-3" v-else>
        <div class="input-group-prepend" >
          <span class="input-group-text hover" @click="searchByIngredient = !searchByIngredient"><img src="../assets/DrinkIcon.jpg" class="img-fluid" width="25" alt=""></span>
        </div>
        <input @input="getByDrinkName" type="text" class="form-control" placeholder="Enter Drink Name" v-model="DrinkName">
      </div>
    </div>

    <p v-if="searchByIngredient"><b>Note:</b> Click the<img src="../assets/IngredientIcon.png" width="20" class="img-fluid mx-2" alt="">to search by drink name</p>
    <p v-else><b>Note:</b> Click the<img src="../assets/DrinkIcon.jpg" width="20" class="img-fluid mx-2" alt="">to search by ingredients</p>

  </div>

<!--  Drink Displays-->

  <div class="row justify-content-evenly container-fluid mx-auto ">

    <div class="col-md-7 col-12 mt-3" id="DrinkDisplay">
      <div v-if="Drinks.length" class="row row-cols-lg-4 row-cols-md-3 row-cols-2 gy-3 p-3">
        <div v-for="item in Drinks">
          <DrinkCard id="Drink" class="hover" @click="specificDrinkClicked(Drinks.indexOf(item))">
            <template #DrinkName-Slot>
              {{item.strDrink}}
            </template>
            <template #Image-Slot>
              <img :src="item.strDrinkThumb" class="img-fluid" alt="">
            </template>
          </DrinkCard>
        </div>
      </div>

      <div v-if="!Drinks.length && IngredientListAPI.length">
        <h2>Nothing seems to match your criteria! Delete some ingrediets or add different ones!</h2>
      </div>

    </div>

    <div class="col-md-5" id="Web-Shown-Drink-Info">
        <DrinkInformationCard v-if="DrinkInfo.length" style="width: 65%; margin-top: -3em">
          <template #Card-Title>{{DrinkInfo[1].DrinkName}}</template>
          <template #Image>
            <img :src="DrinkInfo[1].Image" class="img-fluid" alt="">
          </template>
          <template #Ingredients-And-Measurements>
            <li v-for="item in DrinkInfo[0]" class="list-group-item">{{item.Ingredient}} ({{item.Measurement}})</li>
          </template>
          <template #Instructions>
            <h4>{{DrinkInfo[1].Instructions}}</h4>
          </template>
        </DrinkInformationCard>

        <div v-else class="pt-5 text-center">
          <h3>Select a drink to find out how to make it!</h3>
          <p class="my-5">Here, you will see the ingredients as well as the instructions on the drink you select!<br>
            If you have an account, you will be able to favorite the selected drink so you can find it easier later!</p>
        </div>

    </div>

  </div>


  <div class="mx-auto" id="Phone-Shown-Drink-Info" v-if="DrinkInfo.length">
    <DrinkInformationCard >
      <template #Card-Title>{{DrinkInfo[1].DrinkName}}</template>
      <template #Image>
        <img :src="DrinkInfo[1].Image" class="img-fluid" alt="">
      </template>
      <template #Ingredients-And-Measurements>
        <li v-for="item in DrinkInfo[0]" class="list-group-item">{{item.Ingredient}} ({{item.Measurement}})</li>
      </template>
      <template #Instructions>
        <h4>{{DrinkInfo[1].Instructions}}</h4>
      </template>
    </DrinkInformationCard>


  </div>





</template>





<style scoped>

.row-flex{
  display: flex;
  flex-wrap: wrap;
}

#Ingredients{
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  min-height: 5em;
  height: fit-content;
  padding: .5em;
  border-radius: 10px;
}

#Ing{
  color: white;
  height: fit-content;
  padding: 1em;
  border-radius: 10px;
  background: linear-gradient(30deg, #F166B3, #6254C9);
}

#DrinkDisplay{
  max-height: 30em;
  overflow-y: scroll;
  overflow-x: hidden;
}


.hover:hover{
  cursor: pointer;
}

#Phone-Shown-Drink-Info{
  display: none;
}

.Overlay{
  display: none;
}

.offcanvas{
  min-height: 25em;
}

@media screen and (min-width: 0) and (max-width: 1236px){
  #Web-Shown-Drink-Info{
    display: none !important;
  }

  #Phone-Shown-Drink-Info{
    display: block !important;
    z-index: 201;
    position: fixed;
    top: 5em;
    left: 0;
    right: 0;
    width: 35%;
  }

  .Overlay{
    display: block !important;
    position: fixed;
    background-color: rgba(0, 0, 0, .8);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 200;
  }


}

@media screen and (min-width: 0) and (max-width: 925px){
  #Phone-Shown-Drink-Info{
    width: 50%;
  }
}

@media screen and (min-width: 0) and (max-width: 615px){
  #Phone-Shown-Drink-Info{
    width: 70%;
  }
}

@media screen and (min-width: 0) and (max-width: 400px){
  #Phone-Shown-Drink-Info{
    width: 90%;
  }
}



</style>










