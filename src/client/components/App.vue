<template>
  <div id="app" class="app">
    <FinanceComponent />
  </div>
</template>

<script>
import FinanceComponent from "./FinanceComponent.vue";
import "../assets/scss/style.scss";

export default {
  name: "app",
  components: {
    FinanceComponent
  }
};
</script>
