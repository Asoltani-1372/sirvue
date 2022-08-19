<template>
  <Card class="w-full flex-grow">
    <template #title>موقعیت مکانی</template>
    <template #content>
      <div class="flex flex-col gap-8">
        <div class="w-full h-full flex items-center justify-center relative">
          <l-map
            :zoom="zoom"
            :center="center"
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
            style="min-height: 25.2rem"
            class="z-0"
          >
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          </l-map>
          <div
            class="
              absolute
              marker
              flex
              items-center
              justify-center
              w-8
              h-12
              -mt-10
            "
          >
            <img
              src="@/assets/images/marker-shadow.png"
              class="absolute -mr-3 mt-1"
            />
            <img src="@/assets/images/marker.png" class="absolute" />
          </div>
        </div>
        <div class="flex gap-8" v-if="markerLatLng">
          <InputText
            dir="ltr"
            :useGrouping="false"
            v-model="markerLatLng.lat"
            placeholder="عرض جغرافیایی"
          />
          <InputText
            dir="ltr"
            :useGrouping="false"
            v-model="markerLatLng.lng"
            placeholder="طول جغرافیایی"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Button
          label="بازگشت"
          icon="pi pi-chevron-right"
          class="p-button-text p-button-sm"
          @click="$emit('prevPage', { pageIndex: 2 })"
        />
        <Button
          label="بعدی"
          icon="pi pi-chevron-left"
          class="p-button-sm p-button-success"
          iconPos="right"
          @click="nextPage()"
          :disabled="nextBtn"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

export default {
  props: ["formData"],
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://SirangPlus.ir">SirangPlus</a>',
      zoom: 10,
      center: this.formData.address[1].location,
      markerLatLng: {lat: null , lng: null},
      currentCenter: null,
      nextBtn: true,
    };
  },

  methods: {
    centerUpdate(center) {
      this.currentCenter = center;
      this.nextBtn = false;
    },
    zoomUpdate(zoom) {
      this.zoom = zoom;
    },
    confirmLocation() {
      this.confirmBtn = false;
    },
    changeLocation() {
      this.confirmBtn = true;
    },
    nextPage() {
      this.$emit("next-page", {
        formData: { location: this.currentCenter },
        pageIndex: 2,
      });
    },
  },
  watch: {
    markerLatLng: {
      handler(v) {
        this.center = { lat: parseFloat(v.lat), lng: parseFloat(v.lng) };
        
      },
      deep: true,
    },
    "formData.address"(v) {
      try {
        this.center = v[1].location;
      } catch (error) {
        //
      }
    },
  },
};
</script>

<style scoped>
.map {
  @apply h-96 !important;
}
</style>