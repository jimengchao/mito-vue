import utils from "./utils";

export default {
  install(app) {
    app.config.globalProperties.$utils = utils;
  }
};
