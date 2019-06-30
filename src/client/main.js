import Vue from "vue";
import App from "./components/App.vue";
import moment from "moment";

Vue.config.productionTip = false;

Vue.filter("ptBrTimestamps", function(value) {
    if (value) {
        return moment(String(value)).format("DD/MM/YY HH:MM");
    }
});

new Vue({
    render: h => h(App)
}).$mount("#app");
