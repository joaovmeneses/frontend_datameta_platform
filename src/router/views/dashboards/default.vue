<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Admin Dashboard",
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
      title: "Admin Dashboard",
      items: [
        {
          text: "Admin Dashboard",
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
      showModal: false,
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
    showMore(object) {
      // eslint-disable-next-line no-console
      console.log(object)
    }
  },
  mounted() {
    if(!sessionStorage.getItem('userToken')) {
      this.$router.push({
        name: "login",
      });
    } else {
      const vm = this
      this.$http.get('admin/search/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then((res) => {
        if(res.data.status === 200 && res.data.body) {
          vm.searchs = res.data.body
      // eslint-disable-next-line no-console
          console.log(this.searchs)
      // eslint-disable-next-line no-console
          console.log(res.data.body)
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
    }
    setTimeout(() => {
      this.showModal = true;
    }, 1500);
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div v-for="grid in searchs" :key="grid.id" class="col-xl-4 col-sm-6">
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
                  <a href="javascript: void(0);" class="text-dark">{{ grid.requester.name }}</a>
                </h5>
                <span class="text-muted mb-4">{{grid.city}}/{{grid.state}}</span><br>
                <span class="text-muted mb-4" v-if="grid.requester.politicalParty"> Partido: {{grid.requester.politicalParty}}</span><br>
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
                {{ grid.startDate }} - {{ grid.endDate }}
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
                <span @click="showMore(grid)">Mais...</span>
                
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
