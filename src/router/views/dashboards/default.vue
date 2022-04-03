<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Dashboard",
    meta: [
      {
        name: "description",
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
      modalInfo: {},
      title: "Dashboard",
      items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Default",
          active: true,
        },
      ],
      statData: [
        {
          icon: "bx bx-copy-alt",
          title: "Orders",
          value: "1,235",
        },
        {
          icon: "bx bx-archive-in",
          title: "Revenue",
          value: "$35, 723",
        },
        {
          icon: "bx bx-purchase-tag-alt",
          title: "Average Price",
          value: "$16.2",
        },
      ],
      transactions: [
        {
          id: "#SK2540",
          name: "Neal Matthews",
          date: "07 Oct, 2019",
          total: "$400",
          status: "Paid",
          payment: ["fa-cc-mastercard", "Mastercard"],
          index: 1,
        },
        {
          id: "#SK2541",
          name: "Jamal Burnett",
          date: "07 Oct, 2019",
          total: "$380",
          status: "Chargeback",
          payment: ["fa-cc-visa", "Visa"],
          index: 2,
        },
        {
          id: "#SK2542",
          name: "Juan Mitchell",
          date: "06 Oct, 2019",
          total: "$384",
          status: "Paid",
          payment: ["fab fa-cc-paypal", "Paypal"],
          index: 3,
        },
        {
          id: "#SK2543",
          name: "Barry Dick",
          date: "05 Oct, 2019",
          total: "$412",
          status: "Paid",
          payment: ["fa-cc-mastercard", "Mastercard"],
          index: 4,
        },
        {
          id: "#SK2544",
          name: "Ronald Taylor",
          date: "04 Oct, 2019",
          total: "$404",
          status: "Refund",
          payment: ["fa-cc-visa", "Visa"],
          index: 5,
        },
        {
          id: "#SK2545",
          name: "Jacob Hunter",
          date: "04 Oct, 2019",
          total: "$392",
          status: "Paid",
          payment: ["fab fa-cc-paypal", "Paypal"],
          index: 6,
        },
      ],
      searchs: [],
      isLoading: false,
      fullPage: true,
      canCancel: false,
      useSlot: false,
      loader: "spinner",
      color: "#007bff",
      bgColor: "#ffffff",
      height: 128,
      width: 128,
      timeout: 3000, //ms
      fetchingStats: true,
      earningStatus: true,
    };
  },
  methods: {
    showMore(search, questionsId) {
      const vm = this
      this.modalInfo = {...search, questions: []}
      this.$http.get(`search/${search.id}/questions/${questionsId}`, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then((res) => {
        if(res.data.status === 200 && res.data.body) {
          vm.modalInfo.questions = res.data.body.questions
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
    },
    pushBi(sufixLink) {
      this.$router.push(`/bi/${sufixLink}`)
    }
  },
  mounted() {
    if(!sessionStorage.getItem('userToken')) {
      this.$router.push({
        name: "login",
      });
    } else {
      if(localStorage.getItem("reload")) {
        localStorage.removeItem("reload")
        window.location.reload()
      }
      const vm = this
      if(sessionStorage.getItem('userRole') === 'Admin') {
        this.$http.get('admin/search/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then((res) => {
            if(res.data.status === 200 && res.data.body) {
              vm.searchs = res.data.body
            // eslint-disable-next-line no-console
              console.log(vm.searchs)
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err)
          })
      } else {
        this.$http.get('/search/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then((res) => {
            if(res.data.status === 200 && res.data.body) {
              vm.searchs = res.data.body
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err)
          })
      }
     }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div v-for="search in searchs" :key="search.id" class="col-xl-4 col-sm-6">
        <div class="card">
          <div class="card-body">
            <div class="d-flex">
              <div class="avatar-md me-4">
                <span
                  class="avatar-title rounded-circle bg-light text-danger font-size-16"
                >
                  <img src="http://cdn.onlinewebfonts.com/svg/img_569204.png" alt height="30" />
                </span>
              </div>

              <div class="flex-grow-1 overflow-hidden">
                <h5 class="text-truncate font-size-14">
                  <a v-if="search.UserRequester" href="javascript: void(0);" class="text-dark">{{ search.UserRequester.name }}</a>
                  <a v-else href="javascript: void(0);" class="text-dark">{{ search.description.substr(0, 50) }}...</a>
                </h5>
                <span class="text-muted mb-4">{{search.city}}/{{search.state}}</span><br>
                <div class="avatar-group">
                  <div class="avatar-group-item">
                    <a
                      href="javascript: void(0);"
                      class="d-inline-block"
                    >
                      
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 border-top">
            <ul class="list-inline mb-0">
              <li
                v-b-tooltip.hover.top
                class="list-inline-item me-3"
                title="Due Date"
              >
                <i class="bx bx-calendar me-1"></i>
                {{ search.startDate }} - {{ search.endDate }}
              </li>
              |
              <li
                v-b-tooltip.hover.top
                class="list-inline-item me-3"
                title="Comments"
              >
                <span>Status: </span>
                <span
                  class="badge bg-info"
                  >Não Iniciado</span
                >
              </li>
              |
              <li
                v-b-tooltip.hover.top
                class="list-inline-item me-3"
                title="Comments"
              >
                <button variant="primary" v-b-modal.modal-scrollable @click="showMore(search, search.questionsId)">Mais...</button>
                
              </li>
              <li
                v-if="search.urlBi"
                v-b-tooltip.hover.top
                class="list-inline-item me-3"
                title="Comments"
              >
                <button variant="primary" v-b-modal.modal-scrollable @click="pushBi(search.urlBi)">BI</button>
                
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- M O D A L -->
    <b-modal
      id="modal-scrollable"
      scrollable
      title="Informacoes da Pesquisa"
      title-class="font-18"
      size="lg"
    >
      <p>Descricao: {{modalInfo.description}}</p>
      <p>Localizacao: {{modalInfo.city}}/{{modalInfo.state}}</p>
      <p>Periodo: {{modalInfo.startDate}} - {{modalInfo.endDate}}</p>
      <p>Metodologia: {{modalInfo.methodology}}</p>
      <p>Tipo de Pesquisa: {{modalInfo.searchType}} </p>
      <p>Mapas: </p>
      <div v-for="map in modalInfo.Map" :key="map.id">
        <p>{{map.title}}: <a :href="'http://' + map.link">Visitar</a></p>
      </div>
      <hr>
      <h4>Questoes: </h4>
      <br><br>
      <b-card no-body class="mb-1 shadow-none" v-for="(question, idx) in modalInfo.questions" :key="question.id">
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
    </b-modal>
  </Layout>
  
</template>
