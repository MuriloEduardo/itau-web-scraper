<template>
  <div>
    <h1>Itaú Web Scraper</h1>
    <h5 v-if="error" class="error">{{ error }}</h5>
    <form class="main-form" @submit.prevent="submit" action="#" method="post">
      <img alt="Itaú Logo" src="../assets/itau.svg" width="100" class="logo">
      <div class="inputs">
        <input v-model="agency" placeholder="Agência" v-mask="'####'" autofocus>
        <input v-model="account" placeholder="Conta" v-mask="'#####-#'">
        <input v-model="password" placeholder="Senha" type="password">
      </div>
      <button type="submit">Entrar</button>
    </form>
    <div v-if="loading" class="loading">
      <h4>Carregando</h4>
      <p>Isso levará no mínimo 30 segundos.</p>
      <small>Suas informações bancárias estão sendo buscadas.</small>
    </div>
    <h3 v-if="balance">
      <small>Saldo:</small>
      <span>{{ balance }}</span>
    </h3>
    <p v-if="createdAt">{{ createdAt }}</p>
    <table v-if="extract.length">
      <thead>
        <th>Data</th>
        <th>Descrição</th>
        <th>Valor</th>
      </thead>
      <tbody>
        <tr
          v-for="(launch, index) in extract"
          v-bind:item="launch"
          v-bind:index="index"
          v-bind:key="index"
        >
          <td>{{ launch.date }}</td>
          <td>{{ launch.description }}</td>
          <td>{{ launch.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";

import FinanceService from "../services/FinanceService";

export default {
  name: "FinanceComponent",
  data() {
    return {
      extract: [],
      balance: "",
      createdAt: "",
      error: "",
      agency: "",
      account: "",
      password: "",
      loading: false
    };
  },
  methods: {
    submit() {
      this.loading = true;

      FinanceService.getFinances({
        agency: this.agency,
        account: this.account,
        password: this.password
      })
        .then(response => {
          const { balance, createdAt, extract } = response.data;

          this.balance = balance;
          this.createdAt = createdAt;
          this.extract = extract;

          this.loading = false;
        })
        .catch(error => {
          this.error = error;
          this.loading = false;
        });
    }
  },
  directives: { mask }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  text-align: center;
  color: #fff;
}
.main-form {
  display: flex;
  width: 550px;
  flex-direction: column;
}
.logo {
  margin: 0.5rem auto;
}
.inputs {
  display: flex;
}
.main-form .inputs input {
  width: 100%;
  margin: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  padding: 24px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  outline-color: rgba(255, 255, 255, 0.05);
}
.main-form button {
  margin: 0.5rem;
  padding: 24px;
  border-radius: 4px;
  background-color: #ec7000;
  border: none;
  color: #fff;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-size: 1rem;
  outline-color: rgba(255, 255, 255, 0.05);
  font-weight: bold;
}
.main-form button:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
.main-form input::placeholder {
  color: #fff;
}
.error {
  color: #fff;
  font-size: 1rem;
}
.loading {
  color: #fff;
  font-size: 1rem;
}
.loading h4:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4, end) 900ms infinite;
  animation: ellipsis steps(4, end) 900ms infinite;
  content: "\2026"; /* ascii code for the ellipsis character */
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
</style>
