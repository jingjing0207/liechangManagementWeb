import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import uploader from 'vue-simple-uploader';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/js/jquery-1.8.3.min.js';
import "babel-polyfill";
// import '../static/css/public.css'

Vue.use(ElementUI);
Vue.use(uploader);
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
