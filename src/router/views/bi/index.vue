<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Business Inteligence",
    meta: [
      {
        name: "bi",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Business Intelligence",
      items: [
        {
          text: "Business Intelligence",
          href: "/",
        },
        {
          text: "index",
          active: true,
        },
      ],
        businessIntelligencies: []
    };
  },
  mounted() {
    const vm = this
    this.$http.get('businessIntelligence/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then(response => {
        vm.businessIntelligencies = response.data;
        // eslint-disable-next-line no-console
        console.log(response.data)
    });
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Formulario</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Cadastrados</h4>
            <div class="table-responsive mt-4">
              <table class="table table-centered">
                <thead>
                  <th>Titulo</th>
                  <th>Descricao</th>
                  <th>Acoes</th>
                </thead>
                <tbody>
                  <tr v-for="(bi, idx) in businessIntelligencies" :key="idx">
                    <td>
                      <p class="mb-0">{{bi.title}}</p>
                    </td>
                    <td>
                      <p class="mb-0">{{bi.description}}</p>
                    </td>
                    <td>
                      <p class="mb-0">{{bi.createdAt}}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  
</template>
