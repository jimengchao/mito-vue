import { $xltApi } from "./request";
import { addMode } from "@/model";

export default {
  api() {
    return {
      api: $xltApi.post("/usercenter/v2.0/login/login", {
        loginName: "xumiao",
        loginPwd: "bbb8aae57c104cda40c93843ad5e6db8",
        systemCode: "hospital"
      }),
      model: addMode
    };
  }
};
