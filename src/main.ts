import { createApp } from "vue";
import "element-plus/theme-chalk/index.css";
import "./style.less";
import ElementPlus from "element-plus";
import App from "./App.vue";

createApp(App).use(ElementPlus).mount("#app");
