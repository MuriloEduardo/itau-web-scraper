<template>
  <div id="app">
    <FinanceComponent/>
  </div>
</template>

<script>
import FinanceComponent from "./components/FinanceComponent.vue";

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
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>
