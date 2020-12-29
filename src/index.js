import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App";
import router from "./router";
import store from "./store";
import utils from "./utils";
import apis from "./api";
import { initApi } from "./utils/services";

import "element-plus/lib/theme-chalk/index.css";
import "./index.scss";

initApi(apis);

const vue = createApp(App);

vue.use(store).use(router).use(ElementPlus).use(utils).mount("#root");
