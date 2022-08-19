<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="w-11/12 mt-8 lg:mt-0 mx-auto lg:w-1/3">
      <Add @call="getServices()" />
    </div>
    <List
      class="flex-grow"
      :input="services"
      :skeleton="skeleton"
      @call="getServices()"
    />
  </div>
</template>

<script>
import ServicesService from "../../service/admin/services";
import List from "../../views/admin/services/List.vue";
import Add from "../../views/admin/services/Add.vue";
export default {
  components: { List, Add },
  data() {
    return {
      servicesService: null,
      services: [{}, {}, {}],
      skeleton: false,
    };
  },

  created() {
    this.servicesService = new ServicesService();
  },

  mounted() {
    this.getServices();
  },

  methods: {
    getServices() {
      this.servicesService.getServices(
        (data) => {
          this.services = data.services;
          this.skeleton = true;
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
  },
};
</script>

<style>
</style>