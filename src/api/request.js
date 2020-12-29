import { $xltApi } from "@/utils/xltApi";

if (!window.location.origin) {
  window.location.origin =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port ? ":" + window.location.port : "");
}

$xltApi.setDefaultBaseURL(SERVICE ? SERVICE : window.location.origin + "/api/overseas");

// 配置 http 自定义请求头字段及请求数据格式化器
$xltApi.setDefaultCommonHeader({
  common: {
    "Content-Type": "application/json"
  }
});

export { $xltApi };
