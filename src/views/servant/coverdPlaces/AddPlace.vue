<template>
  <card class="add-place">
    <template #title>
      <div class="flex justify-between items-center">
        <p v-if="init">افزودن منطقه جدید</p>
        <Skeleton width="50%" v-else />
      </div>
    </template>
    <template #content>
      <GetLocation @call="place = $event" v-if="init" />
      <Skeleton width="100%" height="3.125rem" v-else />
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
          :disabled="addBtnDisable"
          @click="addPlace()"
          :loading="loading"
          v-if="init"
        />
        <Skeleton width="5.62rem" height="2.68rem" v-else />
      </div>
    </template>
  </card>
</template>

<script>
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  components: { GetLocation },
  props: ["loading", "init"],
  data() {
    return {
      place: [],
      addBtnDisable: true,
    };
  },
  methods: {
    addPlace() {
      const count = this.place.length - 1;
      const data = {
        type: this.place[count].type,
        id: this.place[count].id,
      };
      this.$emit("call", data);
    },
  },
  watch: {
    place(v) {
      const count = v.length;
      let limit = 4;
      if (v[count - 1].type == "hamlet") limit++;
      this.addBtnDisable = count <= limit;
    },
  },
};
</script>
<style scoped>
.add-place {
  @apply w-1/3;
}
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