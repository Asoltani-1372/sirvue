<template>
  <div class="servant flex flex-col lg:flex-row">
    <div class="w-11/12 m-auto mt-8 lg:mt-0 lg:w-2/5 flex flex-col gap-8">
      <ServicesPrice
        :input="services"
        @call="this.$refs.reserveDialog.showDialog()"
      />
      <Filters
        :input="services"
        @call="filterServant($event)"
        :loading="loading"
        :place-default="placeDefault"
      />
    </div>
    <List :input="servants" :noItem="noItem" />

    <RequestDialog
      ref="reserveDialog"
      :services="services"
      :filter="filter"
      :place-default="placeDefault"
    />
  </div>
</template>

<script>
import List from "../../views/applicant/servants/List.vue";
import Filters from "../../views/applicant/servants/Filters.vue";
import ServicesPrice from "../../views/applicant/servants/ServicesPrice.vue";
import RequestDialog from "../../views/applicant/servants/RequestDialog.vue";
import ServantsService from "../../service/applicant/Servants.js";
export default {
  components: { List, Filters, ServicesPrice, RequestDialog },
  data() {
    return {
      servantService: null,
      servants: null,
      placeDefault: [],
      filter: {},
      paginate: [],
      services: null,
      loading: false,
      noItem: false,
    };
  },
  created() {
    this.servantService = new ServantsService();
  },

  mounted() {
    this.getServants();
  },

  methods: {
    getServants() {
      this.servantService.getServants(
        this.filter,
        (data) => {
          this.servants = data.servants;
          if (data.place) {
            let place = [];
            Object.entries(data.place).forEach((x) => {
              place.push({
                type: x[0],
                id: x[1].id,
                title: x[1].title,
              });
            });
            this.placeDefault = place;
          }
          if (this.loading) {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "بروزرسانی شد",
              life: 3000,
            });
          }
          this.loading = false;
          this.services = data.services;
          this.noItem = this.servants.length == 0;
        },
        () => {
          this.loading = false;
        }
      );
    },
    filterServant(filter) {
      this.loading = true;
      this.filter = filter;
      this.getServants();
    },
  },
};
</script>

<style scoped>
.servant {
  @apply flex gap-8 items-start;
}
</style>