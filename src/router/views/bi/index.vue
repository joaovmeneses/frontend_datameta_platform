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
      loading: false, 
      form: {
        title: '',
        url: '',
        description: '',
        resultPath: ''
      },
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
    });
  },
  methods: {
    submit() {
      this.loading = true;
      this.$http.post('businessIntelligence/', this.form, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then(response => {
        this.loading = false;
        if(response.data.status === 200 && response.data.body > 0) {
          location.reload()
        } else {
        // eslint-disable-next-line no-console
          console.log(response.data)
          alert("Houve um error ao cadastrar a BI")
        }
      })  
    }
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

            <form>
              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Titulo</label
                >
                <div class="col-lg-10">
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder=""
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Link do BI</label
                >
                <div class="col-lg-10">
                  <input
                    v-model="form.url"
                    type="text"
                    placeholder=""
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group row mb-4">
                <label for="projectdesc" class="col-form-label col-lg-2"
                  >Descricao</label
                >
                <div class="col-lg-10">
                  <textarea
                    v-model="form.description"
                    id="projectdesc"
                    class="form-control"
                    rows="3"
                    placeholder="Coloque uma breve descricao..."
                  ></textarea>
                </div>
              </div>
            </form>
             <div class="row justify-content-end">
              <div class="col-lg-10">
                <button @click="submit()" class="btn btn-primary" style="float:right">
                  <div v-if='loading' class="spinner-border" role="status">
                  </div>
                  <div v-else>
                    Concluir
                  </div>
                </button>
              </div>
            </div>
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
