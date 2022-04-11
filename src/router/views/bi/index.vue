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
        resultPath: '',
        searchsId: []
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
        businessIntelligencies: [],
        searchsData: [],
        searchList: [{value: ''}],
    };
  },
  mounted() {
    const vm = this
    this.$http.get('businessIntelligence/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then(response => {
        vm.businessIntelligencies = response.data;
    });
    this.$http.get('admin/search/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then(response => {
        vm.searchsData = response.data.body;
    });
    
  },
  methods: {
    async submit() {
      
      this.loading = true;
      
      await this.setSearchId()

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
    },
    async setSearchId(){
      const vm = this
      this.searchList.forEach(search => {
        vm.form.searchsId.push(search.value)
      });
    },
    addSearch(){
      this.searchList.push({
        value: '',
      })
    },
    rmvSearch(idx){
      this.searchList.splice(idx, 1)
    }
  }
}
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

              <div class="row mb-4">
                <div class="col-lg-5"></div>
                <h2 class="col-lg-2">Pesquisas</h2>
                <div class="col-lg-4">
                </div>
                <div class="col-lg-1">
                  <b-button variant="outline-info" class="btn btn-rounded" style="float:right" @click="addSearch()">
                    +
                  </b-button>
                </div>
              </div>
              <div class="form-group row mb-4" v-for="(search, idx) in searchList" :key="idx">
                <label for="projectdesc" class="col-form-label col-lg-2"
                  >Pesquisa</label
                >
                <div class="col-lg-9">
                  <select class="form-control" v-model="search.value">
                    <option value="">Selecione...</option>
                    <option v-for='(search, j) in searchsData' :value="search.id" :key='j'>
                      {{search.UserRequester.name}} | {{search.city}}/{{search.state}} - {{search.startDate}}   
                    </option>
                  </select>
                </div>
                <div class="col-lg-1">
                 <b-button variant="outline-danger" class="btn btn-rounded" @click="rmvSearch(idx)">
                    <i class="bx bxs-trash"></i>
                  </b-button>
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
