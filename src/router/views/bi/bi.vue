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
      urlBi: '',
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
      
    };
  },
  mounted() {
    const vm = this
    this.$http.get('businessIntelligence/' + this.$route.params.id + '/findComplete/', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')}}).then(response => {
      vm.urlBi = response.data.body.url
    });
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <iframe width="600" height="1000" :src="urlBi" frameborder="0" allowFullScreen="true"></iframe>
    </div>
  </Layout>
  
</template>
