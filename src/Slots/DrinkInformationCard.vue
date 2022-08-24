<script setup>



import {useRouter} from "vue-router/dist/vue-router.mjs";

let router = useRouter();

</script>

<template>

    <div class="Pop-Up d-md-flex row-cols-2  justify-content-md-between ">
      <div id="Image-Div" class="col-md-3 ">
        <slot name="Drink-Image"></slot>
      </div>

      <div class="col-md-8 col-11 pt-3">
        <div id="Drink-Name-Div" >
          <slot name="Drink-Name"></slot>
          <slot name="SaveDrinkButton"><h5><b class="P-Hover" @click="router.push('/signIn')">Sign in</b> to save to collection!</h5></slot>
        </div>


        <div id="Ingredients-And-Instructions" class=" px-2 mt-4 text-md-start">
          <h4><b>Ingredients</b></h4>
          <div class="row my-md-3 my-2 justify-content-md-start justify-content-evenly text-md-start text-center">
            <slot name="Ingredients"></slot>
            <h4><b>Instructions</b></h4>
            <div class="my-md-3 my-2">
              <slot name="Instructions"></slot>

            </div>
          </div>
        </div>


      </div>


    </div>

</template>

<style scoped>



</style>
