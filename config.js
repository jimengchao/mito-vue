module.exports = {
  host: "localhost", //想要本地打开的host，多为localhost和本级ip
  port: "8701", //想要打开的端口
  publicPath: "/", //静态文件的publicPath
  title: "平台", //index.html的title
  environments: {
    // 各个环境代理api
    dev: {
      service: "http://192.168.110.250:5002",
      env: "dev"
    },
    test: {
      service: "https://www.xxx.net.cn/api",
      env: "test"
    },
    prod: {
      service: "https://www.xxx.net.cn/api",
      env: "prod"
    }
  }
};
