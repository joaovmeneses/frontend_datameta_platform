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
      urlBi: 'https://app.powerbi.com/view?r=' + this.$route.params.sufixLink,
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
  // eslint-disable-next-line no-console
    console.log('this.$route.params.sufixLink')
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    
  </Layout>
  
</template>
