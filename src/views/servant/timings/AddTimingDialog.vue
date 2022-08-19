<template>
  <div >
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-2xl w-11/12"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">افزودن زمانبندی</div>
      </template>
      <div class="flex gap-3 flex-col">
        <MultiSelect
          v-model="selectedServices"
          :options="input.services"
          optionLabel="title"
          placeholder="نام خدمت"
        />

        <MultiSelect
          v-model="selectedPlaces"
          :options="input.places"
          optionLabel="title"
          placeholder="مناطق تحت پوشش"
          :filter="true"
          class="multiselect-custom"
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

        <Calendar
          v-model="dates"
          :maxDate="maxDate"
          class="flex-grow text-left"
          placeholder="تاریخ‌ها"
          selectionMode="multiple"
        />
      </div>
      <template #footer>
        <div class="flex justify-between w-full">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="deleteProductDialog = false"
          />
          <div class="flex" v-if="confirmBtn">
            <Button
              label="افزودن"
              class="p-button-success p-button-sm"
              @click="$refs.confirmDialog.open()"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  props: ["input", "loading"],
  data() {
    return {
      deleteProductDialog: false,
      selectedPlaces: null,
      selectedServices: null,
      dates: null,
      maxDate: new Date(1400, 9, 20, 0, 0, 0, 0),
    };
  },
  methods: {
    addTiming() {
      this.$emit("call", {
        places: this.ordering(this.selectedPlaces),
        services: this.ordering(this.selectedServices),
        dates: this.dates,
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
    open() {
      this.deleteProductDialog = !this.deleteProductDialog;
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

<style>
</style>