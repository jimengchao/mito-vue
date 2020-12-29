import axios from "axios";
import qs from "qs";
import { ElMessage } from "element-plus";

const $xltApi = {};
const methods = {
  get: {
    paramsPropName: "params"
  },
  delete: {
    paramsPropName: "params"
  },
  post: {
    paramsPropName: "data"
  },
  put: {
    paramsPropName: "data"
  },
  patch: {
    paramsPropName: "data"
  }
};

/**
 * 设置全局服务器地址
 *
 * @param {string} baseURL - 服务器地址
 */
$xltApi.setDefaultBaseURL = function (baseURL) {
  axios.defaults.baseURL = baseURL;
};

/**
 * 设置全局header
 *
 * @param {object} config - header config对象
 */
$xltApi.setDefaultCommonHeader = function (config = {}) {
  if (Object.keys(config).length) {
    axios.defaults.headers = Object.assign(axios.defaults.headers || {}, config || {});
  }
};

Object.keys(methods).forEach((method) => {
  $xltApi[method] = function (url, params, config) {
    config = Object.assign(config || {}, {
      method: method.toUpperCase(),
      url: url
    });
    config[methods[method].paramsPropName] = params;
    return _xltApi(config);
  };
});

function _xltApi(config) {
  if (config.params) {
    config.params = Object.assign({}, config.params);
  }

  if (config.data || config.params) {
    config.url = _formatUrlPath(config.url, config.data || config.params);
  }

  if (config.data) {
    if (typeof config.data !== "object") {
      var exception = { message: "请求体数据必须是一个对象。" };
      throw exception;
    }
  }

  // var CancelToken = axios.CancelToken;
  // var source = CancelToken.source();

  // config.cancelToken = source.token;

  var promise = axios(config);
  return promise;
}

/**
 * 解析url上的参数
 */
const formatUrlPath_rfs = /\{([\w.-]+)?\}/;
const formatUrlPath_rfg = /\{([\w.-]+)?\}/gm;
function _formatUrlPath(url, params) {
  url = url.replace(formatUrlPath_rfg, function (sn) {
    let mResult = formatUrlPath_rfs.exec(sn);
    let paramName = mResult[1];
    let val = params[paramName];

    if (val) {
      delete params[paramName];
    }

    return val == null ? "" : val;
  });

  return url;
}

//  防止重复请求
const pendingRequestMap = new Map();
/**
 * 添加请求
 * @param {Object} config
 */
const addPending = (config) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join("&");
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequestMap.has(url)) {
        // 如果 pendingRequestMap 中不存在当前请求，则添加进去
        pendingRequestMap.set(url, cancel);
      }
    });
};

/**
 * 移除请求
 * @param {Object} config
 */
const removePending = (config) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join("&");
  if (pendingRequestMap.has(url)) {
    // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pendingRequestMap.get(url);
    cancel(url);
    pendingRequestMap.delete(url);
  }
};

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 * @param {Object} config
 */
export const clearPending = () => {
  for (const [url, cancel] of pendingRequestMap) {
    cancel(url);
  }
  pendingRequestMap.clear();
};

// // 拦截器响应
// function responseEnd(response){

// }

axios.interceptors.request.use(
  (config) => {
    removePending(config); // 在请求开始前，对之前的请求做检查取消操作
    addPending(config); // 添加本次请求到 pending 中

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 拦截器处理
axios.interceptors.response.use(
  (response) => {
    if (response.config?.data) {
      response.config.data = JSON.parse(response.config.data);
    }
    // 对响应数据做处理
    removePending(response.config);

    const bodyData = response.data;
    if (bodyData.errCode != 0) {
      ElMessage.error(bodyData.message);
      return Promise.reject(bodyData);
    }

    return Promise.resolve(bodyData.data);
  },
  function (error) {
    if (error.response) {
      removePending(error.response.config);
    }
    // 对响应错误做处理
    return Promise.reject(error);
  }
);

export { $xltApi };
