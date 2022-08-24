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



let UserInformation = reactive({});
let Users = reactive([]);
let LocalStorage = window.localStorage;
let HasProfilePicture = ref(false);
let LocalDrinks = reactive([]);
let ErrorMessage = ref("");


let d = new Date();

onAuthStateChanged(getAuth(), ()=>{
    if(getAuth().currentUser){
        GetBasicUserInformation();
        GetSavedDrinks();
        GetMadeDrinks();
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
    //If this local storage doesn't have the user's information, call the database to create one to save amounts of reads and writes
    if(!LocalStorage.getItem(getAuth().currentUser.uid+'-UserInformation')){
        FirestoreDB().collection("Mixers")
            .doc(getAuth().currentUser.uid)
            .get()
            .then((Mixer)=>{
                LocalStorage.setItem(getAuth().currentUser.uid+'-UserInformation', JSON.stringify(Mixer.data()));

            })
            .then(()=>{
                UserInformation['GeneralInformation'] = JSON.parse(LocalStorage.getItem(getAuth().currentUser.uid+'-UserInformation'));


            })
            .then(()=>{

                if(UserInformation.GeneralInformation['ProfilePicture']){
                    HasProfilePicture.value = true;

                }
            })
    }else{
        UserInformation['GeneralInformation'] = JSON.parse(LocalStorage.getItem(getAuth().currentUser.uid+'-UserInformation'));
        if(UserInformation.GeneralInformation['ProfilePicture']){
            HasProfilePicture.value = true;
        }
    }
}

function GetSavedDrinks(){
    //If the local storage doesn't have the saved drinks or the updated version it will get it for later use
    if(!LocalStorage.getItem(getAuth().currentUser.uid+'-SavedDrinks')){
        FirestoreDB()
            .collection("Mixers")
            .doc(getAuth().currentUser.uid)
            .collection("SavedDrinks")
            .get()
            .then((drinks)=>{
                let SavedDrinksArray = [];
                drinks.forEach((drink)=>{
                    SavedDrinksArray.push(drink.data());
                })
                LocalStorage.setItem(getAuth().currentUser.uid+'-SavedDrinks', JSON.stringify(SavedDrinksArray));
                UserInformation['SavedDrinks'] = JSON.parse(LocalStorage.getItem(getAuth().currentUser.uid+'-SavedDrinks'));
            })
    }else{
        UserInformation['SavedDrinks'] = JSON.parse(LocalStorage.getItem(getAuth().currentUser.uid+'-SavedDrinks'));
    }
}

function GetMadeDrinks(){
    if(!LocalStorage.getItem(getAuth().currentUser.uid+'-MadeDrinks')){

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
                LocalStorage.setItem(getAuth().currentUser.uid+'-MadeDrinks', JSON.stringify(MadeDrinksArray));
                UserInformation['MadeDrinks'] = JSON.parse(LocalStorage.getItem(getAuth().currentUser.uid+'-MadeDrinks'));
            })
    }else{
        UserInformation['MadeDrinks'] = JSON.parse(LocalStorage.getItem(getAuth().currentUser.uid+'-MadeDrinks'));
    }


}



function GetPublicDrinks(){
    if(!LocalStorage.getItem('LastUpdatedPublicDrinks')){
        FirestoreDB()
            .collection("PublicDrinks")
            .get()
            .then((drinks)=>{
                LocalDrinks.length = 0;
                drinks.forEach((drink)=>{
                    LocalDrinks.push(drink.data());

                })
                console.log(LocalDrinks);
                LocalStorage.setItem('LastUpdatedPublicDrinks', JSON.stringify(LocalDrinks));
            })
    }else{
        LocalDrinks.length = 0;
        LocalDrinks.push(...JSON.parse(LocalStorage.getItem('LastUpdatedPublicDrinks')));
    }

}

function GetAllUsers(){
    if(!LocalStorage.getItem('AllUsers')){
        FirestoreDB()
            .collection("Mixers")
            .get()
            .then((data)=>{
                data.forEach((Mixer)=>{
                    Users.push({
                        Username: Mixer.data().Username,
                        ...Mixer.data().ProfilePicture && {
                            ProfilePicture: Mixer.data().ProfilePicture
                        },
                        UserID: Mixer.id
                    })
                })
            })
            .then(()=>{
                LocalStorage.setItem('AllUsers', JSON.stringify(Users));
            })
    }else{
        Users.push(...JSON.parse(LocalStorage.getItem('AllUsers')));
    }

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
            GetSavedDrinks();
        })
}

function RemoveDrinkFromFavorites(drink){
    FirestoreDB().collection("Mixers")
        .doc(getAuth().currentUser.uid)
        .collection('SavedDrinks')
        .doc(drink.idDrink)
        .delete()
        .then(()=>{
            LocalStorage.removeItem(getAuth().currentUser.uid+'-SavedDrinks');
            GetSavedDrinks();
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
    GetPublicDrinks,
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
    ErrorMessage
}
