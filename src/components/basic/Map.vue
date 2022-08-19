<template>
  <Dialog
    v-if="displayDialog"
    :header="header"
    v-model:visible="displayDialog"
    :modal="true"
    class="w-full h-screen lg:h-full lg:mx-12"
    :closable="false"
  >
    <template #header>
      <div class="w-full flex items-center justify-center">
        <p class="text-xl font-bold">موقعیت مکانی</p>
      </div>
    </template>
    <l-map
      :zoom="zoom"
      :center="center"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
      style="height: 40rem"
    >
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker
        v-model:lat-lng="markerLatLng" 
        :draggable="!this.input"
      ></l-marker>
    </l-map>
    <template #footer>
      <div class="w-full mt-4 flex items-center justify-between">
        <Button
          label="بازگشت"
          @click="displayDialog = false"
          class="p-button-text p-button-info"
        />
        <Button
          label="تایید"
          @click="setLocation()"
          class="p-button p-button-success"
          v-if="!input"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

export default {
  props: ["input"],
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      center: this.input || [35.69960056368351, 51.387863159179695],
      markerLatLng: this.input ||  [35.69960056368351, 51.387863159179695],
      displayDialog: false,
      currentCenter: null,
    };
  },

  methods: {
    setLocation() {
      this.$emit("call", this.markerLatLng);
      this.displayDialog = false;
    },
    centerUpdate(center) {
      if (!this.input) {
        this.currentCenter = center;
        this.markerLatLng = center;
      }
    },
    zoomUpdate(zoom) {
      this.zoom = zoom;
    },
  },
  watch: {
    markerLatLng(v) {
      this.center = v;
    },
    input: {
      handler(v) {
        console.log(v);
        this.markerLatLng = v;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.map {
  @apply h-96 !important;
}
</style>