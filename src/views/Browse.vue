<!--================================================ SCRIPT ======================================================-->

<script setup>
//Imports
import {reactive, ref} from "vue";

//Misc
window.scrollTo(0, 0);


//API Links
const multipleIngredientUrl = "https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=";
const randomDrinkURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const getByIdURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";


//I/O Refs
let showSpecificDrinkInfo = ref(false);
let showInstructions = ref(false);
let shownRandom = ref(0);
let enteredIngredient = ref("");
let doesNotExist = ref(false);


//Arrays
let ingredientsEntered = reactive([]); //User-entered ingredients
let listOfDrinks = reactive([]); //Shown in the display of displayed drinks
let randomRewind = reactive([]); //The array that allows a back button for random cocktails
let specificDrinkInformation = reactive([]);


//Functions
function getRandomCocktail(){

  //1. Fetch the information using the 'randomDrinkURL'
  fetch(randomDrinkURL)
      .then((result)=>{
        return result.json();
      })
      .then((Data)=>{ //Beginning of 'Data' from API
        let drinks = Data.drinks[0];
        let arrayLength = randomRewind.length;


        //2. Before cleaning the data, make sure the 'randomRewind' array has anything
        //Example: [1] => [2, 1] => [3, 2] => [4, 3]
        switch (arrayLength){
          case 0:
            randomRewind.push(drinks);
            break;
          case 1:
            randomRewind.unshift(drinks);
            shownRandom.value = 0;
            break;
          case 2:
            randomRewind.pop();
            randomRewind.unshift(drinks);
            shownRandom.value = 0;
            break;
        }

      }); //Ending of 'Data' from API
} //This gets a random cocktail to display

function cleanAPIObjects(uncleanData){

  let keys = Object.keys(uncleanData);
  let cleanData = [];
  let arrayOfMeasurements = [];

  //Gets rid of unnecessary values within the drink data
  keys.forEach((key)=>{
    if(uncleanData[key] === null || uncleanData[key] === ""){
      delete uncleanData[key];
    }
  });

  //Next, the information will be divided up into categories: measurements
  for(let i = 1; i <= 15; i++){
    let mes = 'strMeasure'+i.toString();
    let ing = 'strIngredient'+i.toString();

    if(ing in uncleanData){
      if(uncleanData[mes] === undefined){
        uncleanData[mes] = "";
      }
      //Adds to 'arrayOfMeasurements'
      arrayOfMeasurements.push({Ing: uncleanData[ing], Mes: uncleanData[mes]});
      delete uncleanData[ing];
      delete uncleanData[mes];
    } //End of 'ing in uncleanData' if statement
  }
    cleanData.push(uncleanData);
    cleanData.push(arrayOfMeasurements);


  return cleanData;
} //Gets rid of unnecessary keys with null or empty values and makes categories for drink information

function getListOfDrinks(action){
  doesNotExist.value = false;
  //Removes random drink from display and clears list of drinks
  listOfDrinks.length = 0;
  randomRewind.length = 0;

  switch (action){
    case 'add':
      //Add ingredient to the 'ingredientsEntered' array
      ingredientsEntered.push(enteredIngredient.value);

      //Reset the input
      enteredIngredient.value = "";
      getDrinks(ingredientsEntered.toString());
      break;

      case 'remove':
        if(ingredientsEntered.length !== 0){
          getDrinks(ingredientsEntered.toString());
        }else{
          ingredientsEntered.length = 0;
          shownRandom.value = 0;
          getRandomCocktail();
        }

        break;
  }


  //A function to get the drinks from the API
  function getDrinks(urlAddon){
    let url = multipleIngredientUrl+urlAddon;

    fetch(url)
      .then((result)=>{
        return result.json();
      })
      .then((Data)=>{

        if(Data.drinks === 'None Found'){
          doesNotExist.value = true;
        }else{
          //Populate the list of drinks
          for(let i of Data.drinks){
            listOfDrinks.push(i);
          }
        }

      })
      .catch((err)=>{
        listOfDrinks.length = 0;
        alert("There seems to be a problem: " + err.message+". Refresh your browser or try again!");
      })
  }


} //Gets a list of drinks once the user enters an ingredient

function clickOnSpecificDrink(id){

  //Set the array to have nothing in it, so it doesn't stack
  specificDrinkInformation.length = 0;
  showInstructions.value = false;



  //Gets the specific drink information and fills 'specificDrinkInformation' with it
  function getDrinkInfo(){
    fetch(getByIdURL+id.toString())
      .then((result)=>{
        return result.json();
      })
      .then((Data)=>{
        let drink = cleanAPIObjects(Data.drinks[0]);
        specificDrinkInformation.push(...drink);
      })
  }

  //Calls the function above
  getDrinkInfo();

  //Allows for the specific information to pop up on the window
  if(showSpecificDrinkInfo.value){
    showSpecificDrinkInfo.value = false;
    setTimeout(()=>{
      showSpecificDrinkInfo.value = true;
    }, 700);
  }else{
    setTimeout(()=>{
      showSpecificDrinkInfo.value = true;
    }, 200);

  }

} //Gets specific information on the drink that was selected

function deleteIngredient(index){
  ingredientsEntered.splice(index, 1);
  getListOfDrinks('remove');
} //Deletes an ingredient from the stack of enteredIngredients

function clearAll(){
  specificDrinkInformation.length = 0;
  listOfDrinks.length = 0;
  ingredientsEntered.length = 0;
  enteredIngredient.value = "";
  getRandomCocktail();
}

//Initial start-up functions
getRandomCocktail();



</script>










<!--================================================== HTML ======================================================-->

<template>

  <div v-if="showSpecificDrinkInfo && specificDrinkInformation.length !== 0" @click="showSpecificDrinkInfo = !showSpecificDrinkInfo" class="Black-Overlay"></div>

  <div id="View"> <!-- Beginning of the View -->


    <!--Overlays-->
    <Transition name="bounce">
      <div v-if="showSpecificDrinkInfo && specificDrinkInformation.length !== 0" class="Specific-Drink-Info-Display">
        <h1 >{{specificDrinkInformation[0].strDrink}}</h1>
        <div class="Specific-Drink-Info">
          <div class="Specific-Drink-Image">
            <img :src="specificDrinkInformation[0].strDrinkThumb" alt="">
            <p v-if="showInstructions" class="CloseP" @click="showInstructions = !showInstructions">Hide Instructions</p>
            <p v-else @click="showInstructions = !showInstructions" class="CloseP">Show Instructions</p>
            <p class="CloseP" @click="showSpecificDrinkInfo = !showSpecificDrinkInfo">Close</p>
          </div>

          <!-- Left-Right-Ingredient -->
          <div v-if="!showInstructions"  class="Specific-Drink-Ingredients">

            <div  v-for="item in specificDrinkInformation[1]" class="Specific-Ingredients">
              <h2>{{item.Ing}}</h2>
              <p>{{item.Mes}}</p>
            </div>
          </div>

          <div v-else class="Specific-Drink-Instructions">
            <h2>{{specificDrinkInformation[0].strInstructions}}</h2>
          </div>

        </div>
      </div>
    </Transition>



    <!-- Constant Content -->
    <div class="Content" style="text-align: center;"> <!--Beginning of Web-Content-->

      <div class="Input-Ingredient-Display">
        <input maxlength="30" @keydown.enter="getListOfDrinks('add')" type="text" v-model="enteredIngredient" class="Ingredient-Input"
               placeholder="Enter Ingredient">
        <div class="Ingredient-Display">
          <TransitionGroup name="bounce">
            <div @click="deleteIngredient(ingredientsEntered.indexOf(ing))" v-if="ingredientsEntered.length !== 0" v-for="ing in ingredientsEntered" class="Ingredient-Entered">
              <p>{{ing}}</p>
            </div>
          </TransitionGroup>


        </div>
      </div> <!-- Ending of 'Input-Ingredient-Display -->


      <!-- Shows the Drinks -->
      <div v-if="listOfDrinks.length !== 0" class="List-Of-Drinks-Display">
        <div class="List-Of-Drinks">
          <div @click="clickOnSpecificDrink(drink.idDrink)" v-if="listOfDrinks.length !== 0" v-for="drink in listOfDrinks" class="Drink-Item">
            <p v-if="drink.strDrink" :class="drink.strDrink.length > 30 && 'MakeTextSmaller'">{{drink.strDrink}}</p>
            <img v-if="drink.strDrinkThumb" :src="drink.strDrinkThumb" alt="">
          </div>
        </div>
      </div>

      <div v-else class="Random-Cocktail-Display" v-if="randomRewind.length !== 0">
        <div class="Random-Cocktail" >
          <div>
            <h1>{{randomRewind[shownRandom].strDrink}}</h1>
            <img @click="clickOnSpecificDrink(randomRewind[shownRandom].idDrink)" :src="randomRewind[shownRandom].strDrinkThumb" alt="">
            <br>
            <div class="Random-Buttons">
                <div>
                  <img alt="" src="../assets/Icons/FastForward.png" id="Rewind" v-if="randomRewind.length === 2 && shownRandom === 0" @click="shownRandom = 1">
                </div>
                <div>
                  <button @click="getRandomCocktail">Random Cocktail</button>
                </div>
                <div>
                  <img id="FastForward" src="../assets/Icons/FastForward.png" alt="" v-if="randomRewind.length === 2 && shownRandom === 1" @click="shownRandom = 0">
                </div>

            </div>


          </div>
        </div>
      </div>

      <div style="color: white; margin-top: 20em;" v-if="doesNotExist">
        <h2>That doesn't exist!</h2>
      </div>

    </div> <!--Ending of Web-Content-->

  </div> <!-- Ending of the View -->


</template>










<!--================================================== STYLING ====================================================-->

<style scoped>

/* Full Content */
.Content{
  display: grid;
  grid-template-columns: 50% 50%;
  margin: 0 auto 3em auto;

}



/* Black-Overlay */
.Black-Overlay{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: 100em;
  height: 100em;
  background: rgba(0, 0, 0, .7);
}


/*--------------------------------------------------- Specific Drink Display ----------------------------------------*/
.Specific-Drink-Info-Display{
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

.Specific-Drink-Info{
  display: grid;
  grid-template-columns: 50% 50%;
  width: 100%;
  height: 25em;
  margin: 1em auto;
}

.Specific-Drink-Image{
  width: 100%;
  height: auto;
  margin:  0 auto;
}

.Specific-Drink-Image img{
  width: 22em;
  height: auto;
  margin-top: 1em;
  border-radius: 1em;
  box-shadow: 6px 6px 8px #171717;
}

.Specific-Drink-Ingredients{
  display: grid;
  grid-template-columns: 49% 49%;
  width: 90%;
  gap: .3em;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 25em;

}

.Specific-Drink-Ingredients::-webkit-scrollbar, .Specific-Drink-Instructions::-webkit-scrollbar{
  width: .7em;
  box-shadow: inset 0 0 3px #000000;
  border-radius: 3px;
}

.Specific-Drink-Ingredients::-webkit-scrollbar-thumb, .Specific-Drink-Instructions::-webkit-scrollbar-thumb{
  background-color: white;
  border-radius: 3px;
}

.Specific-Ingredients{
  border: 1px white solid;
  border-radius: 1em;
  height: 6em;
}

.Specific-Ingredients h2{
  margin-bottom: 0;
}

.Specific-Ingredients p {
  margin-top: .2em;
}

.Specific-Drink-Instructions{
  width: 90%;
  height: 15em;
  overflow-y: scroll;
  overflow-x: hidden;
}


/*--------------------------------------------------- Ingredient Display -------------------------------------------*/
.Input-Ingredient-Display{
  height: fit-content;
  color: white;
  border-radius: 1em;
  width: 95%;
  margin: 7em auto 0 auto;
  padding: .5em;
  box-sizing: content-box;
  overflow: hidden;
  background: linear-gradient(30deg, #F166B3, #6254C9);
}

.Ingredient-Display{
  object-fit: contain;
  max-height: 20em;
  border: 1px white solid;
  margin: 1em auto;
  border-radius: 1em;
  padding: 1em;
  display: grid;
  grid-template-columns: 50% 50%;
  gap: .2em;
  box-shadow: inset 0 0 1em #000000;
  justify-content: center;
  text-align: center;
  background-color: #2C2C2C;
  overflow-x: hidden;
  overflow-y: scroll;
}

.Ingredient-Display::-webkit-scrollbar{
  display: none;
}

.Ingredient-Entered{
  border: 1px white solid;
  height: 3em;
  width: 90%;
  border-radius: 1em;
  background: linear-gradient(30deg, #F166B3, #6254C9);
  box-shadow: 6px 6px 8px #171717;
  margin: 0 auto;
}

.Ingredient-Entered:hover{
  cursor: pointer;
}



/*--------------------------------------------------- List of Drinks Displayed --------------------------------------*/
.List-Of-Drinks-Display{
  margin: 7em auto 0 auto;
  height: 35em;
  width: 98%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.List-Of-Drinks-Display::-webkit-scrollbar{
  width: .7em;
  box-shadow: inset 0 0 3px #000000;
  border-radius: 3px;
}

.List-Of-Drinks-Display::-webkit-scrollbar-thumb{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  border-radius: 3px;
}

.List-Of-Drinks{
  display: grid;
  grid-template-columns: 33.3333% 33.3333% 33.3333%;
  row-gap: 1em;
  width: 95%;
  margin: 0 auto;
}

.Drink-Item{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  width: 95%;
  height: 17em;
  border-radius: 1em;
  color: white;
}

.Drink-Item img{
  width: 90%;
  height: auto;
  border-radius: 1em;
}

.Drink-Item:hover{
  cursor: pointer;
}



/*--------------------------------------------------- Random Display -----------------------------------------------*/
.Random-Cocktail-Display{
  margin: 7em auto 0 auto;
  border-radius: 1em;
  width: 98%;
  background: linear-gradient(30deg, #F166B3, #6254C9);
  text-align: center;
  justify-content: center;

}

.Random-Cocktail{
  color: white;
}

.Random-Cocktail img{
  width: 90%;
  height: auto;
  border-radius: 1em;
}

.Random-Cocktail img:hover{
  cursor: pointer;
}

.Random-Cocktail button{
  height: 3em;
  width: 80%;
  margin: 0 auto 1em auto;
  border-radius: 1em;
  border: none;
  text-align: center;

}

.Random-Cocktail h1{
  margin-top: 0;
}

.Random-Buttons{
  display: grid;
  width: 90%;
  margin: .5em auto 0 auto;
  grid-template-columns: 33.3333% 33.3333% 33.3333%;
  justify-content: center;
  text-align: center;
}


#Rewind, #FastForward{
  width: 3em;
}

#Rewind{
  transform: scale(-1);
}



/*--------------------------------------------------- Inputs -----------------------------------------------------*/
.Ingredient-Input{
  height: 3em;
  width: 80%;
  border: none;
  border-radius: 1em;
  font-size: 1.2em;
  padding: 0;
  font-weight: bold;
  text-align: center;
}


/*Tags*/
label{
  color: white;
}

/*Misc Styling */

.CloseP:hover{
  text-decoration: underline;
  cursor: pointer;
}
.MakeTextSmaller{
  font-size: 12px;
}



/*Animations*/
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






@media screen and (min-width: 0) and (max-width: 600px){
  .Content{
    display: block;
  }


  .Specific-Drink-Info-Display{
    background: linear-gradient(30deg, #F166B3, #6254C9);
    width: 80%;
    top: 6em;
    height: 30em;
    margin-left: auto;
    margin-right: auto;
    position: fixed;
    left: 0;
    right: 0;
    color: white;
    border-radius: 1em;
    text-align: center;
    z-index: 30;
    justify-content: center;

  }

  .Specific-Drink-Info-Display h1{
    font-size: 1em;
  }

  .Specific-Drink-Info{
    display: block;
    width: 100%;
    height: 25em;
    margin: 1em auto;
  }

  .Specific-Drink-Image{
    width: 100%;
    height: auto;
    margin:  0 auto;
  }

  .Specific-Drink-Image img{
    width: 30%;
    height: auto;
    margin-top: 1em;
    border-radius: 1em;
    box-shadow: 6px 6px 8px #171717;
  }

  .Specific-Drink-Ingredients{
    display: grid;
    grid-template-columns: 49% 49%;
    width: 90%;
    gap: .3em;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 10em;
    margin: 0 auto;

  }

  .Specific-Drink-Ingredients::-webkit-scrollbar{
    width: .7em;
    box-shadow: inset 0 0 3px #000000;
    border-radius: 3px;
  }

  .Specific-Drink-Ingredients::-webkit-scrollbar-thumb{
    background-color: white;
    border-radius: 3px;
  }

  .Specific-Ingredients{
    border: 1px white solid;
    border-radius: 1em;
    max-height: 5em;
  }

  .Specific-Ingredients h2{
    margin-bottom: 0;
    font-size: .8em;
  }

  .Specific-Ingredients p {
    margin-top: .2em;
  }

  .Specific-Drink-Instructions{
    width: 90%;
    margin: 0 auto;
    font-size: .8em;
    text-align: center;
  }




  .List-Of-Drinks-Display{
    margin: 2em auto 0 auto;
    height: 35em;
    width: 98%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .List-Of-Drinks-Display::-webkit-scrollbar{
    width: .7em;
    box-shadow: inset 0 0 3px #000000;
    border-radius: 3px;
  }

  .List-Of-Drinks-Display::-webkit-scrollbar-thumb{
    background: linear-gradient(30deg, #F166B3, #6254C9);
    border-radius: 3px;
  }

  .List-Of-Drinks{
    display: grid;
    grid-template-columns: 50% 50%;
    row-gap: 1em;
    width: 95%;
    margin: 0 auto;
  }

  .Drink-Item{
    background: linear-gradient(30deg, #F166B3, #6254C9);
    width: 95%;
    height: 15em;
    border-radius: 1em;
    color: white;
  }

  .Drink-Item img{
    width: 90%;
    height: auto;
    border-radius: 1em;
  }

  .Drink-Item:hover{
    cursor: pointer;
  }

}

</style>










