<template>
  <div>
    <router-link to="/">home</router-link>
    <router-link to="/about">about</router-link>
    <router-view />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useService } from "@/utils/services";
export default {
  setup(...args) {
    const { user } = useService(({ user }) => ({ user }));
    onMounted(() => {
      user.api(3).then((res) => {
        console.log(res);
      });
      console.log("%c[ services ]: ", "color: #bf2c9f; background: pink; font-size: 13px;");
    });
  }
};
</script>

<style lang="scss">
#root {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
