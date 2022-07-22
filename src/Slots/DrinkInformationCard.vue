<script setup>
import {Swiper, SwiperSlide} from "swiper/vue";
import { EffectFlip } from 'swiper';
</script>

<template>

  <swiper :effect="'flip'" :modules=[EffectFlip]  class="container-fluid fixed-top  text-center" >
    <swiper-slide class="Card-Container">
      <div id="Image">
        <slot name="DrinkImage" ><img class="img-fluid" src="../assets/Image_1.png" alt=""></slot>
      </div>
      <div id="Ingredients">
        <slot name="Ingredients"></slot>
      </div>
    </swiper-slide>

    <swiper-slide class="Card-Container">
      <div id="Instructions">
        <slot name="Description"><p>No Instructions here</p></slot>
      </div>

    </swiper-slide>
  </swiper>
</template>

<style scoped>

.Card-Container{
  width: 90%;
  height: auto;
  margin: 0 auto;
  background-color: white;
  padding: 1em;
  border-radius: 10px;
}

#Ingredients, #Instructions{
  height: 15em;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 1em;
}




</style>
