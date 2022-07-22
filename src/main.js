import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3TouchEvents from "vue3-touch-events";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import {Swiper, SwiperSlide} from "swiper/vue";


const app = createApp(App);

app.use(router);
app.use(Vue3TouchEvents);


app.mount('#app')

