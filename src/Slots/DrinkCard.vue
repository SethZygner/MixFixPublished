<script setup>

</script>

<template>

  <div class="card" >
    <slot name="Image-Slot"><img src="../assets/Image_1.png" class="card-img-top" alt="..."></slot>
    <div class="card-body text-center">
      <slot name="DrinkName-Slot"><h5 class="card-title">Mystery</h5></slot>
    </div>
  </div>


</template>


<style scoped>


.card{
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}


</style>
