<script setup>
import {ref} from "vue";
import fire from '../../Firebase.js';
import {useRouter} from "vue-router";

window.scrollTo(0, 0);


//Refs
let email = ref("");
let password = ref("");

let newEmail = ref("");
let newPassword = ref("");
let rePassword = ref("");
let username = ref("");

let signIn = ref(false);
let loading = ref(false);


//Misc
let router = useRouter();
let emailVerification = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;




//Functions
function signInUser(){
  if(emailVerification.test(email.value)){
    try{

      fire.logIn(email.value.trim(), password.value.trim());
      email.value = "";
      password.value = "";
      loading.value = true;
      setTimeout(()=>{
        loading.value = false;
        router.push('/');
      }, 3000);
    }catch (err){
      alert("Something went wrong: "+err.message);
    }
  }
}

function newUser(){
  if (emailVerification.test(newEmail.value.trim())){
    if(newPassword.value.trim().length >= 8){
      if(newPassword.value.trim() === rePassword.value.trim()){
        fire.newUser(username.value.trim(), newEmail.value.trim(), newPassword.value.trim(), "", "");
        router.push('/');
      }else{
        alert("Passwords don't match!");
      }
    }else{
      alert("Password too short!");
    }
  }else{
    alert("Invalid Email!");
  }
}



</script>




<template>


  <div v-if="loading" id="loadingScreen">
    <h1>Processing...</h1>
  </div>

  <div id="phoneDisplay">

    <div id="phoneSignIn" v-if="!signIn">
      <h1>Welcome Back!</h1>
      <input type="text" placeholder="Email" v-model="email">
      <input type="text" placeholder="Password" v-model="password">
      <br>
      <button @click="signInUser">Sign In</button>
      <br>
      <h3>Don't have an account? <span @click="signIn = !signIn">Sign up</span></h3>
    </div>

    <div id="phoneSignUp" v-else>
      <h1>Become a Mixer!</h1>
      <input type="text" placeholder="Username" v-model="username">
      <input type="text" placeholder="Email" v-model="newEmail">
      <input type="text" placeholder="Password" v-model="newPassword">
      <input type="text" placeholder="Re-enter Password" v-model="rePassword">
      <br>
      <button @click="newUser">Sign Up</button>
      <br>
      <h3>Already have an account? <span @click="signIn = !signIn">Sign In</span></h3>
    </div>

  </div>


  <div id="signContent">

    <div id="SignUp" >


      <div class="panel" id="signUpInvitation" v-if="!signIn">
        <h2>Become a Mixer</h2>
        <h3>Join the community to interact with fellow Mixers!</h3>
        <button @click="signIn = !signIn">Sign Up</button>
      </div>

      <div class="panel" v-if="!signIn">
        <h1>Welcome Back</h1>
        <i class="inputIcon"><img src="../assets/Icons/emailIcon.png" alt=""></i>
        <input type="text" v-model="email" placeholder="Email">
        <br>
        <i class="inputIcon"><img src="../assets/Icons/lockInput.jpg" alt=""></i>
        <input type="password" v-model="password" placeholder="Password">
        <br>
        <button @click="signInUser">Sign In</button>
      </div>


      <div class="panel" v-if="signIn">
        <h1>Become A Mixer</h1>
        <i class="inputIcon"><img src="../assets/Icons/usernameIcon.png" alt=""></i>
        <input type="text" v-model="username" placeholder="Username">
        <br>
        <i class="inputIcon"><img id="emailIcon" src="../assets/Icons/emailIcon.png" alt=""></i>
        <input type="text" v-model="newEmail" placeholder="Email">
        <br>
        <i class="inputIcon"><img src="../assets/Icons/lockInput.jpg" alt=""></i>
        <input type="password" v-model="newPassword" placeholder="Password">
        <br>
        <i class="inputIcon"><img src="../assets/Icons/lockInput.jpg" alt=""></i>
        <input type="password" v-model="rePassword" placeholder="Re-enter Password">
        <br>
        <button @click="newUser">Sign Up</button>
      </div>
      <div class="panel" id="signInInvitation" v-if="signIn">
        <h2>Welcome Back</h2>
        <h3>To keep connected with us please log-in<br>with your personal info</h3>
        <button @click="signIn = !signIn">Sign In</button>
      </div>





    </div>

  </div>




</template>




<style scoped>


#loadingScreen{
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
  position: absolute;
  top: 0;
  color: white;
  text-align: center;
}
#loadingScreen h1{
  margin: 10em auto;
}


#signContent{
  width: 65%;
  height: 30em;
  border-radius: 15px;
  border: 3px black solid;
  margin: 12em auto 0 auto;
  overflow: hidden;
  color: white;
}

  #SignUp{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 50% 50%;

  }



  .panel{
    text-align: center;
    border-radius: 15px;
  }

  .panel h1{
    margin-bottom: 2em;

  }

  .panel i{
    width: 2em;
    height: auto;
    position: absolute;
    margin-top: 8px;
  }

  .panel i img{
    width: 1.5em;
    height: auto;
  }

  #emailIcon{
    width: 2em;
    height: auto;
  }

  .panel input{
    padding-left: 3em;
    height: 3em;
    width: 60%;
    margin-bottom: 2em;
    border-radius: 5px;
    border: none;
    background-color: rgba(0, 0, 0, .1);
    color: black;
  }

  .panel input::placeholder{
    color: darkgrey;
  }

  .panel button{
    width: 12em;
    height: 4em;
    border-radius: 6px;
    background: linear-gradient(30deg, #F166B3, #6254C9);
    color: white;
    border: none;
  }

  button:hover{
    cursor: pointer;
  }

  .panel h2{
    margin-top: 7em;
  }

  #signInInvitation, #signUpInvitation{
    background: linear-gradient(30deg, #F166B3, #6254C9);
    color: white;
  }


  #signInInvitation button, #signUpInvitation button{
    width: 12em;
    height: 4em;
    border-radius: 6px;
    background: transparent;
    color: white;
    border: 2px white solid;
    margin-top: 4em;
  }




@media screen and (min-width: 0) and (max-width: 550px) {
  #signContent{
    display: none;
  }
  #phoneDisplay{
    display: block;
    margin: 7em auto 0 auto;
    height: 33em;
    width: 97%;
    justify-content: center;
    text-align: center;
    color: white;
    font-family: Bahnschrift,serif;
  }

  #phoneSignIn input, #phoneSignUp input{
    width: 80%;
    margin: 1.5em auto 0 auto;
    font-size: 1.3em;
    padding:.4em;
    border: none;
    box-shadow: 6px 6px 8px #171717;
    border-radius: 10px;
  }

  #phoneSignIn h1, #phoneSignUp h1{
    width: 90%;
    margin: 0 auto;
    background: linear-gradient(30deg, #F166B3, #6254C9);
    padding: .5em 0 .5em 0;
    border-radius: 10px;
    box-shadow: 6px 6px 8px #171717;
  }

  #phoneSignIn button, #phoneSignUp button{
    margin-top: 2em;
    width: 10em;
    height: 4em;
    border-radius: 10px;
    background: linear-gradient(30deg, #F166B3, #6254C9);
    color: white;
    box-shadow: 6px 6px 8px #171717;
    font-size: 1em;
    border: none;
  }

  span{
    text-decoration: underline;
  }

}


</style>
