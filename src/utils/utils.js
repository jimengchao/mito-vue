const formatUrlPath_rfs = /\{([\w.-]+)?\}/;
const formatUrlPath_rfg = /\{([\w.-]+)?\}/gm;
export default {
  getDate() {
    console.log(Date.now());
  },

  formatUrlPath(url, params) {
    url = url.replace(formatUrlPath_rfg, function (sn) {
      var mResult = formatUrlPath_rfs.exec(sn);
      var paramName = mResult[1];
      var val = params[paramName];

      if (val) {
        delete params[paramName];
      }

      return val == null ? "" : val;
    });

    return url;
  }
};
