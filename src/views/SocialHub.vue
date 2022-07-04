<!--================================================ SCRIPT ======================================================-->

<script setup>


  //All imports
  import fire from '../../Firebase.js'; //Firebase import
  import {getAuth, onAuthStateChanged} from "firebase/auth"; //Authentication import
  import {onValue, ref as fireRef} from "firebase/database"; //Firebase Database import
  import firebase from "firebase/compat";

  //Vue Imports
  import {reactive, ref} from "vue"; //Reactive and Ref import
  import {useRouter} from "vue-router"; //Router import to switch between routes

  //3rd Party npm imports
  import FilterBadWords from 'bad-words';


  //Initialized Simple Refs
  let message = ref("");
  let FilterByPercentBottom = ref(0);
  let errorMessage = ref("");
  let Favorite = ref(false);
  let IsUsers = ref(false);


  //Initialized booleans

  let signedIn = ref(false);
  //Makes sure the user is signed in before they may use features
  if(getAuth().currentUser){
    signedIn.value = true;
  }
  let IsError = ref(false); //True if there is any error with the firebase calls


  //Initialized arrays
  let UserInfo = reactive([]); //Holds the user's info
  let Posts = reactive([]); //The array of all the posts made by users
  let Drinks = reactive([]); //The array of all the drinks made by users
  let FilteredDrinks = reactive([]); //Holds the drinks after filtered to display
  let clickedDrink = reactive([]); //Has information on the specific drink that's clicked


  //References to firebase
  let PublicPosts = fireRef(fire.database(), 'publicPosts/'); //Public Posts Reference
  let PublicDrinks = fireRef(fire.database(), 'publicDrinks/'); //Public Drinks Reference


  //Misc
  let router = useRouter();
  window.scrollTo(0, 0); //Scrolls to the top when page is loaded


  //Functions
  function FilterByPercent(){

    Drinks.forEach((drink)=>{
      let DrinkInfo = drink.DrinkInfo[0];

      if(DrinkInfo.ABV.toFixed(0) <= FilterByPercentBottom.value){
        FilteredDrinks.push(drink);
      }

    });
    console.log(FilteredDrinks)
  } //Filter drinks by percent

  function ClearFilters(){
    FilterByPercentBottom.value = 0;
    FilteredDrinks.length = 0;
  }//Clears all the filters the user had entered

  function SendPost(){


    if(fire.getAuth().currentUser.uid){
      fire.publicPost(message.value.trim());
      message.value = "";
    }

  } //Sends a post to the messages

  async function ShowDrinkDetails(index){
    clickedDrink.push(Drinks[index]);
    const Check = firebase.database().ref();
    //Check if it is the User's own drink they made
    if(getAuth().currentUser){
      IsUsers.value = false;

      await Check.child('users').child(getAuth().currentUser.uid).child('publicDrinks').get()
          .then((data)=>{
            data.forEach((drink)=>{
              if(drink.key === clickedDrink[0].DrinkID){
                IsUsers.value = true;
              }
            })
          })


      // Checks if this drink has been liked by the current user
      Favorite.value = false;
      if(!IsUsers){
        await Check.child('users').child(getAuth().currentUser.uid).child('UserDrinkFavorites').get()
            .then((result) => {
              result.forEach((drink) => {
                console.log(clickedDrink[0].DrinkID + ' === ' + drink.key)
                if (clickedDrink[0].DrinkID === drink.key) {
                  Favorite.value = true;
                }
              })
            });
      }
    }





  } //Fills the 'clickedDrink' array with the information of the specific drink clicked and checks if the drink has been liked or not

  function errorFunction(code){
    IsError.value = true;
    switch (code){
      case 404:
        errorMessage.value = "Source not found";
        break;

      case 400:
        errorMessage.value = "Bad Request";
        break;

      case 500:
        errorMessage.value = "Server Error";
        break;
    }
  } //Sends the error code for which the error is

  function AddToFavorites(){
    Favorite.value = true;
    fire.AddToUserDrinkFavorites(clickedDrink[0]);
  }

  function UnAddFavorites(){
    Favorite.value = false;
    fire.UnAddUserFavorite(clickedDrink[0].DrinkID);
  }


  //Constant Updates
  onValue(PublicPosts, (snapshot)=>{
    Posts.length = 0;

    snapshot.forEach((post)=>{
      Posts.push(post.val());
    })

  }, (error)=>{
    errorFunction(error.code);
  }); //This gets all posts from firebase

  onValue(PublicDrinks, (snapshot) => {
    Drinks.length = 0;

    snapshot.forEach((drink)=>{
      Drinks.push({
        DrinkInfo: drink.val(),
        DrinkID: drink.key
    })
    });
  }, (error)=>{
    errorFunction(error.code);
  }); //Gets all public drinks

  onAuthStateChanged(getAuth(), ()=>{

    if(getAuth().currentUser){

      //Makes sure userInfo is empty
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
        })
      })
    }
  }); //Checks to see if the user is signed in or not


</script>





<!--================================================== HTML ======================================================-->


<template>

<!---------------------------------------------------- Misc -------------------------------------------------------->

  <div v-if="IsError" class="error">
    <h1>ERROR</h1>
    <h3>{{errorMessage}}</h3>
  </div>

  <div @click="clickedDrink.length = 0" class="Black-Overlay" v-if="clickedDrink.length">

  </div>


<!------------------------------------------- Specific Drink Display ------------------------------------------------>

  <Transition name="bounce">
  <div class="DrinkDisplay" v-if="clickedDrink.length">
    <h2>{{clickedDrink[0].DrinkInfo[0].DrinkName}} ({{clickedDrink[0].DrinkInfo[0].ABV.toFixed(0)}}% ABV)</h2>
    <div  class="DrinkInformation" >
      <div>
        <h2>Mixer : {{clickedDrink[0].DrinkInfo[0].Username}}</h2>
        <img v-if="clickedDrink[0].DrinkInfo[0].Image" :src="clickedDrink[0].DrinkInfo[0].Image" alt="">
        <img v-else src="../assets/Image_1.png" alt="">
      </div>


      <div class="Ingredients">
        <div class="Ingredient" v-for="ingredient in clickedDrink[0].DrinkInfo[1]">
          <h3>{{ingredient.Ingredient}}</h3>
          <h3>{{ingredient.Percent}} <span v-if="ingredient.PercentOrProof === '%'">%</span><span v-if="ingredient.PercentOrProof === 'Proof'"> Proof</span></h3>
          <p>{{ingredient.Measurement+" "+ingredient.Unit}}</p>
        </div>
      </div>

    </div>
    <div v-if="signedIn">
      <div v-if="!IsUsers" class="Favorite">
        <p class="PClose" @click="UnAddFavorites" v-if="Favorite">Un-Favorite</p>
        <p v-else class="PClose" @click="AddToFavorites">Favorite</p>
      </div>
    </div>
    <div v-else>
      <p><b class="PClose">Sign up</b> to add this drink to your favorites!</p>
    </div>

    <p style="margin: 0 auto" class="PClose" @click="clickedDrink.length = 0">Close</p>
  </div>

</Transition>



<!------------------------------------------------- Page Content ---------------------------------------------------->

  <div class="All-Content">

<!---------------------------------------------- Show List of Drinks ------------------------------------------------>

    <div class="Show-Drinks" >
      <div @click="ShowDrinkDetails(Drinks.indexOf(drink))" v-if="!FilteredDrinks.length" class="User-Drink" v-for="drink in Drinks">
        <p class="DrinkName">{{drink.DrinkInfo[0].DrinkName}}</p>
        <img v-if="drink.DrinkInfo[0].Image" :src="drink.DrinkInfo[0].Image" alt="">
        <img v-else src="../assets/Image_1.png" alt="Image of drink">
        <p class="ABV">{{drink.DrinkInfo[0].ABV.toFixed(0)}}% ABV</p>
      </div>

<!------------------------------------------------ Each User Drink -------------------------------------------------->

      <div class="User-Drink" v-else v-for="drink in FilteredDrinks">
        <p class="DrinkName">{{drink.DrinkInfo[0].DrinkName}}</p>
        <img src="../assets/Image_1.png" alt="Image of drink">
        <p class="ABV">{{drink.DrinkInfo[0].ABV.toFixed(0)}}% ABV</p>
      </div>

    </div>


<!------------------------------------------------ Social Options --------------------------------------------------->

    <div v-if="signedIn" class="Social-Options">
      <div>
        <img src="../assets/Icons/filterIcon.png" alt="">
        <p>Filters</p>
      </div>
      <div @click="router.push('/createDrink')">
        <p >Create A Drink</p>
      </div>
      <div>
        <p>Social Chat</p>
      </div>
      <div>
        <p>Tools</p>
      </div>
    </div>

    <div v-else class="SignUpWarning" style="color: white;">
      <h2>Sign Up!</h2>
      <p>Create, save, and explore new drinks!<br>
      Gain access to free tools.
      </p>
    </div>


  </div>


</template>












<!--================================================== STYLING ====================================================-->


<style scoped >


.All-Content{
  text-align: center;
  margin-top: 6em;
  width: 100%;
  display: grid;
  grid-template-columns: 70% 30%;
  padding: 1em;
  box-sizing: border-box;
}


/*--------------------------------------------------- User Drinks Display -------------------------------------------*/

.Show-Drinks{
  display: grid;
  grid-template-columns: 33.33333% 33.33333% 33.33333%;
  box-sizing: border-box;

  justify-content: center;
  text-align: center;

  overflow-y: scroll;
  overflow-x: hidden;

  padding: 2em;
  column-gap: .5em;
  row-gap: 1em;
  max-height: 35em;
  color: white;

  box-shadow: inset 0 0 10px #000000;
}

.Show-Drinks::-webkit-scrollbar{
  box-shadow: inset 0 0 3px #000000;
  width: .7em;
  border-radius: 1em;
}

.Show-Drinks::-webkit-scrollbar-thumb{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  border-radius: 5px;
}


/*-------------------------------------------------- Individual User Drinks -----------------------------------------*/

.User-Drink{
  border-radius: .7em;
  border: 1px white solid;
  max-height: 17em;
  background: linear-gradient(30deg, #F166B3, #6254C9);
  box-sizing: border-box;
}

.User-Drink:hover{
  cursor: pointer;
}

.User-Drink img{
  max-width: 85%;
  max-height: 11em;
  border: 2px white solid;
  border-radius: .7em;
}

.ABV{
  margin: .1em auto 0 auto;
}


/*---------------------------------------------------Social Options--------------------------------------------------*/

.Social-Options{
  display: grid;
  grid-template-columns: 50% 50%;
  box-sizing: border-box;
  padding: 1em 1em 10em 1em;
  color: white;
  gap: 1em;

}

.Social-Options div{
  border: 1px white solid;
  min-height: 8em;
  padding-top: 2em;
  overflow: hidden;
  border-radius: 1em;
}

.Social-Options div img{
  width: 20%;
  height: auto;
}

.Social-Options div:hover{
  background: linear-gradient(30deg, #F166B3, #6254C9);
  cursor: pointer;
}


/*---------------------------------------------------Drink Display---------------------------------------------------*/

.DrinkDisplay{
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

.DrinkInformation{
  display: grid;
  grid-template-columns: 50% 50%;
  box-sizing: border-box;
  padding: 2em;
}

.DrinkInformation h2{
  margin: 0 auto;
}

.DrinkInformation h1{
  margin: 0 auto;
}

.DrinkInformation h3{
  margin: .1em auto;
}

.DrinkInformation p{
  margin: .2em auto;
}

.DrinkInformation img{
  width: 75%;
  height: auto;
  border-radius: 1em;
  border: 2px white solid;
}

.Favorite{
  margin: 0 auto;
}

.PClose:hover{
  cursor: pointer;
  text-decoration: underline;
}

.Ingredients{
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 1em;
}

.Ingredient{
  border: 1px white solid;
  border-radius: 1em;
}


/*--------------------------------------------------- Misc ----------------------------------------------------------*/

.Black-Overlay{
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .7);
}

.error{
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(225, 0, 0, .7);
}


/*--------------------------------------------------- Animations ----------------------------------------------------*/
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


  .All-Content{
    width: 100%;
    display: block;
  }


  .Show-Drinks{
    display: grid;
    grid-template-columns: 50% 50%;
    min-height: 20em;
  }

  .User-Drink{
    border: 1px white solid;
    max-height: 10em;
    overflow: hidden;
  }

  .User-Drink p{
    font-size: .8em;
  }


  .User-Drink img{
    max-width: 80%;
    max-height: 4em;

  }

  .ABV{
    margin: .1em auto 0 auto;
  }


  .DrinkDisplay{
    height: 30em;
  }

  .DrinkDisplay h2, .DrinkDisplay h3{
    font-size: .9em;
  }


  .DrinkDisplay p{
    font-size: .8em;
  }



  .DrinkInformation{
    display: block;
    box-sizing: border-box;
    padding: 1em;
  }



  .DrinkInformation img{
    width: 75%;
    height: auto;
    border-radius: 1em;
    border: 2px white solid;
  }


  .Ingredients{
    height: 9em;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
  }


  .Ingredient{
    border: 1px white solid;
    border-radius: 1em;
    height: 5em;
    width: 80%;
    margin: 0 auto;
  }

}

</style>









