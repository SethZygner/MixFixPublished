<script setup>
import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css/bundle'
import { Navigation } from 'swiper';
import {reactive, ref} from "vue";
import Converter from 'unit-converter-pro';





let Alcoholic = ref(false);
let Proof = ref(false);
let IngredientMayBeAdded = ref(false);

let IngredientName = ref("");
let IngredientAmount = ref("");
let IngredientUnit = ref("");
let AlcoholicAmount = ref(0);


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

let Occasion = reactive([
  {
    Name: 'Celebration',
    isActive: false
  },
  {
    Name: 'Party/Large Group',
    isActive: false
  },
  {
    Name: 'R&R',
    isActive: false
  },
  {
    Name: 'Other',
    isActive: false
  }
])


let EnteredFlavorProfiles = reactive([]);


function selectFlavorProfile(action, index){

  switch (action){
    case "Add":
      if(EnteredFlavorProfiles.length < 3){
        EnteredFlavorProfiles.push(FlavorProfile[index]);
        FlavorProfile.splice(index, 1);
      }
      break;

    case "Remove":
      FlavorProfile.push(EnteredFlavorProfiles[index]);
      EnteredFlavorProfiles.splice(index, 1);
      break;
  }


}

function selectOccasion(index){
  if(Occasion[index].isActive){
    Occasion[index].isActive = false;
  }else{
    Occasion.forEach((item)=>{
      item.isActive = false;
    })

    Occasion[index].isActive = true;
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

console.log(Converter.Volume)

</script>

<template>




  <Swiper :slidesPerView="1" :spaceBetween="10" :centeredSlides="true" :modules=[Navigation] :navigation="true" class="text-center mx-auto">

    <swiper-slide>
      <div class="Slide p-0 p-md-3 row row-cols-md-2 row-cols-1 justify-content-evenly">

        <div class="col-11 col-md-5 mb-md-0 mb-4">
            <h3>Let's get started with the basics</h3>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Drink Name</span>
              </div>
              <input type="text" class="form-control">
            </div>

            <h4>Flavor Profiles</h4>
            <p class="mb-5">A flavor profile describes what the fellow Mixer should expect hte drink to taste like!<br>Choose <b>AT MOST</b> 3
              flavor profiles (optional):</p>
            <div class="row row-cols-2 justify-content-evenly my-3 mx-auto container-fluid">
              <div class="col-5 hover Profile my-3"  v-for="flavor in FlavorProfile">
                <h6 @click="selectFlavorProfile('Add', FlavorProfile.indexOf(flavor))" :title="flavor.Description">{{flavor.Profile}}</h6>
              </div>
            </div>

            <div class="Horizontal-Gradient-Line my-4"></div>

          <div class="row row-cols-3 justify-content-evenly my-3 mx-auto">
            <div class="col-3 Flavor hover">
              <p @click="selectFlavorProfile('Remove', 0)" v-if="EnteredFlavorProfiles.length >= 1">{{EnteredFlavorProfiles[0].Profile}}</p>
            </div>

            <div class="col-3 Flavor hover">
              <p @click="selectFlavorProfile('Remove', 1)" v-if="EnteredFlavorProfiles.length >= 2">{{EnteredFlavorProfiles[1].Profile}}</p>
            </div>

            <div class="col-3 Flavor hover">
              <p @click="selectFlavorProfile('Remove', 2)" v-if="EnteredFlavorProfiles.length >= 3">{{EnteredFlavorProfiles[2].Profile}}</p>
            </div>
          </div>

<!--          <div class="mt-4">-->

<!--            <h5>Table of flavor profiles</h5>-->
<!--            <table class="mx-auto  table table-bordered text-center">-->
<!--              <thead>-->
<!--                <tr>-->
<!--                  <th scope="col">Flavor</th>-->
<!--                  <th scope="col">Enhancer</th>-->
<!--                  <th scope="col">Balancer</th>-->
<!--                </tr>-->
<!--              </thead>-->
<!--              <tbody>-->
<!--                <tr>-->
<!--                  <td>Sweet</td>-->
<!--                  <td>Salty</td>-->
<!--                  <td>Bitter/Spicy</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>Sour</td>-->
<!--                  <td>-</td>-->
<!--                  <td>Sweet</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>Boozy</td>-->
<!--                  <td>-</td>-->
<!--                  <td>Sweet/Bitter</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>Bitter</td>-->
<!--                  <td>-</td>-->
<!--                  <td>Salty</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>Umami</td>-->
<!--                  <td>Sour</td>-->
<!--                  <td>-</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>Salty</td>-->
<!--                  <td>Sweet/Sour</td>-->
<!--                  <td>Bitter</td>-->
<!--                </tr>-->
<!--              </tbody>-->
<!--            </table>-->
<!--          </div>-->

        </div>

        <div class="col-12 col-md-5 mb-4 p-2 ">
          <h3>What occasion is this drink for?</h3>
          <h6>Although this is optional, this will help others find exactly what they're looking for which
          may also give you a higher rating!</h6>
          <div class="Horizontal-Gradient-Line my-3"></div>
          <div class="row row-cols-2 text-center justify-content-evenly">
            <div class="col-5 Occasion my-5" v-for="item in Occasion" :class="item.isActive && 'OccasionActive'">
              <div @click="selectOccasion(Occasion.indexOf(item))">
                <h3>{{item.Name}}</h3>
              </div>
              <input v-if="item.Name === 'Other' && item.isActive" type="text" class="form-control my-2" maxlength="20" placeholder="Enter Occasion (optional)">
            </div>
          </div>
        </div>

      </div>
    </swiper-slide>

    <swiper-slide >
      <div class="Slide">
        <div class="container-fluid row">
          <div class="col-12 col-md-5">
            <h3>Ingredient Station</h3>
            <p>Here, you can enter an ingredient, the amount of the ingredient, as well as other information such as if
            the ingredient is alcoholic (as well as it's ABV % or Proof)</p>


            <div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Ingredient</span>
                </div>
                <input type="text" class="form-control">
              </div>

              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Measurement</span>
                </div>
                <input type="number" class="form-control">
                <select name="" id="" class="mx-2">
                  <option value="disabled-unit" disabled selected="selected">Select Unit</option>
                  <option value="n/a">N/A</option>
                  <option value="Dash">Dash</option>
                  <option value="Splash">Splash</option>
                  <option value="tsp">Tsp.</option>
                  <option value="tbsp">Tbsp.</option>
                  <option value="Shot">Shot</option>
                  <option value="cup">Cup</option>
                  <option value="pint">Pint</option>
                  <option value="qt">Quart</option>
                  <option value="gal">Gallon</option>
                </select>
              </div>
            </div>

          </div>

          <div class="col-12 col-md-5">

          </div>

        </div>
      </div>
    </swiper-slide>

    <swiper-slide >
      <div class="Slide">
        Hi
      </div>
    </swiper-slide>

  </Swiper>


</template>


<style scoped>

.Border{
  border: 1px black solid;
}

.hover:hover{
  cursor: pointer;
}

.Horizontal-Gradient-Line{
  width: 85%;
  border-image: linear-gradient(30deg, #F166B3, #6254C9) 4;
  border-bottom: 3px solid transparent;
  margin: 0 auto;
}

.Flavor{
  border: 1px black solid;
  min-height: 1em;
}

.Profile{
  border-image: linear-gradient(30deg, #F166B3, #6254C9) 4;
  border-bottom: 2px solid transparent;
}

.Occasion{
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  aspect-ratio: 1/.4;
}

.Occasion div{
  height: 100%;
}

.Occasion:hover{
  cursor: pointer;
}



.OccasionActive{
  box-shadow: inset 0 0 4px #000000;
}



</style>
