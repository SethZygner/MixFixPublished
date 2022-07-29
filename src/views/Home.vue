<script setup>
import {useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import DrinkCard from "../Slots/DrinkCard.vue";
import DrinkInformationCard from "../Slots/DrinkInformationCard.vue";
import fire from "../../Firebase.js";
import AOS from "aos";


onMounted(() => {
  AOS.init();
})

const router = useRouter();

const randomDrinkURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

let signedIn = ref(false);

let DrinkInfo = reactive([]);

window.scrollTo(0, 0);


onAuthStateChanged(getAuth(), ()=>{
  signedIn.value = getAuth().currentUser !== null;
})


let testing = ref(true);

function test(){
  fetch(randomDrinkURL)
  .then((result)=>{
    testing.value = false;
    DrinkInfo.length = 0;
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
    setTimeout(()=>{
      testing.value = true;
    }, 500);

    console.log(DrinkInfo);
  })
}

test();


</script>



<template>

<!----------------------------------------------------------TITLE--------------------------------------------------------->
  <div id="Title" class="mx-auto text-center p-5" data-aos="fade-up">
    <h1 >The online community for real<br>social drinking</h1>
    <i>"Where all your drinks come true"</i>
  </div>

  <!---------------------------------------------------HORIZONTAL LINE---------------------------------------------------->
  <div class="Horizontal-Gradient-Line mb-5"></div>


  <!-----------------------------------------------------MAIN CONTENT------------------------------------------------------>
  <div class="container-fluid mx-auto">
    <div class="row row-flex text-center justify-content-around gy-3 p-2">



      <!----------------------------------------------RANDOM GENERATOR-------------------------------------------->
      <div class="col-lg-11 col-md-12 mb-2 p-4 General-Panel"  data-aos="fade-up" style="overflow-y: hidden;">
        <h2 class="mb-4">Random Drink Generator</h2>
        <!-----------------------------------------------DRINK CARD------------------------------------------------>
        <div id="Random-Panel" class="row mx-auto justify-content-around">
          <div class="col-lg-5 col-md-12">
            <Transition name="slide-left">
              <DrinkCard v-if="DrinkInfo.length && testing">
                <template #Image-Slot>
                  <img :src="DrinkInfo[1].Image" class="img-fluid"  alt="">
                </template>
                <template #DrinkName-Slot>
                  {{DrinkInfo[1].DrinkName}}
                </template>
              </DrinkCard>
            </Transition>
          </div>

          <Transition name="slide-right">
            <div v-if="DrinkInfo.length && testing" class="col-lg-5 Computer-Ingredients">
              <div>
                <h1>Instructions</h1>
                <h4>{{DrinkInfo[1].Instructions}}</h4>
              </div>


              <h1>Ingredients</h1>
              <div class="text-center" v-for="item in DrinkInfo[0]">
                <h5>{{item.Ingredient}} - <span v-if="item.Measurement">({{item.Measurement}})</span></h5>
              </div>
            </div>
          </Transition>



        </div>
        <button class="btn-outline-dark btn m-4" @click="test">Test Your Luck</button>

      </div>

      <!----------------------------------------------RANDOM GENERATOR-------------------------------------------->
      <div class="col-lg-5 col-md-12 General-Panel" data-aos="fade-right">
        <div class="row row-flex p-2">
          <div class="col-4">
            <img src="../assets/Icons/Browse.png" class="img-fluid" style="max-height: 10em" alt="">
          </div>
          <div class="col p-2">
            <h2>Browse</h2>
            <div class="Horizontal-Gradient-Line mb-3"></div>
            <p>Look up a specific drink or make a mix with specific ingredients!</p>
            <button class="btn btn-outline-dark" @click="router.push('/browseCocktails')">Browse</button>
          </div>
        </div>
      </div>


      <div class="col-lg-5 col-md-12 General-Panel " data-aos="fade-left">
        <div class="row row-flex p-2">
          <div class="col-4">
            <img src="../assets/Icons/Discover.png" class="img-fluid" style="max-height: 10em" alt="">
          </div>
          <div class="col">
            <h2>Social Hub</h2>
            <div class="Horizontal-Gradient-Line mb-3"></div>
            <p>Discover, save, and create new drinks! It's like a social media, but
            for alcohol!</p>
            <button class="btn btn-outline-dark">Get Social</button>
          </div>
        </div>
      </div>

      <div class="col-lg-11 col-md-12 my-4 p-4  General-Panel"  data-aos="fade-up">
        <div class="row row-flex">
          <div class="col-4">
            <img src="../assets/Icons/Tools.png" class="img-fluid" style="max-height: 12em" alt="">
          </div>

          <div class="col-8">
            <h2>Tools</h2>
            <div class="Horizontal-Gradient-Line mb-3"></div>
            <p>Want to measure the the strength of a drink? Use our built in tools to make a drink
            that best fits your taste!</p>
            <button class="btn btn-outline-dark">Tools</button>
          </div>

        </div>
      </div>
    </div>
  </div>


</template>


<style scoped>

#Title{
  margin-top: 2em;
}

#Title h1{
  line-height: 1.5em;
}

.row-flex{
  display: flex;
  flex-wrap: wrap;
}

.General-Panel{
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  background-color: white;
}

.row-flex div{
  overflow-wrap: break-word;
}

.Computer-Ingredients{
  max-height: 28em;
  overflow-y: scroll;
}

.Computer-Ingredients::-webkit-scrollbar{
  background-color: darkgrey;
  width: 5px;
}

#Random-Panel{
  width: 80%;
}



/*Misc*/
.Horizontal-Gradient-Line{
  width: 85%;
  border-image: linear-gradient(30deg, #F166B3, #6254C9) 4;
  border-bottom: 4px solid transparent;
  margin: 0 auto;
}

.slide-left-enter-active {
  transition: .5s ;
}

.slide-left-leave-active {
  transition: .5s;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-45em);
}

.slide-right-enter-active {
  transition: .5s ;
}

.slide-right-leave-active {
  transition: .5s;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(45em);
}



@media screen and (min-width: 0) and (max-width: 600px){

  #Title{
    margin-top: 0 !important;
  }

  .General-Panel{
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  }



}


@media screen and (min-width: 0) and (max-width: 991px){
  .Computer-Ingredients{
    display: none;
  }

  #Random-Panel{
    width: 100%;
  }
}


</style>
