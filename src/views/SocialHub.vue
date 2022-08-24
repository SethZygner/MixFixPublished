<script setup>
  import fire from '../../Firebase.js'; //Firebase import
  import {getAuth, onAuthStateChanged} from "firebase/auth"; //Authentication import
  import {reactive, ref} from "vue"; //Reactive and Ref import
  import {useRouter} from "vue-router"; //Router import to switch between routes
  import DrinkCard from '../Slots/DrinkCard.vue';
  import DrinkInformation from '../Slots/DrinkInformationCard.vue';
  import PhoneDrinkInformation from '../Slots/PhoneDrinkInformationCard.vue';




  let LocalStorage = window.localStorage;

  let PostImage = ref("");

  let UserSearchInput = ref("");

  let Discover = ref(true);

  let signedIn = ref(false);

  let router = useRouter();

  let AllDrinks = reactive([]);

  let SelectedDrink = reactive([]);

  let UserList = reactive([]);

  let RefreshAllowed = ref(false);

  let RefreshNumber = ref(3);

  let Saved = ref(false);


  function GetDrinkInfo(index){
    SelectedDrink.length = 0;
    SelectedDrink.push(fire.LocalDrinks[index]);

  }

  function ShowFriends(){
    UserList.length = 0;
    if(UserSearchInput.value){

      let arr = JSON.parse(LocalStorage.getItem('AllUsers'));

      Object.values(arr).forEach((user)=>{
        if(user.Username.toLowerCase().includes(UserSearchInput.value.toLowerCase())){
          UserList.push(user);
        }
      })

    }
  }

  function SaveDrink(){

  }



  onAuthStateChanged(getAuth(),()=>{
    if(getAuth().currentUser){
      signedIn.value = true;
      setTimeout(()=>{
        fire.GetPublicDrinks();
      },2000);

    }
  });



  setInterval(()=>{
    if(LocalStorage.getItem('LimitRefresh')){
      let Limit = JSON.parse(LocalStorage.getItem('LimitRefresh'));

      let PassedTime = Date.now() - Limit.Time;

      RefreshNumber.value = 3-Limit.Amount;


      if(Limit.Amount === 3){
        RefreshAllowed.value = false;
      }

      if(PassedTime > (24*60*60)){
        RefreshAllowed.value = true;
        LocalStorage.removeItem('LimitRefresh');
      }

    }else{
      RefreshAllowed.value = true;
    }
  }, 100);

  function LimitRefresh(){
    if(!LocalStorage.getItem('LimitRefresh')){
      LocalStorage.setItem('LimitRefresh', JSON.stringify({Amount: 1, Time: Date.now()}));
      console.log(JSON.parse(LocalStorage.getItem('LimitRefresh')))
    }else{
      let Limit = JSON.parse(LocalStorage.getItem('LimitRefresh'));
      console.log(Limit)
      if((3-Limit.Amount) !== 0){
        LocalStorage.setItem('LimitRefresh', JSON.stringify({Amount: Limit.Amount += 1, Time: Date.now()}));
        fire.GetPublicDrinks();
      }

    }
  }


</script>



<template>

  <div class="Black-Overlay" v-if="SelectedDrink.length" @click="SelectedDrink.length = 0;"></div>
  <div v-if="SelectedDrink.length" id="Drink-Information">
    <DrinkInformation >
      <template #Drink-Image>
        <img  :src="SelectedDrink[0].strDrinkThumb" class="Pop-Up-Drink-Image img-fluid"  alt="">
      </template>

      <template #Drink-Name>
        <h3>{{SelectedDrink[0].DrinkName}}</h3>
      </template>

      <template #Ingredients>
        <div class="col-md-4 col-5" v-for="ingredients in SelectedDrink[0].Ingredients">
          <p>{{ingredients.Ingredient}} - {{ingredients.Amount}}{{ingredients.Unit}}</p>
        </div>
      </template>

      <template #Instructions>
        <p>{{SelectedDrink[0].Instructions}}</p>
      </template>
    </DrinkInformation>
  </div>
  <div v-if="SelectedDrink.length" id="Phone-Drink-Information">
    <PhoneDrinkInformation class="Hover">
      <template #Drink-Image>
        <img :src="SelectedDrink[0].strDrinkThumb" class="img-fluid" alt="">
      </template>

      <template #Drink-Name>
        <h3><b>{{SelectedDrink[0].DrinkName}}</b></h3>
      </template>

      <template #Ingredients>
        <div class="col-10 text-center mx-auto" v-for="ingredients in SelectedDrink[0].Ingredients">
          <p>{{ingredients.Ingredient}} - {{ingredients.Amount}}{{ingredients.Unit}}</p>
        </div>
      </template>

    </PhoneDrinkInformation>
  </div>

  <div  class="container-fluid" >



    <div class="row justify-content-md-between justify-content-center Row-Content">


<!------------------------------------------------------- Left Options --------------------------------------------------->
      <div class="Left-Panel-Profile col-md-2 py-3" v-if="signedIn && fire.UserInformation.GeneralInformation">

        <div class="col-12 mb-4 d-flex align-items-center">
          <img v-if="fire.HasProfilePicture" :src="fire.UserInformation.GeneralInformation.ProfilePicture" class="Left-Panel-Picture" alt="">
          <img v-else src="../assets/Icons/usernameIcon.png" class="Left-Panel-Picture" alt="">
          <h4 class="Left-Panel-Username ml-3 P-Hover" @click="router.push('/account')">{{ fire.UserInformation.GeneralInformation.Username }}</h4>
        </div>

<!-------------------- This is going to be when I get the social aspect down more ------------------>

<!--        <div class="col-12 mb-2 d-flex align-items-center">-->
<!--          <img src="../assets/Icons/DrinkingBuddies.jpg" class="icon-sm" alt="">-->
<!--          <h5 class="ml-4 align-middle P-Hover">Friends</h5>-->
<!--        </div>-->

<!--        <div class="col-12 mb-2 d-flex align-items-center">-->
<!--          <img src="../assets/Icons/ForumsIcon.png" class="icon-sm" alt="">-->
<!--          <h5 class="ml-4 P-Hover">Forums</h5>-->
<!--        </div>-->

<!--        <div class="col-12 mb-2 d-flex align-items-center">-->
<!--          <img src="../assets/DrinkIcon.jpg" class="icon-sm" alt="">-->
<!--          <h5 class="ml-4 P-Hover">Discover</h5>-->
<!--        </div>-->

        <hr class="col-md-9 mb-0">
        <h5 class="mt-0 Web_View_Content">Favorites</h5>

      </div>

      <div class=" col-md-2 py-3 text-center" v-else>
        <div>
          <h4>Welcome!</h4>
          <p>Here in Social Hub, you can discover, create, and save drinks made by users around the world!<br>
          <b class="P-Hover" @click="router.push('/signIn')">Sign up</b> to get started!</p>
        </div>

      </div>



<!------------------------------------------------------- General Feed --------------------------------------------------->



      <div v-if="Discover" class="Feed col-md-6 p-0 row justify-content-evenly">



        <div class="col-md-12 col-10 text-center mb-4">
          <div class="row justify-content-evenly">
            <div class="col-11 col-sm-6 col-md-5 mb-3 mb-md-0" v-if="getAuth().currentUser">
              <div @click="router.push('/createDrink')" class="simple-input pt-2 mx-auto Hover ">Create A Drink</div>
            </div>
            <div class="col-11 col-md-5 col-sm-6">
              <div v-if="RefreshAllowed"  @click="LimitRefresh" class="simple-input pt-2 mx-auto Hover ">
                Refresh Drinks ({{RefreshNumber}})
              </div>
              <div v-else  class="false-simple-input-disabled pt-2 mx-auto Hover ">Refresh Drinks ({{RefreshNumber}})</div>
            </div>

          </div>

        </div>
        <hr class="col-11 mx-auto">

          <div class=" col-md-4 col-6" v-if="fire.LocalDrinks.length" v-for="drink in fire.LocalDrinks">
            <DrinkCard @click="GetDrinkInfo(fire.LocalDrinks.indexOf(drink))" class="Hover">
              <template #DrinkName-Slot >
                <h5 >{{drink.DrinkName}}</h5>
              </template>

              <template #Image-Slot>
                <div id="Image" class="d-flex align-items-center" v-if="drink.strDrinkThumb">
                  <img  :src=drink.strDrinkThumb class="img-fluid d-flex align-items-center" alt="">
                </div>

              </template>

              <template #ABV>
                <h5>{{drink.ABV.toFixed(0)}}%</h5>
              </template>
            </DrinkCard>
          </div>

      </div>



      <div v-if="!Discover" class="Friends-Column col-md-3 Web_View_Content">
        <input type="text" maxlength="15" class="simple-input" placeholder="Search Mixers">
        <hr>
        <h5>Following</h5>
        <hr>
        <h5>Friends</h5>
      </div>

      <div v-if="Discover"  class="col-md-3 Web_View_Content">
        <input type="text" maxlength="15" class="simple-input" placeholder="Search By Username" v-model="UserSearchInput" @input="ShowFriends" style="z-index: 3000">
        <div id="DropDownUsers" v-if="UserList">
          <div v-for="user in UserList" class="">
            <p class="m-4 P-Hover">{{user.Username}}</p>
          </div>

        </div>
        <hr>
        <h5>Filters</h5>

      </div>


<!------------------------------------------------------- Public Forums --------------------------------------------------->



    </div>
  </div>


</template>






<style scoped >

.Row-Content{
  margin-top: 9em;

}

#DropDownUsers{
  position: absolute;
  background-color: white;
  margin-left: 1.5em;
  z-index: 2000;
  width: 18%;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
  overflow-y: scroll;
  max-height: 15em;

}

#DropDownUsers::-webkit-scrollbar{
  display: none;
}

.Left-Panel-Picture{
  width: 3em;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover !important;
}

.Feed{
  border-left: solid #D9D9D9 1px;
  border-right: solid #D9D9D9 1px;
  max-height: 40em;
  overflow-y: scroll;
}

.Feed::-webkit-scrollbar{
  display: none;
}

#Image{
  max-height: 10em;
  overflow: hidden;
}

#Drink-Information{
  position: fixed; z-index: 2000;
  height: 80%;
}

#Phone-Drink-Information{
  display: none;
}

@media screen and (max-width: 767px){
  #Drink-Information{
    display: none;
  }

  #Phone-Drink-Information{
    display: contents;
  }

  .Web_View_Content{
    display: none !important;
  }
}



</style>
