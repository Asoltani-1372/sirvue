<template>
  <Card class="add-place">
    <template #title>
      <div class="flex justify-between items-center">
        <p v-if="input.services">افزودن زمانبندی جدید</p>
        <Skeleton width="50%" v-else />
      </div>
    </template>
    <template #content>
      <div class="flex gap-3 flex-col">
        <MultiSelect
          v-model="selectedServices"
          :options="input.services"
          optionLabel="title"
          placeholder="نام خدمت"
          v-if="input.services"
        />
        <Skeleton width="100%" height="3rem" v-else />

        <MultiSelect
          v-model="selectedPlaces"
          :options="input.places"
          optionLabel="title"
          placeholder="مناطق تحت پوشش"
          :filter="true"
          class="multiselect-custom"
          v-if="input.places"
        >
          <template #value="slotProps">
            <div
              class="country-item country-item-value"
              v-for="option of slotProps.value"
              :key="option.code"
            >
              <div>{{ option.title }}</div>
            </div>
            <template v-if="!slotProps.value || slotProps.value.length === 0">
              مناطق تحت پوشش
            </template>
          </template>
          <template #option="slotProps">
            <div class="country-item">
              <div>{{ slotProps.option.title }}</div>
            </div>
          </template>
        </MultiSelect>
        <Skeleton width="100%" height="3rem" v-else />

        <Calendar
          v-model="dates"
          :maxDate="maxDate"
          :minDate="minDate"
          class="flex-grow text-left"
          placeholder="تاریخ‌ها"
          selectionMode="multiple"
          v-if="input.places"
        />
        <Skeleton width="100%" height="3rem" v-else />
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <Button
          label="پاکسازی"
          class="p-button-text p-button-success p-button-sm"
          @click="clear()"
          v-if="selectedPlaces || selectedServices || dates"
        />
        <Button
          label="افزودن"
          icon="pi pi-plus"
          class="p-button-success p-button-plain p-button-sm"
          @click="addTiming()"
          :disabled="!(selectedPlaces && selectedServices && dates)"
          :loading="loading"
          v-if="input.places"
        />
        <Skeleton width="5.6rem" height="2.68rem" v-else />
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  props: ["input", "loading"],
  data() {
    return {
      selectedPlaces: null,
      selectedServices: null,
      dates: null,
      minDate: new Date(1400, 10, 9, 0, 0, 0, 0),
      maxDate: new Date(1400, 11, 20, 0, 0, 0, 0),
    };
  },
  methods: {
    addTiming() {
      const dates = [];
      this.dates.forEach((e) => {
        dates.push(e.getFullYear() + "/" + e.getMonth() + "/" + e.getDate());
      });
      this.$emit("call", {
        places: this.ordering(this.selectedPlaces),
        services: this.ordering(this.selectedServices),
        dates,
      });
    },

    clear() {
      this.selectedPlaces = null;
      this.selectedServices = null;
      this.dates = null;
    },

    ordering(item) {
      let temp = [];
      for (let i = 0; i < item.length; i++) {
        const element = item[i];
        temp.push(element.id);
      }
      return temp;
    },
  },
  watch: {
    loading(v) {
      if (!v) {
        this.clear();
      }
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