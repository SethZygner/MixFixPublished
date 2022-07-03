import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {getDatabase, ref, set, onValue, onChildAdded, update} from "firebase/database";
import firebase from "firebase/compat";
import { getStorage, ref as StorageRef, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA59zeNwzGlJ8Zf9_5IoXRPLeUaEapzk0k",
    authDomain: "mixfix-d6fdb.firebaseapp.com",
    databaseURL: "https://mixfix-d6fdb-default-rtdb.firebaseio.com",
    projectId: "mixfix-d6fdb",
    storageBucket: "mixfix-d6fdb.appspot.com",
    messagingSenderId: "1048303660430",
    appId: "1:1048303660430:web:2d2db683b7f1b8625a88df",
    measurementId: "G-6PKWDEPCBH"
};


firebase.initializeApp(firebaseConfig);

let database = firebase.database;

async function newUser(Username, Email, Password, Description, ImageURL){
    const checkUsername = firebase.database().ref();
    let usernameTaken = false;

   await checkUsername.child("users").get()
        .then((snapshot)=>{
            snapshot.forEach((user)=>{
                if(user.val().Username === Username){
                    usernameTaken = true;
                }
            });
            if(!usernameTaken){
                createUserWithEmailAndPassword(getAuth(), Email, Password)
                    .then((result)=>{
                        setTimeout(()=>{
                            const reference = ref(database(), 'users/'+result.user.uid);
                            set(reference, {
                                Username: Username,
                                Email: Email,
                                ImageURL: ImageURL,
                                Description: Description,
                                Coins: 3,
                                DrinksMade: 0,
                                Followers: 0,
                                Following: 0
                            })
                                .catch((err)=>{
                                    alert(err.message);
                                })
                        }, 500);
                    }).catch((err)=>{
                    switch (err){
                        case "auth/email-already-exists":
                            alert("Email already exists!");
                            break;
                    }
                })
            }else{
                alert("Name already taken!")
            }
        })
}

function logIn(Email, Password){
    signInWithEmailAndPassword(getAuth(), Email, Password)
        .catch((err)=>{
            console.log(err.message);
        })
}

async function publicPost(message){

    await database().ref().child("users").child(getAuth().currentUser.uid.toString()).get()
        .then((user)=>{
            database().ref('publicPosts/')
                .push({
                    Message: message,
                    UserID: getAuth().currentUser.uid,
                    Username: user.val().Username
                })
        })


}

function newDrink(drinkArray) {


    //I know this looks gross with the duplicate code, but it's the only way I got the image to go into the database
    let postKey = database().ref('publicDrinks/').push().key;
    function checkIfImage(){
        if(drinkArray[0].Image){
            firebase.storage().ref("PublicDrinkImages/"+postKey).put(drinkArray[0].Image)
                .then((snapshot)=>{
                    snapshot.ref.getDownloadURL().then((URL)=>{
                        drinkArray[0].Image = URL.toString();
                        database().ref('users/'+getAuth().currentUser.uid+'/publicDrinks/'+postKey).set(drinkArray).then(()=>{
                            database().ref('publicDrinks/'+postKey).set(drinkArray).then(()=>{
                                let drinksMade = 0;
                                database().ref('users/'+getAuth().currentUser.uid).get()
                                    .then((result)=>{
                                        drinksMade = result.val().DrinksMade+1
                                        database().ref('users/'+getAuth().currentUser.uid).update({DrinksMade: drinksMade.valueOf()})
                                    })
                            });
                        });
                    });
                });
        }else{
            database().ref('users/'+getAuth().currentUser.uid+'/publicDrinks/'+postKey).set(drinkArray).then(()=>{
                database().ref('publicDrinks/'+postKey).set(drinkArray).then(()=>{
                    let drinksMade = 0;
                    database().ref('users/'+getAuth().currentUser.uid).get()
                        .then((result)=>{
                            drinksMade = result.val().DrinksMade+1
                            database().ref('users/'+getAuth().currentUser.uid).update({DrinksMade: drinksMade.valueOf()})
                        })
                });
            });
        }
    }


    checkIfImage();


}

function AddToUserDrinkFavorites(data){
    const UserFavorites = ref(database(), 'users/'+getAuth().currentUser.uid+'/UserDrinkFavorites/'+data.DrinkID);
    set(UserFavorites, data);
}

async function CheckIfUserDrinkIsLiked(postID){
    const CheckIfLiked = firebase.database().ref();
    await CheckIfLiked.child('users').child(getAuth().currentUser.uid).child('UserDrinkFavorites').get()
        .then((result)=>{
            result.forEach((drink)=>{
                if(postID === drink.key){
                    return true;
                }
            })
            return false;
        })
}

async function UnAddUserFavorite(postID){
    await database().ref().child('users').child(getAuth().currentUser.uid).child('UserDrinkFavorites').child(postID).remove().then((result)=>{
        console.log("Removed");
    }).catch((err)=>{
        console.log("Not deleted")
    });
}




//Function exports
export default {
    firebase,
    newUser,
    getAuth,
    onAuthStateChanged,
    logIn,
    publicPost,
    newDrink,
    signOut,
    AddToUserDrinkFavorites,
    UnAddUserFavorite,
    database
}
