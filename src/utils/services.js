const services = {};
function createService(apis) {
  for (let service of Object.keys(apis)) {
    services[service] = bindApiModel(apis[service]);
  }
  return services;
}

function bindApiModel(serviceItems) {
  let services = {};
  for (let service of Object.keys(serviceItems)) {
    services[service] = (...args) => {
      const { api, model } = serviceItems[service](...args);
      return api.then((res) => {
        const payload = typeof model === "function" ? model(res) : res;
        return payload;
      });
    };
  }
  return services;
}

export const initApi = (apis) => {
  createService(apis);
};

export const useService = (fn = () => {}) => {
  return fn(services);
};
