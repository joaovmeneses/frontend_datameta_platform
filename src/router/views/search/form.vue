<script>
import vue2Dropzone from "vue2-dropzone";
import DatePicker from "vue2-datepicker";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

export default {
  components: { Layout, PageHeader, vueDropzone: vue2Dropzone, DatePicker },
  mounted() {
    const vm = this
    const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('userToken') }
    this.$http.get('user/role/2', { headers })
    .then((res) => {
      vm.users = res.data.body
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
      alert("Houve um erro ao tentar resgatar os usuarios!")
    })
  },
  data() {
    return {
      title: "Nova Pesquisa",
      users: [],
      block: false,
      loading: false,
      userSelected: {},
      search: {
        description: '',
        methodology: '',
        searchType: '',
        registred: false,
        city: '',
        state: '',
        startDate: '',
        endDate: '',
        searchMongoId: null,
        userRequesterId: 2,
      },
      file: {
        searchId: '',
        data: null,
        show: false,
        loading: false
      },
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 5,
        headers: { "My-Awesome-Header": "header value" }
      },
    }
  },
  methods: {
    addZeroIfNeed(element) {
      if(element < 9) {
        return `0${element}`
      } else {
        return element
      }
    },
    setDescription(description) {
      this.search.description = description
      // eslint-disable-next-line no-console
      console.log(this.search)
    },
    async adjustDate(date) {
      return `${this.addZeroIfNeed(await date.getDate())}/${this.addZeroIfNeed(await date.getMonth() + 1)}/${await date.getFullYear()}`
    },
    async submit() {
      const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('userToken') }
      this.loading = true
      const vm = this
      this.search.startDate = await this.adjustDate(this.search.startDate)
      this.search.endDate = await this.adjustDate(this.search.endDate)
      this.$http.post('search/', this.search  , { headers }).then((res) => {
        vm.loading = false
        if(res.data.status === 200 && res.data.body.id) {
          this.file.searchId = res.data.body.searchMongoId
          vm.block = true
          this.file.show = true
          alert("Agora ja pode enviar o resultado !")
        }
      })
    },
    submitResult() {
      this.file.loading = true
      const vm = this
      const formData = new FormData()
      formData.append('file', this.$refs.myVueDropzone.dropzone.files[0])
      const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + sessionStorage.getItem('userToken') }
      this.$http.put(`search/${this.file.searchId}/result`, formData  , { headers }).then((res) => {
        if(res.data.status === 200 && res.data.body === 1) {
          alert("Resultado enviado com sucesso! Voce sera redirecionado.")
          this.$router.push({
            name: 'default'
          })
        } else {
          alert('Houve um erro no servidor!')
        }
        vm.file.loading = false
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        alert('Houve um erro!')
        vm.file.loading = false
      })
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Preencha os Campos</h4>
            <form>
              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Solicitante</label
                >
                <div class="col-lg-10">
                  <select class="form-control" v-model="search.userRequesterId" >
                    <option v-for='user in users' :value="user.id" :key='user.id'>
                      {{user.name}} | {{user.PoliticalParty.name}} - {{user.PoliticalParty.acronym}}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group row mb-4">
                <label for="projectdesc" class="col-form-label col-lg-2"
                  >Descricao</label
                >
                <div class="col-lg-10">
                  <textarea
                    v-model="search.description"
                    :disabled="block"
                    id="projectdesc"
                    class="form-control"
                    rows="3"
                    placeholder="Coloque uma breve descricao..."
                  ></textarea>
                </div>
              </div>
              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Estado</label
                >
                <div class="col-lg-10">
                  <input
                    :disabled="block"
                    id="projectname"
                    v-model="search.state"
                    type="text"
                    class="form-control"
                    placeholder="Nome do Usuario..."
                  />
                </div>
              </div> 
              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Cidade</label
                >
                <div class="col-lg-10">
                  <input
                    :disabled="block"
                    id="projectname"
                    v-model="search.city"
                    type="text"
                    class="form-control"
                    placeholder="Nome do Usuario..."
                  />
                </div>
              </div> 
              <div class="form-group row mb-4">
                <label class="col-form-label col-lg-2">Data Inicial</label>
                <div class="col-lg-10">
                  <date-picker :disabled="block" v-model="search.startDate" format="DD/MM/YYYY" :first-day-of-week="1" lang="pt"></date-picker>
                </div>
              </div>

              <div class="form-group row mb-4">
                <label class="col-form-label col-lg-2">Data Final</label>
                <div class="col-lg-10">
                  <date-picker :disabled="block" v-model="search.endDate" format="DD/MM/YYYY" :first-day-of-week="1" lang="pt"></date-picker>
                </div>
              </div>

              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Metodologia</label
                >
                <div class="col-lg-10">
                  <input
                    :disabled="block"
                    id="projectname"
                    v-model="search.methodology"
                    type="text"
                    class="form-control"
                    placeholder="Nome do Usuario..."
                  />
                </div>
              </div>

              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Tipo de Pesquisa</label
                >
                <div class="col-lg-10">
                  <input
                    :disabled="block"
                    id="projectname"
                    v-model="search.searchType"
                    type="text"
                    class="form-control"
                    placeholder="Nome do Usuario..."
                  />
                </div>
              </div> 

              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Registrado no PesqEle (TRE)</label
                >
                <div class="col-lg-10">
                  Sim <br>
                  <input
                    :disabled="block"
                    type="checkbox"
                    v-model="search.registed"
                    @change="test()"
                  />
                </div>
              </div> 
            </form>
            <div class="row justify-content-end">
              <div class="col-lg-10">
                <button @click="submit()" class="btn btn-primary" :disabled="block || loading">
                  <div v-if='loading' class="spinner-border" role="status">
                  </div>
                  <div v-else>
                    Concluir Pesquisa
                  </div>
                </button>
              </div>
            </div>
            <br>
            <div class="row mb-4" v-if="file.show">
              <br>
              <br>
              <br>
              <hr>
              <label class="col-form-label col-lg-2">Enviar Resuldato (.csv)</label>
              <div class="col-lg-10">
                <vue-dropzone
                  id="dropzone"
                  ref="myVueDropzone"
                  :use-custom-slot="true"
                  :options="dropzoneOptions"
                >
                  <div class="dropzone-custom-content">
                    <i class="display-4 text-muted bx bxs-cloud-upload"></i>
                    <h4>Solte os arquivos aqui...</h4>
                  </div>
                </vue-dropzone>
              </div>
              <div class="row justify-content-end">
              <div class="col-lg-10">
              <br>
                <button @click="submitResult()" class="btn btn-primary">
                  <div v-if='file.loading'  class="spinner-border" role="status">
                  </div>
                  <div v-else>
                    Enviar Resultado
                  </div>

                </button>
              </div>
            </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>