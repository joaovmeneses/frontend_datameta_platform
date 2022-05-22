<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Informações da Pesquisa",
    meta: [
      {
        name: "Informações da Pesquisa",
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
      search: {
        description: '',
        methodology: '',
        searchType: '',
        registred: false,
        city: [],
        state: '0',
        startDate: '',
        endDate: '',
        questionsId: '',
        /*maps: [
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
        ],*/
      },
      urlBi: '',
      questions: [],
      title: "Informações da Pesquisa",
      items: [
        {
          text: "Informações da Pesquisa",
          href: "/",
        },
        {
          text: "Default",
          active: true,
        },
      ],
      
    };
  },
  async mounted()  {
    const vm = this
    await this.$http.get('search/' + this.$route.params.id, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then(response => {
      if (response.data.status == 200) {
        vm.search = response.data.body
      }  
    })
      
    this.$http.get('businessIntelligence/' + this.search.businessIntelligenceId + '/findComplete/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then(response => {
      vm.urlBi = response.data.body.url
    })
    this.$http.get(`search/${this.$route.params.id}/questions/${this.search.questionsId}`, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then((res) => {
      if(res.data.status === 200 && res.data.body) {
        vm.questions = res.data.body.questions
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
    })
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
            <table style="width: 100%;">
              <thead>
                <th class="text-center">Metodologia</th>
                <th class="text-center">Tipo</th>
                <th class="text-center">Registrada</th>
                <th class="text-center">Cidade(s)</th>
                <th class="text-center">Inicio</th>
                <th class="text-center">Fim</th>
              </thead>
              <tr>
                <td class="text-center">{{ search.methodology }}</td>
                <td class="text-center">{{ search.searchType }}</td>
                <td class="text-center">{{ search.registed ? "Sim" : "Não" }}</td>
                <td class="text-center">{{ search.city }} /{{search.state}}</td>
                <td class="text-center">{{ search.startDate }}</td>
                <td class="text-center">{{ search.endDate }}</td>
              </tr>
            </table>
            <hr>
            <h4 class="text-center">Descrição</h4>
            <p  class="text-center">{{ search.description }}</p>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <iframe width="100%" height="1000" :src="urlBi" frameborder="0" allowFullScreen="true"></iframe>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <b-card no-body class="mb-1 shadow-none" v-for="(question, idx) in questions" :key="question.id">
              <b-card-header header-tag="header" role="tab">
                <h6 class="m-0">
                  <a
                    v-b-toggle="'accordion-' + idx"
                    class="text-dark"
                    href="javascript: void(0);"
                  >{{question[0].value}}</a>
                </h6>
              </b-card-header>
              <b-collapse :id="'accordion-' + idx" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <div v-for="(element, idx) in question" :key="element.id">
                    <div v-if="idx > 0">
                      <b-card-text>{{element.index}} - <b>{{element.value}}</b></b-card-text>
                    </div>
                    <hr>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  
</template>
