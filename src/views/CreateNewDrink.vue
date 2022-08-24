<script setup>
import fire from '../../Firebase.js';
import { volume } from 'units-converter';
import uniqid from "uniqid";



import {reactive, ref} from "vue";
import {getAuth} from "firebase/auth";
import router from "../router";

let Instructions = ref("");

let DrinkName = ref("");

let DrinkImage = ref("");

let ClickAddIngredient = ref(false);

let Loading = ref(false);

let isAlcoholic = ref(false);

let ABV = ref(0.0);

let Unit = ref("");

let Amount = ref(undefined);

let Ingredient = ref("");

let Percent = ref(undefined);

let ValidForAlcohol = ref(false);

let SendImage = ref();

let ErrorMessage = ref("");

let Ingredients = reactive([]);


Instructions.value.trim();

function DisplayImage(e){
  SendImage.value = e.target.files[0];

  DrinkImage.value = URL.createObjectURL(SendImage.value);
}

function ClearInputs(){
  Unit.value = "";
  Amount.value = undefined;
  Ingredient.value = "";
  ValidForAlcohol.value = false;
  Percent.value = undefined;
  ErrorMessage.value = "";
  isAlcoholic.value = false;
  ClickAddIngredient.value = false;

}

function AddIngredient(){
  ValidForAlcohol.value = false;

  if(Ingredients.length !== 15){
    if(Unit.value && !Amount.value){
      ErrorMessage.value = "Must enter a valid amount";
    }else if(isAlcoholic.value && (!Percent.value || !Unit.value || !Amount.value)){
      ErrorMessage.value = "If this ingredient contains alcohol, be sure to enter a valid amount of this ingredient, " +
          "a valid measurement(Can't choose 'N/A' or 'Part'), and a valid ABV % (Percent)."
    }else if(isAlcoholic.value && Unit.value === "Part"){
      ErrorMessage.value = "An alcoholic ingredient with the unit 'Part' will not be factored into the ABV % as it will not be accurate";
    }else if(Ingredient.value && !Amount.value){
      ErrorMessage.value = "Must enter a valid amount";
    }else if(Percent.value > 100 || Percent.value < 0){
      ErrorMessage.value = "Percentage must be more than 0 and less than or equal to 100";
    }else if(Amount.value > 200 || Amount.value < 0){
      ErrorMessage.value = "The amount of this ingredient can only be from 0 to 200!"
    }else if(isNaN(Amount.value) || typeof Amount.value !== 'number'){
      ErrorMessage.value = "Must enter a valid number: numbers 0-9 and one decimal allowed";
    }else if(!Ingredient.value){
      ErrorMessage.value = "Must enter a name for the ingredient";
    }else{
      if(isAlcoholic.value){
        ValidForAlcohol.value = true;
      }



      let IngredientObject = {

        ...(Amount.value && Amount.value > 0) && {
          Amount: Amount.value,
          ...Unit.value && {
            Unit: Unit.value
          }

        },
        ...ValidForAlcohol.value && {
          Percent: Percent.value
        },

        Ingredient: Ingredient.value.trim()

      }

      Ingredients.push(IngredientObject);
      getABV();
    }
  }else{
    ErrorMessage.value = "Can't have more than 15 ingredients";
  }


}

function EditIngredient(index){

  Ingredient.value = Ingredients[index].Ingredient;
  Amount.value = Ingredients[index].Amount;

  if("Unit" in Ingredients[index]){
    Unit.value = Ingredients[index].Unit;
  }

  if("Percent" in Ingredients[index]){
    isAlcoholic.value = true;
    Percent.value = Ingredients[index].Percent;
  }

  ClickAddIngredient.value = true;



  Ingredients.splice(index, 1);

}

function RemoveIngredient(index){
  Ingredients.splice(index, 1);
  getABV();
}

function getABV(){
  let total = 0;
  let AlcTotal = 0;


  Ingredients.forEach((item)=>{
    //If there's a unit in this item
    if(item.Unit && item.Amount){
      let Converted;

      switch (item.Unit){
        case "Dash":
          Converted = 0;
          break;

        case "Splash":
          Converted = 0;
          break;

        case "Shot":
          Converted = 1.5;
          break;

        case "Fifth":
          Converted = 25.6;
          break;

        case "pt":
          Converted = 16;
          break;


        default:
          Converted = volume(item.Amount).from(item.Unit).to('fl-oz').value;
          break;
      }

      total += Converted;

      if(item.Percent){
        AlcTotal += (item.Percent/100)*Converted;
      }

    }
  })

  if(total && AlcTotal){
    ABV.value = (AlcTotal/total)*100;
  }else{
    ABV.value = 0;
  }
  ClearInputs();


}


function PostDrink(){

  if(DrinkName.value){

    if(Instructions.value){

      if(Ingredients.length >= 2){
        let ID = uniqid();
        let DrinkObject = {
          ...SendImage.value && {
            strDrinkThumb: SendImage.value
          },
          strDrink: DrinkName.value,
          Ingredients: Ingredients,
          ABV: ABV.value,
          Instructions: Instructions.value,
          Creator: getAuth().currentUser.uid,
          idDrink: ID
        }

        fire.PostDrink(DrinkObject);

        Loading.value = true;

        setTimeout(()=>{
          router.push('/socialHub');
        },1000);

      }else{
        ErrorMessage.value = "Must have 2-15 ingredients!"
      }

    }else{
      ErrorMessage.value = "Don't forget to put some instructions!"
    }


  }else{
    ErrorMessage.value = "Don't forget to enter a name for your drink!"
  }




}


</script>

<template>


  <div class="Black-Overlay" v-if="ClickAddIngredient" @click="getABV()"></div>

  <div class="Black-Overlay" v-if="Loading"></div>

  <div id="Error" v-if="ErrorMessage">
    <p>{{ErrorMessage}}</p>
    <button @click="ErrorMessage = ''">Okay</button>

  </div>

  <div id="Enter-Ingredient-Pop-Up" class="Pop-Up-Md" v-if="ClickAddIngredient">
    <div class="btn-close mt-3 ml-3" @click="getABV()"></div>
    <input type="text" class="simple-input-md mt-5" placeholder="Ingredient Name" v-model="Ingredient" autofocus maxlength="20">
    <br>

    <div class="row my-3 justify-content-center">

      <div class="d-flex justify-content-center col-md-4 col-12">
        <input type="number" class="simple-input-sm-left-radius" placeholder="Amount" v-model="Amount" maxlength="5">
        <select id="Unit" v-model="Unit">
          <option value="">N/A</option>
          <option value="Dash">Dash</option>
          <option value="Splash">Splash</option>
          <option value="tsp">Tsp</option>
          <option value="Tbs">Tbs</option>
          <option value="fl-oz">Fl-oz</option>
          <option value="Shot">Shot</option>
          <option value="cup">Cup</option>
          <option value="pt">Pint</option>
          <option value="Fifth">Fifth</option>
          <option value="qt">Quart</option>
          <option value="gal">Gallon</option>
        </select>
      </div>

      <div class="col-md-4 col-12 mt-3 mt-md-0">
        <div class="d-flex align-items-center justify-content-center">
          <p class="mr-2 mt-3 col-md-6">Alcoholic?</p>
          <div @click="isAlcoholic = true;" :class="isAlcoholic && 'Active-Alcoholic-Button'" class="Alcoholic-Button Hover" id="Yes-Button">
            <p class="mt-2"><b>Yes</b></p>
          </div>
          <div @click="isAlcoholic = false;" :class="!isAlcoholic && 'Active-Alcoholic-Button'" class="Alcoholic-Button Hover" id="No-Button">
            <p class="mt-2"><b>No</b></p>
          </div>
        </div>
      </div>

      <div class="col-md-12 col-10 mt-4 text-center" v-if="isAlcoholic">
          <input class="simple-input-sm" type="number" placeholder="ABV %" v-model="Percent" maxlength="5">
          <br>
          <p class="mt-2"><b>Note:</b> ABV % = Proof / 2</p>
      </div>

    </div>



    <button id="Add-Ingredient" class="my-3 p-1" @click="AddIngredient">Add Ingredient</button>


  </div>

  <div class="container-fluid row justify-content-evenly mx-auto">

    <div class="col-md-4 col-12 text-center ">
      <h4 @click="ClickAddIngredient = true;">General Information</h4>
      <input type="text" class="simple-input" placeholder="Drink Name" maxlength="20" v-model="DrinkName">
      <br>
      <textarea maxlength="150" id="Instruction-Text-Area" class="my-4 p-2" placeholder="Instructions" v-model="Instructions">

      </textarea>
      <p>{{Instructions.length}}/150</p>
      <div class="mb-5 d-flex align-items-center justify-content-center Hover" id="Image-Container" :class="DrinkImage && 'Hide-Shadow'">
        <div v-if="DrinkImage" @click="DrinkImage = ''" >
          <img :src="DrinkImage" class="img-fluid" alt="">
        </div>

        <div v-else class="d-flex align-items-center Hover">
          <label class="d-flex align-items-center">
            <h2 class="mr-2">Add Image</h2>
            <input @change="DisplayImage" type="file" style="display: none;" accept="image/*">
            <img src="../assets/Icons/AddImage.png" class="img-fluid icon-sm" alt="">
          </label>

        </div>
      </div>
    </div>

    <div class="col-md-4 col-12 text-center ">
      <h4>Ingredients</h4>
      <div v-if="Ingredients.length < 15" class="false-simple-input mx-auto text-start pt-2 Hover" @click="ClickAddIngredient = true;"><h5 >Enter Ingredient</h5></div>
      <div v-else class="false-simple-input mx-auto text-start pt-2 " disabled="disabled"><h5 >Enter Ingredient</h5></div>
      <h4 v-if="Ingredients.length" class="my-2">Current ABV: {{ABV.toFixed(2)}}%</h4>
      <div id="Ingredients" class="my-4">
        <div v-if="Ingredients.length" class="mx-auto my-3 " >
          <div v-for="ingredient in Ingredients" >
            <div class="col-md-10 col-11 mx-auto d-flex align-items-center justify-content-between px-2">
              <div class="col-4" style="word-wrap: break-word">
                <p ><b>{{ingredient.Ingredient}}</b><span v-if="ingredient.Percent">({{ingredient.Percent}}%)</span></p>
              </div>

              <p>{{ingredient.Amount}} {{ingredient.Unit}}</p>
              <div class="pb-3 d-flex align-items-center">
                <img @click="EditIngredient(Ingredients.indexOf(ingredient))"  src="../assets/Icons/EditButton.png" class="mr-3 img-fluid icon-xs Hover" alt="">
                <img @click="RemoveIngredient(Ingredients.indexOf(ingredient))" src="../assets/Icons/TrashButton.png" class="img-fluid icon-xs Hover" alt="">
              </div>

            </div>
          </div>

        </div>
        <div v-else class="col-10 mx-auto my-5">
          <h5>No ingredients added yet!</h5>
          <img src="../assets/StockImage_2.png" class="img-fluid" alt="">
        </div>
      </div>


    </div>

    <div class="col-md-2 text-center p-3">
      <div class="row">
        <h3 class="col-6 col-md-12 P-Hover mb-3" @click="PostDrink">Post</h3>
        <h3 class="col-6 col-md-12 P-Hover">Save Draft</h3>
      </div>

    </div>
  </div>


</template>


<style scoped>


#Instruction-Text-Area{
  resize: none;
  width: 80%;
  border-radius: 1em;
  border: none;
  height: 4em;
}

#Ingredients{
  border-left: 1px #D9D9D9 solid;
  border-right: 1px #D9D9D9 solid;
  max-height: 30em;
}



#Unit{
  border-top-right-radius: 20em;
  border-bottom-right-radius: 20em;
  max-height: 3em;
}


.Alcoholic-Button{
  height: 3em;
  width: 4em;
}


#Yes-Button{
  border-left: black solid 1px;
  border-top: black solid 1px;
  border-bottom: black solid 1px;
  border-top-left-radius: 20em;
  border-bottom-left-radius: 20em;
}

#No-Button{
  border-right: black solid 1px;
  border-top: black solid 1px;
  border-bottom: black solid 1px;
  border-top-right-radius: 20em;
  border-bottom-right-radius: 20em;
}

#Add-Ingredient{
  border: 1px black solid;
  border-radius: 1em;
}

#Add-Ingredient:active{
  background-color: black;
  color: white;

}

#Image-Container{
  max-height: 20em;
  min-height: 5em;
  box-shadow: rgba(0, 0, 0, 0.2) 0 12px 12px 0 inset;
  border-radius: 1em;
  overflow: hidden;

}

#Error{
  position: fixed;
  margin: 10em auto;
  border: 1px black solid;
  z-index: 2000;
  width: 70%;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
  padding: 2em;
  border-radius: 1em;
  background-color: #D9D9D9;
}

.Hide-Shadow{
  box-shadow: none !important;
}

.Active-Alcoholic-Button{
  color: white;
  background-color: black;
}


</style>
