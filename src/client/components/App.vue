<template>
  <div id="app" class="app">
    <FinanceComponent/>
  </div>
</template>

<script>
import FinanceComponent from "./FinanceComponent.vue";

export default {
  name: "app",
  components: {
    FinanceComponent
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  background-color: #ec7000;
  margin: 0;
}
</style>
