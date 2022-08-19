<template>
  <div class="select-places">
    <AddPlace
      @call="addPlace($event)"
      :loading="loading"
      class="hidden lg:block"
      :init="init"
    />
    <ListPlaces
      :input="places"
      @activate="activePlace($event)"
      @delete="deletePlaces($event)"
    />

    <AddPlaceDialog ref="placeDialog" />

    <Button
      icon="pi pi-plus"
      class="
        p-button-rounded p-button-success
        fixed
        bottom-20
        right-6
        lg:hidden
        z-50
      "
      @click="$refs.placeDialog.open()"
    />
  </div>
</template>

<script>
import AddPlace from "../../views/servant/coverdPlaces/AddPlace.vue";
import ListPlaces from "../../views/servant/coverdPlaces/ListPlaces.vue";
import CoveredPlaceService from "../../service/servant/CoverdPlaces.js";
import AddPlaceDialog from "../../views/servant/coverdPlaces/AddPlaceDialog.vue";
export default {
  components: { AddPlace, ListPlaces, AddPlaceDialog },
  data() {
    return {
      init: false,
      coveredPlaceService: null,
      places: null,
      loading: false,
    };
  },
  created() {
    this.coveredPlaceService = new CoveredPlaceService();
  },
  mounted() {
    this.coveredPlaceService.getPlaces(
      (data) => {
        this.places = data;
        this.init = true;
      },
      () => {}
    );
  },
  methods: {
    addPlace(place) {
      this.loading = true;
      this.coveredPlaceService.addPlace(
        place,
        (data) => {
          this.places = data;
          this.loading = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "باموفقیت اضافه شد",
            life: 3000,
          });
        },
        (error) => {
          this.loading = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    activePlace(id) {
      this.coveredPlaceService.activePlace(
        this.places[id].id,
        (data) => {
          this.places[id].active = data;
          const msg = data ? "" : "غیر";
          this.$toast.add({
            severity: data ? "success" : "warn",
            summary: "موفق",
            detail: "باموفقیت " + msg + "فعال شد",
            life: 3000,
          });
        },
        (error) => {
          this.places[id].active = !this.places[id].active;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    deletePlaces(places) {
      this.coveredPlaceService.deletePlaces(
        places,
        () => {
          this.places = this.places.filter(function (element) {
            return places.indexOf(element.id) == -1;
          });
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "باموفقیت حذف شد",
            life: 3000,
          });
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

<style scoped>
.select-places {
  @apply flex lg:gap-8 m-auto h-full items-start;
}
</style>