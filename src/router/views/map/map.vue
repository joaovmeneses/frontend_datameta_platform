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
      urlMap: '',
      title: "Mapa",
      items: [
        {
          text: "Mapa",
          href: "/",
        },
        {
          text: "Default",
          active: true,
        },
      ],
      
    };
  },
  mounted() {
    const vm = this
    this.$http.get('search/map/' + this.$route.params.id, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}})
    .then((data) => {
      vm.urlMap = data.data.link
    })

  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <iframe width="600" height="1000" :src="urlMap" frameborder="0" allowFullScreen="true"></iframe>
    </div>
  </Layout>
  
</template>
