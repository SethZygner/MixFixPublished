<script setup>
import {onMounted} from "vue";
import AOS from "aos";

onMounted(() => {
  AOS.init();
})

window.scrollTo(0, 0);


</script>



<template>

  <div class="container-fluid text-center p-0 mb-5 First-Portion " >
    <div class="row justify-content-md-between justify-content-evenly">
      <div class="col-md-5 col-11 First-Image">
        <img src="../assets/landingPageImage1.png" class="img-fluid" alt="">
      </div>

      <div class="col-md-6 col-11 text-center p-md-4 p-2 First-Text">
        <h1>Where Real Social Drinking<br>Happens</h1>
        <p class="mx-auto mt-md-4 col-md-7 col-10">Finally, a one-stop shop for those who are
          looking to try something different or unique when
          it comes to expanding your pallet in the world
          of adult drinks</p>
      </div>
    </div>
  </div>


  <div class="container-fluid text-center p-0 my-5 Second-Portion">
    <div class="row justify-content-md-between justify-content-evenly">

      <div class="col-md-5 col-11 Second-Image-Phone" >
        <img src="../assets/FinishedLandingPageImage2.png" class="img-fluid" alt="">
      </div>

      <div class="col-md-6 col-11 text-center p-md-4 p-2 First-Text">
        <h1>What is Mixer Fixer?</h1>
        <p  class="mx-auto mt-md-5 mt-3 col-md-7 col-10">Mixer Fixer is for
          those who enjoy the social aspects of social drinking. We have
          thousands of mixed drinks, not only from our implimented API,
          but thousands of “Mixers” who create and share their ideas from
          Adult Punches to Cocktails</p>
      </div>

      <div class="col-md-5 col-11 Second-Image">
        <img src="../assets/FinishedLandingPageImage2.png" class="img-fluid" alt="">
      </div>
    </div>
  </div>

  <div class="my-5 container-fluid">
    <div class="text-center mx-auto col-md-7">
      <p><b>Disclaimer :</b> This website is intended
        for adults over 21 and of legal drinking age.
        We encourage responsible drinking only. Nothing
        on this website should be construed as professional
        advice. All content on this website is for informational
        and educational purposes only.</p>
    </div>
  </div>



</template>











<style scoped>

.First-Portion{
  margin-top: 10em;
}

.First-Text h1{
  margin-top: 2em;
}

.Second-Image-Phone{
  display: none;
}

@media screen and (max-width: 767px){
  .Second-Image-Phone{
    display: contents;
  }

  .Second-Image{
    display: none;
  }
}


</style>
