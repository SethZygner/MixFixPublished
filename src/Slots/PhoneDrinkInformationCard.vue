



<script setup>

import {Swiper, SwiperSlide} from "swiper/vue";
import { EffectFlip } from "swiper";
import {useRouter} from "vue-router/dist/vue-router.mjs";



let router = useRouter();

</script>





<template>

  <div class="container-fluid fixed-top col-11 p-0" id="PhoneCard">

    <div class="p-0 m-0 d-flex justify-content-center align-items-center" id="Image-Slot">
      <slot name="Drink-Image"><img src="../assets/Image_1.png" class="img-fluid" alt=""></slot>
    </div>

    <div id="Content" class="justify-content-center text-center">



        <div class="Slider pt-3">
          <slot name="Drink-Name"><h3><b>Unknown Drink</b></h3></slot>
          <hr>
          <br>
          <h4>Ingredients</h4>
          <div class=" col-11 mx-auto row" id="Ingredient-List">
            <slot name="Ingredients"></slot>
          </div>
          <slot name="SaveDrinkButton"><h5 class="mb-2 mt-4"><b class="P-Hover" @click="router.push('/signIn')">Sign in</b> to save to collection!</h5></slot>
        </div>

    </div>

  </div>


</template>





<style scoped>

#PhoneCard{
  z-index: 1032;
  margin-top: 5em;
  height: 80%;
  overflow: hidden;
  border-radius: 1em;
}

#Image-Slot{
  max-height: 30%;
  overflow: hidden;
}

img{
  min-width : 100%;
  object-fit: cover;
}

.Slider{
  background-color: #F3F3F3;
  height: 35em;
}

#Ingredient-List{
  max-height: 15em;
  overflow: scroll;
}

h4{
  text-decoration: underline;
}


</style>
