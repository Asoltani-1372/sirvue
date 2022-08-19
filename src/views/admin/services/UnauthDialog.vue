<template>
  <div>
    <Dialog
      header="Header"
      v-model:visible="deleteProductDialog"
      class="max-w-2xl w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">مناطق غیر مجاز</div>
      </template>
      <div>
        <AutoComplete
          :multiple="true"
          v-model="selectedCountries"
          :suggestions="filteredCountries"
          @complete="searchCountry($event)"
          field="name"
          class="w-full"
          inputClass="w-full"
          placeholder="مناطق غیر مجاز"
        />
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-sm"
            @click="open"
          />
          <Button
            label="ذخیره"
            class="p-button-success p-button-sm"
            @click="$refs.cancelDialog.open()"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { FilterService, FilterMatchMode } from "primevue/api";
export default {
  data() {
    return {
      deleteProductDialog: false,
      countries: null,
      selectedCountry1: null,
      selectedCountry2: null,
      selectedCity: null,
      filteredCities: null,
      filteredCountries: null,
      selectedCountries: [],
      selectedItem: null,
      filteredItems: null,
      groupedCities: [
        {
          label: "Germany",
          code: "DE",
          items: [
            { label: "Berlin", value: "Berlin" },
            { label: "Frankfurt", value: "Frankfurt" },
            { label: "Hamburg", value: "Hamburg" },
            { label: "Munich", value: "Munich" },
          ],
        },
        {
          label: "USA",
          code: "US",
          items: [
            { label: "Chicago", value: "Chicago" },
            { label: "Los Angeles", value: "Los Angeles" },
            { label: "New York", value: "New York" },
            { label: "San Francisco", value: "San Francisco" },
          ],
        },
        {
          label: "Japan",
          code: "JP",
          items: [
            { label: "Kyoto", value: "Kyoto" },
            { label: "Osaka", value: "Osaka" },
            { label: "Tokyo", value: "Tokyo" },
            { label: "Yokohama", value: "Yokohama" },
          ],
        },
      ],
      items: Array.from({ length: 1000 }, (_, i) => ({
        label: `Item #${i}`,
        value: i,
      })),
    };
  },
  methods: {
    open() {
      this.deleteProductDialog = !this.deleteProductDialog;
    },

    searchCountry(event) {
      setTimeout(() => {
        if (!event.query.trim().length) {
          this.filteredCountries = [...this.countries];
        } else {
          this.filteredCountries = this.countries.filter((country) => {
            return country.name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }
      }, 250);
    },
    searchCity(event) {
      let query = event.query;
      let filteredCities = [];

      for (let country of this.groupedCities) {
        let filteredItems = FilterService.filter(
          country.items,
          ["label"],
          query,
          FilterMatchMode.CONTAINS
        );
        if (filteredItems && filteredItems.length) {
          filteredCities.push({ ...country, ...{ items: filteredItems } });
        }
      }

      this.filteredCities = filteredCities;
    },
    searchItems(event) {
      //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
      let query = event.query;
      let filteredItems = [];

      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filteredItems.push(item);
        }
      }

      this.filteredItems = filteredItems;
    },
  },
};
</script>

<style>
</style>