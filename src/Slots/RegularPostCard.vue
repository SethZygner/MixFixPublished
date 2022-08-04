<script setup>

</script>




<template>

  <div class="container-fluid mx-auto my-5 p-3 text-center Post">


      <div class="p-0 d-inline-flex" >
        <div class="UserImage mx-3">
          <slot name="UserImage" >
<!--            Change This To Different Image-->
            <img src="../assets/ProfilePic.JPG" class="img-fluid" alt="">
          </slot>
        </div>

        <div class="UserName mt-2">
          <slot name="UserName">
            <h6>Unknown User</h6>
          </slot>
        </div>
      </div>

      <div class="my-2">

        <div class="Text-Content pb-3">
          <slot name="Text-Content">
            <h4>This is some test content</h4>
          </slot>
        </div>



        <div class="Optional-Image">
          <slot name="Optional-Image">

          </slot>
        </div>

      </div>




      <div class="Horizontal-Gradient-Line my-3"></div>




      <div class="row row-cols-2 justify-content-evenly">
        <slot>
          <p>Comment</p>
        </slot>
        <slot>
          <p>Like</p>
        </slot>
      </div>

    </div>



</template>



<style scoped>

.Post{
  border: 1px black solid;
  border-radius: 10px;
}

.UserImage{
  width: 7%;
  overflow: hidden;
  border-radius: 50%;
  height: 100%;
}

.UserImage img{
  width: 100%;
  aspect-ratio: 1/1;
}


.Horizontal-Gradient-Line{
  width: 85%;
  border-image: linear-gradient(30deg, #F166B3, #6254C9) 4;
  border-bottom: 2px solid transparent;
  margin: 0 auto;
}


@media screen and (min-width: 0) and (max-width: 600px){
  .UserImage{
    width: 12%;
  }
}




</style>
