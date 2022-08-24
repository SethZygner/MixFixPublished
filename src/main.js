import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "aos/dist/aos.css"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Styling/SethStrap.css";

//"OneDrive - University of North Carolina at Charlotte"/Desktop/Published/MixFixPublished



const app = createApp(App);

app.use(router);


app.mount('#app')

