<script setup>
import {reactive, ref} from "vue";
import * as Converter from 'units-converter';
import fire from '../../Firebase.js';
import {useRouter} from "vue-router";
import firebase from "firebase/compat";
import {getAuth} from "firebase/auth";
import {Swiper, SwiperSlide} from "swiper/vue";
import 'swiper/css';


window.scrollTo(0, 0);


//Arrays
let DrinkInformation = reactive([]);
let DrinkIngredients = reactive([]);
let UserInfo = reactive([]);

//References
let PercentOrProof = ref("");
let Percent = ref(0);
let Ingredient = ref("");
let Measurement = ref(null);
let Unit = ref("fl-oz");
let Alcoholic = ref(false);
let drinkImage = ref();
let displayImage = ref();
let popUp = ref("");
let editItem = ref(false);

//General Info
let DrinkName = ref("");
let Description = ref("");
let ABV = ref(0);


const router = useRouter();

fire.onAuthStateChanged(fire.getAuth(), ()=>{
  if(fire.getAuth().currentUser){
    UserInfo.length = 0;

    //Gets the user information
    const getUserInfo = firebase.database().ref();
    getUserInfo.child("users").get()
        .then((snapshot)=>{
          snapshot.forEach((user)=>{
            if(user.key === getAuth().currentUser.uid){
              UserInfo.push(user.val());

              return 0;
            }
          });
        });
  }
});


//Functions
function validateIngredient(){

  let valid = true;
  //First, make sure everything in the non-Alc is proper
  if(Ingredient.value.trim() && Measurement.value >= 0 && Measurement.value <= 900){

    if(Alcoholic.value){
      if(!Percent.value && !PercentOrProof.value && !Unit.value && !Percent.value >=0 ){
        valid = false;
        popUp.value = "Looks like you forgot the Unit, ABV/Proof, or the %/Proof fields!";
      }
    }

  }else{
    valid = false;
    if(!Ingredient.value.trim()){
      popUp.value = "Be sure to enter the name of the ingredient";
    }else{
      popUp.value = "Measurement can only be 0-900";
    }

  }

  return valid;

}

//Add the ingredient to the list of Ingredients as an object
function addIngredient(){
  editItem.value = false;

  if(DrinkIngredients.length <= 15){
    //If the ingredient is alcoholic, then these fields MUST be filled out to get the ABV
    if(validateIngredient()){
      //Object of ingredient
      DrinkIngredients.push({
        Ingredient: Ingredient.value,
        Measurement: Measurement.value,
        ...Unit.value !== "" &&{
          Unit: Unit.value
        },
        Alcoholic: Alcoholic.value,
        ...Alcoholic.value === true && {
          Percent: Percent.value,
          PercentOrProof: PercentOrProof.value
        }
      });
      //Gets the ABV
      if(Unit.value !== "splash"){
        getABV();
      }

      //Clears all inputs
      clearAllFields();
    }
  }else{
    popUp.value = "Custom drinks must have only 2-15 ingredients total!"
  }



}

//Remove an Ingredient
function removeIngredient(index){
  DrinkIngredients.splice(index, 1);
  getABV();
  if(DrinkIngredients.length === 0 ){
    ABV.value = 0;
  }
}

//Edit an ingredient
function editIngredient(index){
  //Gets the ingredient the user wants to edit
  let editedIngredient = DrinkIngredients[index];

  editItem.value = true;

  //This section populates all the inputs of what the user wanted to edit
  Ingredient.value = editedIngredient.Ingredient;
  Alcoholic.value = editedIngredient.Alcoholic;

  //Only populate unit and measurement if the Measurement isn't null
  if(Measurement.value){
    Measurement.value = editedIngredient.Measurement;
    Unit.value = editedIngredient.Unit;
  }


  //Only add the percent and proof if Alcohol is true
  if (Alcoholic.value === true){
    Percent.value = editedIngredient.Percent;
    PercentOrProof.value = editedIngredient.PercentOrProof
  }

  if(DrinkIngredients.length === 0 ){
    ABV.value = 0;
  }

  //Once all inputs are filled with information of the edited ingredient, the ingredient is taken from the list
  removeIngredient(index);

}

//Get alc %
function getABV(){
  let GrandTotal = 0;
  let AlcoholTotal = 0;
  ABV.value = 0;

  DrinkIngredients.forEach((item)=>{

    //Check if there's even an item with a Measurement at all
    if(item.Unit && item.Measurement){

      //Converts the ingredient to ounces
      let IngredientToOunces = Converter.volume(item.Measurement).from(item.Unit).to('fl-oz').value;

      //Adds to the grand total
      GrandTotal += IngredientToOunces;

      //Get's alcohol number to add to the numerator
      if(item.Alcoholic && item.PercentOrProof && item.Percent){
        let alcNumber = 0;
        switch (item.PercentOrProof ){
          case "Proof":
            console.log(item.Percent);
            alcNumber = ((item.Percent/2)/100) * IngredientToOunces;
            console.log("Proof to Percent: "+alcNumber)
            break;

          case "%":
            alcNumber = (item.Percent/100) * IngredientToOunces;
            break;
        }

        AlcoholTotal += alcNumber;
      }

    }

  })

  if(GrandTotal){
    ABV.value = ((AlcoholTotal/GrandTotal)*100);
  }


}

//Clear all fields when an ingredient is added
function clearAllFields(){
  Percent.value = null;
  PercentOrProof.value = "";
  Alcoholic.value = false;
  Unit.value = 'fl-oz';
  Measurement.value = null;
  Ingredient.value = "";
}

//Posts the drink the user has made
function postDrink(){

//Clears all the previous drink information
  DrinkInformation.length = 0;

  //Drink name can't be empty
  if(DrinkName.value.trim()){

    //Description can't be empty
    if(Description.value.trim()){

      //Call to the realtime database
      fire.database().ref('users/'+getAuth().currentUser.uid).get()
          .then((result)=>{

            //Fill DrinkInformation with the drink info being posted
            DrinkInformation.push({
              DrinkName: DrinkName.value,
              ABV: ABV.value,
              Description: Description.value,
              UserID: fire.getAuth().currentUser.uid,
              Username: result.val().Username,

              //The Image is optional
              ...drinkImage.value && {
                Image: drinkImage.value
              }
            })
            DrinkInformation.push(DrinkIngredients);
            fire.newDrink(DrinkInformation);

          })
      .then(()=>{

        //Transfers user back to the social hub page
        router.push('/socialHub');
      })
    }else{
      popUp.value = "Don't forget a description or instructions for your drink!"
    }

  }else{
    popUp.value = "Must enter a name for your awesome drink! (It must be at LEAST 3 or more characters)";
  }

}

//Show image when uploading
function showImageToUpload(event){
  drinkImage.value = event.target.files[0];

  displayImage.value = URL.createObjectURL(drinkImage.value);

  console.log(displayImage.value)
}



</script>




<template>


  <div v-if="popUp" class="Error-Pop-Up">
    <p>{{popUp}}</p>
    <button @click="popUp = ''">Close</button>
  </div>



  <div class="New-Drink-Display">

    <div class="Menu-Display">
      <div class="Menu-Options">
        <div @click="postDrink">
          <h2 >Post</h2>
        </div>

        <div>
          <h2>Preview</h2>
        </div>

      </div>
      <div class="ABV-Display">
        <h1>ABV:</h1>
        <h2>{{ABV.toFixed(2)}}%</h2>
      </div>
    </div>

    <div class="Ingredient-Display">
      <div class="Ingredient-Input">
        <div class="Input-Flex">
          <button style="width: 6em;" @click="addIngredient">Add</button>
          <input v-model="Ingredient" class="TextInput" type="text" placeholder="Enter Ingredient">
          <input v-model="Measurement" type="number" max="0" min="100">
          <select v-model="Unit">
            <option></option>
            <option>cup</option>
            <option>fl-oz</option>
            <option>ml</option>
            <option>dash</option>
          </select>

        </div>
        <div style="display: flex; justify-content: center;">
          <div class="Alcoholic-Check-Box" @click="Alcoholic = !Alcoholic" :class="Alcoholic && 'Clicked-Check-Box'" ></div>
          <p class="Label-For-Check-Box" >Alcoholic</p>
        </div>


        <fieldset v-if="Alcoholic" class="Alcoholic-Ingredient-Options">
          <legend>Alcoholic Ingredient Options</legend>
          <div style="display: flex; justify-content: center;">
            <input v-model="Percent"  class="TextInput" type="number" placeholder="Percent/Proof">
            <select v-model="PercentOrProof">
              <option>Proof</option>
              <option>%</option>
            </select>
          </div>

        </fieldset>

        <div class="Ingredient-List-Display">
          <div v-if="DrinkIngredients.length" class="Ingredient" v-for="item in DrinkIngredients">
            <div>
              <h3 style="display: inline-block; margin-left: 1em;">{{item.Ingredient}}<span v-if="item.Percent">({{item.Percent+item.PercentOrProof}})</span></h3>
              <p style="display: inline-block; margin-left: 1em;">{{item.Measurement+" "}}<span v-if="item.Unit"> {{item.Unit}}</span></p>
            </div>
            <div style="display: flex; height: 2em; padding-top: 1em;">
              <button @click="editIngredient(DrinkIngredients.indexOf(item))">Edit</button>
              <button @click="removeIngredient(DrinkIngredients.indexOf(item))">Delete</button>
            </div>
          </div>
        </div>

      </div>

    </div>

    <div class="General-Information-Display">
      <input v-model="DrinkName" class="TextInput" type="text" placeholder="Drink Name">
      <br>
      <textarea v-model="Description" maxlength="500" class="Instructions" placeholder="Instructions"></textarea>
      <br>
      <p :class="Description.length === 500 && 'Reached-Word-Limit'" style="color: white">{{Description.length}}/500</p>
      <br>
      <div>
        <input style="color: white;" type="file" @change="showImageToUpload" accept="image/*">
        <button @click="drinkImage = ''">Clear Image</button>
      </div>
      <div>
        <img style="max-height: 10em; margin: 1em auto;" v-if="displayImage" :src="displayImage" alt="">
      </div>

    </div>

  </div>


  <div class="Phone-Display">
      <Swiper style="margin-top: 7em;" :slides-per-view="1">
        <SwiperSlide>
          <div class="Phone-Ingredient-Display">
            <input v-model="DrinkName"  class="Phone-Input" type="text" placeholder="Drink Name">
            <textarea v-model="Description" class="Phone-Instructions" placeholder="Instructions"/>
            <div v-if="!displayImage">
              <label class="Label" for="file">Choose an Image</label>
              <input id="file" class="File-Input" type="file" @change="showImageToUpload" accept="image/*">
            </div>
            <img :src="displayImage" v-if="displayImage" alt="">
            <button v-if="displayImage" @click="displayImage = ''" class="Delete-Image">Delete Image</button>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div class="Phone-Ingredient-Display">
            <input v-model="Ingredient" class="Phone-Input" type="text" placeholder="Ingredient">
            <p>Measurement:</p>
            <div class="Phone-Measurement-Input">

              <input type="number" placeholder="Amount" v-model="Measurement">
              <select v-model="Unit">
                <option></option>
                <option>cup</option>
                <option>fl-oz</option>
                <option>ml</option>
                <option>dash</option>
              </select>
              <div style="margin-left: .5em;  justify-content: center; text-align: center">
                <p style="margin: 0;">Alcoholic</p>
                <div style=" margin: 0 auto; height: 1em; aspect-ratio: 1/1; border: 1px black solid;" @click="Alcoholic = !Alcoholic" :class="Alcoholic && 'Clicked-Check-Box'" ></div>
              </div>
            </div>
            <div class="Phone-Alcoholic-Menu" v-if="Alcoholic">
              <input v-model="Percent" type="number" placeholder="ABV/Proof">
              <select v-model="PercentOrProof">
                <option>Proof</option>
                <option>%</option>
              </select>
            </div>
            <div class="Phone-Ingredient-Box">
                <div class="Phone-Ingredient" v-if="DrinkIngredients.length" v-for="item in DrinkIngredients">
                  <div class="Phone-Ingredient-Item" @click="editIngredient(DrinkIngredients.indexOf(item))">
                    <p >{{item.Ingredient}}<span v-if="item.Percent">({{item.Percent+item.PercentOrProof}})</span></p>
                  </div>
                </div>
            </div>
            <button @click="addIngredient">Add Ingredient</button>

          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div class="Phone-Ingredient-Display">
            <button @click="postDrink">Post</button>
          </div>
        </SwiperSlide>
      </Swiper>
  </div>

</template>




<style scoped>

.Error-Pop-Up{
  position: fixed;
  top: 15em;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  height: 10em;
  width: 95%;
  background: rgba(0, 0, 0, .8);
  z-index: 10;
  justify-content: center;
  text-align: center;
  color: white;
  border-radius: 1em;
}

.Phone-Display{
  display: none;
}

/*All Content*/
.New-Drink-Display{
  width: 98%;
  height: 37em;
  border-radius: 1em;
  margin: 6em auto 0 auto;
  text-align: center;
  display: grid;
  grid-template-columns: 20% 40% 40%;
}



/*Menu Display*/

.Menu-Display{
  color: white;
}

.Menu-Options div{
  margin: 1em auto 0 auto;
  width: 90%;
  border: 1px white solid;
  color: white;

}

.Menu-Options div:hover{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  cursor: pointer;
}

.ABV-Display{
  color: white;
}




/*Ingredient Display*/
.Ingredient-Display{
  box-shadow: inset 0 0 1em #000000;
  overflow-y: scroll;
  overflow-x: hidden;
  border-top-left-radius: 1em;
  border-bottom-left-radius: 1em;
}

.Ingredient-Display::-webkit-scrollbar{
  width: .7em;
  box-shadow: inset 0 0 3px #000000;
  border-radius: 3px;
}

.Ingredient-Display::-webkit-scrollbar-thumb{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  border-radius: 3px;
}

.Ingredient-Input{
  color: white;
  margin-top: 2em;
}

.Input-Flex{
  display: flex;
  text-align: center;
  justify-content: center;
}

.TextInput{
  width: 15em;
  height: 4em;
  text-align: center;
}

.Alcoholic-Check-Box{
  height: 2em;
  border: 1px white solid;
  width: 2em;
  margin-left: 1em;
  margin-top: 1em;
}

.Alcoholic-Check-Box:hover{
  cursor: pointer;
}

.Label-For-Check-Box{
  margin-left: .5em;
  margin-top: 1.5em;
}

.Clicked-Check-Box{

  animation: animation1 500ms forwards ease;
}

.Alcoholic-Ingredient-Options{
  margin: 1em auto 0 auto;
  height: 5em;
  width: 90%;

}

.Ingredient{
  display: grid;
  grid-template-columns: 80% 20%;
  width: 85%;
  text-align: left;
  justify-content: left;
  border: 1px white solid;
  margin: 1em auto 0 auto;
  background: linear-gradient(30deg, #F166B3, #6254C9);
  border-radius: 1em;
}

.Ingredient-List-Display{
  justify-content: center;
  text-align: center;

}

.Reached-Word-Limit{
  color: red !important;
}

/*Miscs*/
button:hover{
  cursor: pointer;
}

fieldset{
  color: white;
}

textarea{
  resize: none;
  height: 10em;
  width: 90%;
  border-radius: 1em;
  padding: 1em;
  margin: 1em auto;
  font-family: Bahnschrift,serif;
}


/*Animations*/
@keyframes animation1 {
  0%{
    border-radius: 0;
  }
  100%{
    border-radius: 50%;
    border: none;
    background: linear-gradient(30deg, #F166B3, #6254C9);
  }
}


@media screen and (min-width: 0) and (max-width: 600px){
  .Phone-Display{
  display: contents;
  }

  .New-Drink-Display{
    display: none;
  }


  .Phone-Ingredient-Display{
    width: 90%;
    height: 33em;
    margin: 0 auto;
    border-radius: 1em;
    justify-content: center;
    text-align: center;
    padding: 1em;
    box-sizing: border-box;
    background: white;
  }


  .Phone-Input{
    width: 90%;
    text-align: center;
    height: 3em;
    border-radius: 1em;
    border: 1px black solid;

  }



  .Phone-Instructions{
    resize: none;
    width: 85%;
    height: 5em;
    margin-bottom: 1em;
  }

  .File-Input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .Label, .Delete-Image{
    width: 50%;
    color: white;
    font-size: .8em;
    background: linear-gradient(30deg, #F166B3, #6254C9);
    padding: 1em;
    border-radius: 1em;
    display: block;
    margin: 0 auto;
    border: none;
  }

  .Phone-Ingredient-Display p{
    margin: 1em auto .2em auto;
  }


  .Phone-Ingredient-Display img{
    width: 50%;
    max-height: 14em;
    border-radius: 1em;
    border: 1px black solid;
  }

  .Phone-Ingredient-Box{
    width: 95%;
    height: 14em;
    margin: 1em auto;
    box-shadow: inset 0 0 7px #000000;
    overflow-y: scroll;
    overflow-x: hidden;
    justify-content: center;
    text-align: center;
  }

  .Phone-Measurement-Input, .Phone-Alcoholic-Menu{
    display: inline-flex;
    margin: 0 auto 0 auto;
    justify-content: center;
    height: 2.5em;

  }

  .Phone-Measurement-Input input{
    width: 20%;
  }

  .Phone-Alcoholic-Menu{
    margin-top: 1em;
  }

  .Phone-Ingredient-Item{
    color: white;
    height: auto;
    padding: .4em;
    width: 90%;
    box-sizing: border-box;
    margin: .5em auto 0 auto;
    text-align: center;
    justify-content: center;
    border-radius: 5px;
    background: linear-gradient(30deg, #F166B3, #6254C9);
  }

  .Phone-Ingredient-Item p{
    margin: 0;
  }


}


</style>
