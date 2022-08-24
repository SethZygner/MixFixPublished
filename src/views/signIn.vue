<script setup>
import {ref} from "vue";
import fire from '../../Firebase.js';
import {useRouter} from "vue-router";
import {getAuth} from "firebase/auth";


let router = useRouter();

window.scrollTo(0, 0);

let Email = ref("");
let Password = ref("");
let RePassword = ref("");
let Username = ref("");
let SigningUp = ref(false);
let DOB = ref(true);
let signIn = ref(true);

const EmailValidation = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
const UserNameValidation = new RegExp('[A-Za-z_][A-Za-z\\d_]');


function UserClicksSignInOrSignUp(){
  Email.value = "";
  Password.value = "";
  RePassword.value = "";
  Username.value = "";
  signIn.value = !signIn.value;
}

function SignUp (){
  if(Email.value && Password.value && Username.value && RePassword.value){
    if(Password.value.trim() === RePassword.value.trim()){

      if(EmailValidation.test(Email.value)){

        if(Username.value.length >= 4){

          if(UserNameValidation.test(Username.value)){

            fire.FirestoreDB().collection("Mixers")
                .where("Username", "==", Username.value)
                .get()
                .then((doc)=>{
                  if(doc.empty){
                    fire.NewUser(Username.value, Email.value, Password.value);
                    SigningUp.value = true;

                  }else{
                    fire.ErrorMessage.value = "This username is already taken!"
                  }
                })

          }else{
            fire.ErrorMessage.value = "Invalid Username"

          }
        }else{
          fire.ErrorMessage.value = "Username but be 4-15 characters long"

        }
      }else{
        fire.ErrorMessage.value = "Not a valid Email!";

      }
    }else{
      fire.ErrorMessage.value = "Passwords Don't Match!";

    }
  }else{
    fire.ErrorMessage.value = "Please fill out all fields"

  }


}

function SignIn(){
  fire.SignInUser(Email.value, Password.value);
  SigningUp.value = true;
  setTimeout(()=>{
    if(!fire.ErrorMessage.value){
      router.push('/');
    }else{
      SigningUp.value = false;
    }

    Email.value = '';
    Password.value = '';
  }, 1000);
}


</script>




<template>

  <div v-if="SigningUp || fire.ErrorMessage.value" class="Black-Overlay"></div>
  <div v-if="fire.ErrorMessage.value" id="Error" class="text-center col-md-7 col-10 mx-auto p-md-4 p-2">
    <h3>Error</h3>
    <br>
    <p>{{fire.ErrorMessage}}</p>
    <button @click="fire.ErrorMessage.value = '';">Okay</button>
  </div>

  <div class="container-fluid mx-auto text-center Main-Background" style="margin-top: 5em; height: 40em;">

    <div class="col-md-6 mx-auto Main-Sign p-md-5 p-3" v-if="!signIn">
      <img src="../assets/FinishedLogo.png" class="img-fluid pb-3 Logo" alt="">
      <div class="d-flex">
        <img src="../assets/Icons/usernameIcon.png" class="icon-sm img-fluid mr-3" alt="">
        <input type="text" class="simple-input" placeholder="Username" v-model="Username">
      </div>
      <br>

      <div class="d-flex">
        <img src="../assets/Icons/emailIcon.png" class="icon-sm img-fluid mr-3" alt="">
        <input type="text" class="simple-input" placeholder="Email" v-model="Email">
      </div>

      <br>

      <div class="d-flex">
        <img src="../assets/Icons/Password.png" class="icon-sm img-fluid mr-3" alt="">
        <input type="password" class="simple-input" placeholder="Password" v-model="Password">
      </div>

      <br>

      <div class="d-flex">
        <img src="../assets/Icons/RePassword.png" class="icon-sm img-fluid mr-3" alt="">
        <input type="password" class="simple-input" placeholder="Re-Enter Password" v-model="RePassword">
      </div>

      <br>

      <button class="Button " @click="SignUp">Sign Up</button>
      <p>Already have an account? <b class="Hover" @click="UserClicksSignInOrSignUp">Login</b></p>

    </div>

    <!--============================================================================================ -->

    <div class="col-md-6 mx-auto Main-Sign p-md-5 p-3" v-else>
      <img src="../assets/FinishedLogo.png" class="img-fluid pb-3 Logo" alt="">

      <div class="d-flex">
        <img src="../assets/Icons/emailIcon.png" class="icon-sm img-fluid mr-3" alt="">
        <input type="text" class="simple-input" placeholder="Email" v-model="Email">
      </div>

      <br>

      <div class="d-flex">
        <img src="../assets/Icons/Password.png" class="icon-sm img-fluid mr-3" alt="">
        <input type="password" class="simple-input" placeholder="Password" v-model="Password">
      </div>

      <br>

      <button class="Button " @click="SignIn">Sign In</button>
      <p>Don't have an account? <b class="P-Hover" @click="UserClicksSignInOrSignUp">Sign Up</b></p>

    </div>

  </div>





</template>




<style scoped>
.Main-Background{
  background: url("../assets/StockImage1.jfif") no-repeat center;
  background-size: cover;
  padding-top: 4em;
}

#Error{
  position: fixed;
  right: 0;
  left: 0;
  z-index: 2000;
  background-color: #F3F3F3;
  height: 50%;
}

.Main-Sign{
  background: rgba(243,243,243, .85);
  border-radius: 1em;
}

.Logo{
  max-height: 4em;
}

.Button{
  border: none;
  border-radius: 50em;
  height: 4em;
  aspect-ratio: 2/1;
  background-color: white;
}

.Hover:hover{
  text-decoration: underline;
  cursor: pointer;
}



</style>
