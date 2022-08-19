<template>
  <Card>
    <template #title>موقعیت مکانی</template>
    <template #content>
      <l-map
        :zoom="zoom"
        :center="center"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
        style="min-height: 25.2rem"
      >
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker v-model:lat-lng="markerLatLng" :draggable="true"></l-marker>
      </l-map>
    </template>
    <template #footer>
      <Button
        v-if="confirmBtn"
        label="تایید موقعیت مکانی"
        class="p-button p-button-success p-button-sm"
        @click="confirmLocation()"
      />
      <div class="flex items-center gap-2 text-green-600" v-else>
        <i class="pi pi-check"></i>
        <p>موقعیت مکانی انتخاب شده است</p>
        <Button
          label="تغییر موقعیت مکانی"
          class="p-button-outlined p-button-warning p-button-sm mr-auto"
          @click="changeLocation()"
        />
      </div>
    </template>
  </Card>
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
        '&copy; <a target="_blank" href="http://SirangPlus.ir">SirangPlus</a>',
      zoom: 10,
      center: [35.69960056368351, 51.387863159179695],
      markerLatLng: [35.69960056368351, 51.387863159179695],
      currentCenter: null,
      confirmBtn: true
    };
  },

  methods: {
    
    centerUpdate(center) {
      this.currentCenter = center;
      this.markerLatLng = center;
      
    },
    zoomUpdate(zoom) {
      this.zoom = zoom;
    },

    confirmLocation(){
      this.confirmBtn = false;
      this.$emit('confirm', this.center);
    },
    changeLocation(){
      this.confirmBtn = true;
      this.$emit('confirm', null);
    }
  },
  watch: {
    markerLatLng(v) {
      this.center = v;
    },

    input(v){
        this.center = v;
    }
  },
};
</script>

<style scoped>
.map {
  @apply h-96 !important;
}
</style>