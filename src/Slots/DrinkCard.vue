<script setup>

</script>

<template>

  <div class="card my-3" >


      <slot name="Image-Slot" class="card-img-top">
          <img src="../assets/Image_1.png" class="img-fluid" alt="...">
      </slot>





    <div class="card-body text-center">

      <slot name="DrinkName-Slot">
        <h5 class="card-title">Unknown</h5>
      </slot>

    </div>

    <div class="ABV text-center">
      <slot name="ABV">
<!--        Nothing is here for now-->
      </slot>
    </div>
  </div>


</template>


<style scoped>


.card{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  overflow: hidden;
  height: 80%;
}


</style>
