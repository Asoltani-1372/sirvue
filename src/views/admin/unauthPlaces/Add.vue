<template>
  <card class="add-place">
    <template #header> </template>
    <template #title>
      <div class="flex justify-between items-center">
        <p>افزودن منطقه غیر مجاز</p>
      </div>
    </template>
    <template #content>
      <GetLocation @call="place = $event" ref="location" />
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <Button
          v-if="place.length > 0"
          label="پاکسازی"
          class="p-button-text p-button-success p-button-sm"
          @click="place = []"
        />
        <Button
          label="افزودن"
          icon="pi pi-plus"
          class="p-button-success p-button-plain p-button-sm"
          :disabled="Object.keys(place).length < 5"
          @click="$emit('call', place)"
          :loading="loading"
        />
      </div>
    </template>
  </card>
</template>

<script>
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  components: { GetLocation },
  props: ["loading"],
  data() {
    return {
      place: [],
    };
  },
  watch:{
    loading(v){
      if (!v) {
        this.place = [];
        this.$refs.location.reset();
      }
    }
  }
};
</script>
<style scoped>
</style>
<style>
.p-chips,
.p-chips-multiple-container {
  @apply w-full;
}
.p-chips-token {
  direction: ltr;
  @apply m-0 ml-2 text-sm !important;
}
.p-chips-remove-hidden > span:last-child {
  @apply hidden;
}
</style>