<template>
  <div class="finance">
    <div class="form">
      <h1>Itaú Web Scraper</h1>
      <form class="main-form" @submit.prevent="submit" action="#" method="post">
        <img alt="Itaú Logo" src="../assets/img/itau.svg" width="100" class="logo" />
        <div class="inputs">
          <div class="form-group">
            <label for="agency">Agência*</label>
            <input
              id="agency"
              name="agency"
              v-model="agency"
              placeholder="1234"
              v-mask="'####'"
              autofocus
            />
            <small v-if="errors.agency">{{ errors.agency }}</small>
          </div>
          <div class="form-group">
            <label for="account">Conta*</label>
            <input
              id="account"
              name="account"
              v-model="account"
              placeholder="12345-6"
              v-mask="'#####-#'"
            />
            <small v-if="errors.account">{{ errors.account }}</small>
          </div>
          <div class="form-group">
            <label for="password">Senha*</label>
            <input
              id="password"
              name="password"
              v-model="password"
              placeholder="*******"
              type="password"
            />
            <small v-if="errors.password">{{ errors.password }}</small>
          </div>
        </div>
        <button type="submit">Entrar</button>
      </form>
      <div v-if="loading" class="loading">
        <h4>Carregando</h4>
        <p>Isso levará no mínimo 30 segundos.</p>
        <small>Suas informações bancárias estão sendo buscadas.</small>
      </div>
    </div>
    <div class="extract">
      <h5 v-if="errors.api" class="error">{{ errors.api }}</h5>
      <small v-if="createdAt" class="createdAt">{{ createdAt | ptBrTimestamps }}</small>
      <div class="balance" v-if="balance">
        <small>Saldo</small>
        <h3>{{ balance }}</h3>
      </div>
      <div v-if="extract.length">
        <h4>Extrato dos último 90 dias</h4>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
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
      </div>
    </div>
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
      errors: {
        api: null,
        agency: null,
        account: null,
        password: null
      },
      agency: "",
      account: "",
      password: "",
      loading: false
    };
  },
  methods: {
    submit() {
      if (!this.agency) this.errors.agency = "Campo obrigatório";
      else this.errors.agency = null;

      if (!this.account) this.errors.account = "Campo obrigatório";
      else this.errors.account = null;

      if (!this.password) this.errors.password = "Campo obrigatório";
      else this.errors.password = null;

      if (this.errors.agency || this.errors.account || this.errors.password)
        return false;

      this.loading = true;
      this.errors.api = undefined;

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
          this.errors.api = error.response ? error.response.data.error : error;

          this.loading = false;
        });
    }
  },
  directives: { mask },
  watch: {
    agency: function(val) {
      if (val && val.length != 4) {
        this.errors.agency = "Deve ter 4 digitos";
      } else {
        this.errors.agency = null;
      }
    },
    account: function(val) {
      if (val && val.length != 7) {
        this.errors.account = "Deve ter 6 digitos";
      } else {
        this.errors.account = null;
      }
    },
    password: function(val) {
      if (this.errors.password && val) {
        this.errors.password = null;
      }
    }
  }
};
</script>
