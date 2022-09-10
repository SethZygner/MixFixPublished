import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import firebase from "firebase/compat";
import {useRouter} from "vue-router/dist/vue-router.mjs";
import {reactive, ref} from "vue";


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

let FirestoreDB = firebase.firestore;



let UserInformation = reactive([]);
let Users = reactive([]);
let LocalStorage = window.localStorage;
let HasProfilePicture = ref(false);
let LocalDrinks = reactive([]);
let ErrorMessage = ref("");
let SavedDrinksArray = reactive([]);


let d = new Date();

onAuthStateChanged(getAuth(), ()=>{
    if(getAuth().currentUser){
        GetBasicUserInformation();
    }
})


function NewUser(Username, Email, Password){
    createUserWithEmailAndPassword(getAuth(), Email, Password)
        .then((result)=>{
            let UserID = result.user.uid;
            FirestoreDB()
                .collection("Mixers")
                .doc(UserID)
                .set({
                    Email: Email,
                    Username: Username,
                    Date: d.getTime()/1000
                })
                .then(()=>{
                    FirestoreDB()
                        .collection("Mixers")
                        .doc(UserID)
                        .update({
                            UserID: UserID
                        })
                        .then(()=>{
                            let router = useRouter();
                            router.push('/');
                        })


                })
        })
}

function SignInUser(Email, Password){
    signInWithEmailAndPassword(getAuth(),Email, Password)
        .catch((e)=>{
            if(e.message === "Firebase: Error (auth/user-not-found)."){
                ErrorMessage.value = "This user doesn't exist";
            }

        })
}

function PostDrink(DrinkObject){

    if(DrinkObject.strDrinkThumb){
        firebase.storage().ref("PublicDrinkImages/"+getAuth().currentUser.uid+'/'+DrinkObject.idDrink)
            .put(DrinkObject.strDrinkThumb)
            .then((snapshot)=>{
                snapshot.ref.getDownloadURL()
                    .then((URL)=>{
                        DrinkObject.strDrinkThumb = URL.toString();
                    })
                    .then(()=>{

                        SendDrink();
                    })
            })
    }else{
        SendDrink();
    }

    function SendDrink(){
        FirestoreDB()
            .collection("PublicDrinks")
            .doc(DrinkObject.idDrink)
            .set(DrinkObject)
            .then(()=>{
                FirestoreDB()
                    .collection("Mixers")
                    .doc(getAuth().currentUser.uid)
                    .collection("PublicDrinks")
                    .doc(ID)
                    .set(DrinkObject)
                    .then(()=>{
                        GetMadeDrinks();
                    });
            })
    }



}

function GetBasicUserInformation(){
    //If this local storage doesn't have the user's information, call the database to create one to save amounts of reads and write
    UserInformation.length = 0;
    FirestoreDB().collection("Mixers")
        .doc(getAuth().currentUser.uid)
        .get()
        .then((Mixer)=>{
            UserInformation.push(Mixer.data());
            GetSavedDrinks();
            GetMadeDrinks();
        })
}

function GetSavedDrinks(){
        FirestoreDB()
            .collection("Mixers")
            .doc(getAuth().currentUser.uid)
            .collection("SavedDrinks")
            .get()
            .then((drinks)=>{
                SavedDrinksArray = [];
                drinks.forEach((drink)=>{
                    SavedDrinksArray.push(drink.data());
                })
                UserInformation.push(SavedDrinksArray)
            })

}

function GetMadeDrinks(){

        FirestoreDB()
            .collection("Mixers")
            .doc(getAuth().currentUser.uid)
            .collection("PublicDrinks")
            .get()
            .then((drinks)=>{
                let MadeDrinksArray = [];
                drinks.forEach((drink)=>{
                    MadeDrinksArray.push(drink.data());
                })
                UserInformation.push(MadeDrinksArray)
            })


}

function GetPublicDrinks(){
        FirestoreDB()
            .collection("PublicDrinks")
            .get()
            .then((drinks)=>{
                LocalDrinks.length = 0;
                drinks.forEach(drink=> LocalDrinks.push(drink.data()))
            })
}

function GetAllUsers(){
        FirestoreDB()
            .collection("Mixers")
            .get()
            .then((data)=>{
                data.forEach((Mixer)=>{
                    Users.push(Mixer.data())
                })
            })



}

function AddDrinkToFavorites(drink){
    LocalStorage.removeItem(getAuth().currentUser.uid+'-SavedDrinks');
    FirestoreDB()
        .collection('Mixers')
        .doc(getAuth().currentUser.uid)
        .collection('SavedDrinks')
        .doc(drink.idDrink)
        .set(drink)
        .then(()=>{
            GetBasicUserInformation();
        })
}

function RemoveDrinkFromFavorites(drink){
    FirestoreDB().collection("Mixers")
        .doc(getAuth().currentUser.uid)
        .collection('SavedDrinks')
        .doc(drink.idDrink)
        .delete()
        .then(()=>{
            GetBasicUserInformation();
        })
}

GetAllUsers();
GetPublicDrinks();

//Admin Functions
function ToggleUserInformation(action){
    switch (action) {
        case 'Add':
            FirestoreDB()
                .collection("Mixers")
                .get()
                .then((query)=>{
                    query.forEach((doc)=>{
                        doc.ref.update({
                            DrinksMade: 0
                        })
                    })
                })
        break;
    }
}



//Function exports
export default {
    //These are functions
    NewUser,
    signOut,
    PostDrink,
    GetBasicUserInformation,
    AddDrinkToFavorites,
    RemoveDrinkFromFavorites,
    SignInUser,

    //These are variables
    firebase,
    FirestoreDB,
    UserInformation,
    HasProfilePicture,
    Users,
    LocalDrinks,
    ErrorMessage,
    SavedDrinksArray
}
