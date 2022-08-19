<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="w-full h-full flex items-center justify-center relative">
      <l-map
        :zoom="zoom"
        :center="center"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
        style="min-height: 25.2rem;width: 100%"
        class="z-0 "
      >
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      </l-map>
      <div class="absolute marker flex items-center justify-center w-8 h-12">
        <img
          src="@/assets/images/marker-shadow.png"
          class="absolute -mr-3 mt-1"
        />
        <img src="@/assets/images/marker.png" class="absolute" />
      </div>
    </div>
    <div class="flex flex-col gap-3 w-full" v-if="markerLatLng">
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

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
export default {
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
      center: { lat: 0, lng: 0 },
      markerLatLng: { lat: 0, lng: 0 },
      currentCenter: { lat: 0, lng: 0 },
      parent: null,
    };
  },
  methods: {
    centerUpdate(center) {
      this.currentCenter = center;
      this.parent.location = center;
    },
    zoomUpdate(zoom) {
      this.zoom = zoom;
    }, 
  },
  created() {
    this.parent = this.$parent.$parent.$parent;
    if (this.parent.location) this.markerLatLng = this.parent.location;
  },
  watch: {
    markerLatLng: {
      handler(v) {
        this.center = { lat: parseFloat(v.lat), lng: parseFloat(v.lng) };
        
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>