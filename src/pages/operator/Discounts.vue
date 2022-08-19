<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-8 w-full">
      <AreasList :areas="areas" class="w-1/2"/>
      <DistancesList :distances="distances" class="w-1/2" />
    </div>
    <PlacesList :places="places" class="w-full" />
  </div>
</template>

<script>
import DiscountsService from "../../service/operator/discounts.js";
import AreasList from "../../views/operator/discounts/AreasList.vue";
import DistancesList from "../../views/operator/discounts/DistancesList.vue";
import PlacesList from "../../views/operator/discounts/PlacesList.vue";
export default {
  components: { AreasList, DistancesList, PlacesList },
  data() {
    return {
      discountsService: null,
      areas: [{}, {}, {}],
      distances: [{}, {}, {}],
      places: [{}, {}, {}],
    };
  },

  methods: {
    getList() {
      this.discountsService.getList(
        (data) => {
          this.areas = data.discounts.filter((e) => e.type == "area");
          this.distances = data.discounts.filter((e) => e.type == "distance");
          this.places = data.discounts.filter((e) => e.type == "place");
        },
        () => {}
      );
    },
  },
  created() {
    this.discountsService = new DiscountsService();
  },
  mounted() {
    this.getList();
  },
};
</script>

<style>
</style>