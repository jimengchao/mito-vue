<template>
  <div class="home">
    <h1 ref="refDom">This is an home page</h1>
  </div>
</template>
<script>
import { ref, setup, onMounted } from "vue";

export default {
  setup(props) {
    const refDom = ref();

    onMounted(() => {
      console.log(refDom);
    });

    return {
      refDom
    };
  }
};
</script>
