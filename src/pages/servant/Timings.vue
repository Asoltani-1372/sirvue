<template>
  <div class="timing">
    <AddTiming
      :input="addTimingData"
      @call="addTiming($event)"
      :loading="loading"
      class="hidden lg:block"
    />
    <ListTimings
      :input="timings"
      @delete="deleteTimings($event)"
    />

    <AddTimingDialog
      ref="addTimingDialog"
      :input="addTimingData"
      :loading="loading"
    />
    <Button
      icon="pi pi-plus"
      class="
        p-button-rounded p-button-success
        fixed
        bottom-20
        right-4
        lg:hidden
        z-50
      "
      @click="$refs.addTimingDialog.open()"
    />
  </div>
</template>

<script>
import AddTiming from "../../views/servant/timings/AddTiming.vue";
import ListTimings from "../../views/servant/timings/ListTimings.vue";
import AddTimingDialog from "../../views/servant/timings/AddTimingDialog.vue";
import TimingsService from "../../service/servant/Timings.js";

export default {
  components: { AddTiming, ListTimings, AddTimingDialog },
  data() {
    return {
      addTimingData: {
        services: null,
        places: null,
      },
      timings: null,
      loading: false,
    };
  },
  created() {
    this.timigsService = new TimingsService();
  },
  mounted() {
    this.timigsService.getTimings(
      (data) => {
        this.timings = data.timings;
        this.addTimingData.services = data.services;
        this.addTimingData.places = data.places;
      },
      () => {}
    );
  },
  methods: {
    addTiming(timing) {
      this.loading = true;
      this.timigsService.addTiming(
        timing,
        (data) => {
          this.timings = data.timings;
          this.addTimingData.services = data.services;
          this.addTimingData.places = data.places;
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
    deleteTimings(timings) {
      this.timigsService.deleteTimings(
        timings,
        () => {
          this.timings = this.timings.filter(function (element) {
            return timings.indexOf(element.id) == -1;
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
.timing {
  @apply flex lg:gap-8 m-auto lg:h-full w-full items-start;
}
</style>