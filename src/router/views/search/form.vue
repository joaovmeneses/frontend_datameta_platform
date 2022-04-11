<script>
import vue2Dropzone from "vue2-dropzone";
import DatePicker from "vue2-datepicker";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

import { categories } from "../calendar/data-calendar";


export default {
  components: { Layout, PageHeader, vueDropzone: vue2Dropzone, DatePicker },
  mounted() {
    const vm = this
    const headers = { 'Authorization': 'Bearer ' + sessionStorage.getItem('userToken') }
    //get users
    this.$http.get('user/role/2', { headers })
    .then((res) => {
      vm.users = res.data.body
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
      alert("Houve um erro ao tentar resgatar os usuarios!")
    })
    //get states
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/', { headers })
    .then((res) => {
      vm.states = res.data
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
      alert("Houve um erro ao tentar resgatar os estados!")
    })
  },
  data() {
    return {
      title: "Nova Pesquisa",
      users: [],
      block: false,
      loading: false,
      userSelected: {},
      states: [],
      cities: [],
      methodologies: [
        "Telefone",
        "Internet",
        "Presencial"
      ],
      types: [
        "Estimulada",
        "Espontanea",
        "Hibrida"
      ],
      categories: categories,
      search: {
        description: '',
        methodology: '',
        searchType: '',
        registred: false,
        city: '',
        state: '0',
        startDate: '',
        endDate: '',
        questionsId: null,
        maps: [
          {
            link: "",
            title: ""
          },
        ],
        calendarEvents: [
          {
            title: "",
            start: "",
            className: "",
          },
        ],
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
    addMap(){
      this.search.maps.push({
        link: "",
        title: ""
      })
    },
    addCalendarEvent(){
      this.search.calendarEvents.push({
        title: "",
        start: "",
        className: "",
      })
    },
    rmvMap(idx){
      this.search.maps.pop(idx)
    },
    rmvCalendarEvent(idx){
      this.search.calendarEvents.pop(idx)
    },
    getCities() {
      const vm = this
      axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + this.search.state + '/municipios')
      .then((res) => {
        vm.cities = res.data
        vm.search.city ='0'
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        alert("Houve um erro ao tentar resgatar os estados!")
      })
    },
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
          this.file.searchId = res.data.body.questionsId
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
                      {{user.name}} <template v-if="user.PoliticalParty">|  {{user.PoliticalParty.name}} - {{user.PoliticalParty.acronym}} </template>
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
                  <select @change="getCities()" class="form-control" :disabled="block" v-model="search.state" id="">
                    <option value="0">Selecione...</option>
                    <option v-for="state in states" :key="state.id" :value="state.sigla">
                      {{state.nome}} - {{state.sigla}}
                    </option>
                  </select>
                </div>
              </div> 
              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Cidade</label
                >
                <div class="col-lg-10">
                  <select class="form-control" :disabled="block" v-model="search.city" id="">
                    <option value="0">Selecione...</option>
                    <option v-for="city in cities" :key="city.id" :value="city.nome">
                      {{city.nome}}
                    </option>
                  </select>
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
                  <select class="form-control" :disabled="block" v-model="search.methodology" id="">
                    <option v-for="methodology in methodologies" :key="methodology" value="">
                      {{methodology}}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group row mb-4">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Tipo de Pesquisa</label
                >
                <div class="col-lg-10">
                  <select class="form-control" :disabled="block" v-model="search.searchType" id="">
                    <option v-for="type in types" :key="type" value="">
                      {{type}}
                    </option>
                  </select>
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
                  />
                </div>
              </div> 
              <hr>
              <div class="row mb-4">
                <div class="col-lg-5"></div>
                <h2 class="col-lg-2">Mapas</h2>
                <div class="col-lg-4">
                </div>
                <div class="col-lg-1">
                  <b-button variant="outline-info" class="btn btn-rounded" :disabled="block" style="float:right" @click="addMap()">
                    +
                  </b-button>
                </div>
              </div>
              <div class="form-group row mb-4" v-for="(map, idx) in search.maps" :key="idx">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Informacoes:</label
                >
                <div class="col-lg-3">
                  <input
                    :disabled="block"
                    id=""
                    v-model="map.title"
                    type="text"
                    placeholder="Titulo do Mapa"
                    class="form-control"
                  />
                </div>
                
                <div class="col-lg-6">
                  <input
                    :disabled="block"
                    id=""
                    v-model="map.link"
                    placeholder="Link do Mapa"
                    type="text"
                    class="form-control"
                  />
                </div>
                <div class="col-lg-1">
                 <b-button variant="outline-danger" :disabled="block" class="btn btn-rounded" @click="rmvMap(idx)">
                    <i class="bx bxs-trash"></i>
                  </b-button>
                </div>
              </div> 

              <hr>
              <div class="row mb-4">
                <div class="col-lg-5"></div>
                <h2 class="col-lg-4">Datas no Calendario</h2>
                <div class="col-lg-2">
                </div>
                <div class="col-lg-1">
                  <b-button variant="outline-info" class="btn btn-rounded" :disabled="block" style="float:right" @click="addCalendarEvent()">
                    +
                  </b-button>
                </div>
              </div>

              <div class="form-group row mb-4" v-for="(calendarEvent, idx) in search.calendarEvents" :key="calendarEvent.start">
                <label for="projectname" class="col-form-label col-lg-2"
                  >Evento:</label
                >
                <div class="col-lg-3">
                  <date-picker :disabled="block" v-model="calendarEvent.start" format="DD/MM/YYYY" placeholder="Data" :first-day-of-week="1" lang="pt"></date-picker>
                </div>
                
                <div class="col-lg-3">
                  <input
                    :disabled="block"
                    id=""
                    v-model="calendarEvent.title"
                    placeholder="Titulo do Evento"
                    type="text"
                    class="form-control"
                  />
                </div>

                <div class="col-lg-3">
                  <select class="form-control" v-model="calendarEvent.className" >
                    <option value="">Selecione a categoria...</option>
                    <option v-for='(category, idx) in categories' :value="category.value" :key='idx'>
                      {{category.name}}
                    </option>
                  </select>
                </div>

                <div class="col-lg-1">
                 <b-button variant="outline-danger" :disabled="block" class="btn btn-rounded" @click="rmvCalendarEvent(idx)">
                    <i class="bx bxs-trash"></i>
                  </b-button>
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