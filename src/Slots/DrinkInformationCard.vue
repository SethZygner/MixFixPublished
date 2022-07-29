<script setup>
import {Swiper, SwiperSlide} from "swiper/vue";
import { EffectFlip, Navigation } from 'swiper';
</script>

<template>



  <Swiper :effect="'flip'" :modules=[EffectFlip,Navigation] :navigation="true"  class="container-fluid text-center p-4 d-flex" id="Card" >
    <swiper-slide>
      <div class="card" >
        <div class="card-img-top">
          <slot name="Image" class="img-fluid" ></slot>
        </div>

        <div class="card-body">
          <h5 class="card-title">
            <slot name="Card-Title"></slot>
          </h5>
        </div>

        <ul class="list-group list-group-flush" id="Ingredients">
          <slot name="Ingredients-And-Measurements"></slot>
        </ul>
      </div>
    </swiper-slide>
    <swiper-slide style="background-color: white; height: 30em" class="p-3" id="Instructions">
      <div class="mt-5 p-2" >
        <h4><slot name="Instructions"></slot></h4>
      </div>
    </swiper-slide>
  </Swiper>



</template>

<style scoped>


#Ingredients{
  overflow-y: scroll;
  max-height: 8em;
}

#Instructions{
  overflow-y: scroll;
}


</style>
