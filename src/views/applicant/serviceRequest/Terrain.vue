<template>
  <Card>
    <template #title> مشخصات زمین </template>
    <template #content>
      <div
        class="flex flex-col"
        :class="[option == 'poisons' ? 'gap-12 my-8' : 'gap-8']"
      >
        <div class="flex flex-col gap-2 w-full">
          <p class="font-bold">نشانی زمین</p>
          <GetLocation @call="address = $event" :place="address" />
        </div>
        <div
          class="flex w-full"
          :class="[
            option == 'poisons'
              ? 'lg:flex-row flex-col gap-4'
              : 'flex-col gap-8',
          ]"
        >
          <div
            class="flex flex-col gap-2"
            :class="[option == 'poisons' ? 'lg:w-1/3' : 'w-full']"
            v-for="(item, index) in items.first"
            :key="index"
          >
            <p class="font-bold">{{ item.title }}</p>
            <div
              class="col-12 md:col-4"
              v-if="index == 'area'"
              style="direction: ltr"
            >
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon border-r-0 border-l">
                  هکتار
                </span>
                <InputText
                  type="number"
                  v-model="item.value"
                  :placeholder="item.placeholder"
                  :disabled="item.disabled"
                  style="direction: rtl"
                />
              </div>
            </div>

            <Dropdown
              v-else
              v-model="item.value"
              :options="item.options"
              optionLabel="title"
              :placeholder="item.placeholder"
              :loading="item.fetching"
              :disabled="item.disabled"
            />
          </div>
        </div>
        <div class="flex lg:flex-row flex-col gap-4" v-if="option == 'poisons'">
          <div
            class="flex flex-col gap-4 lg:w-1/2"
            v-for="item in items.second"
            :key="item"
          >
            <p class="font-bold text-lg">{{ item.title }}</p>
            <Dropdown
              v-model="item.value"
              :options="item.options"
              optionLabel="title"
              :placeholder="item.placeholder"
              :loading="item.fetching"
              :disabled="item.disabled"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Button
          label="بازگشت"
          icon="pi pi-chevron-right"
          class="p-button-text p-button-sm"
          @click="$emit('prevPage', { pageIndex: 1 })"
        />
        <Button
          label="بعدی"
          icon="pi pi-chevron-left"
          class="p-button-sm p-button-success"
          iconPos="right"
          @click="nextPage()"
          :disabled="nextButton"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import ServiceRequestService from "../../../service/applicant/serviceRequestService.js";
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  components: { GetLocation },
  props: ["formData"],
  data() {
    return {
      items: {
        first: {
          terrain: {
            title: "نوع زمین",
            placeholder: "نوع زمین را انتخاب نمایید",
            options: [],
            fetching: true,
            disabled: false,
            value: null,
          },
          area: {
            title: "مساحت زمین",
            placeholder: "مساحت زمین را وارد نمایید",
            disabled: true,
            value: null,
          },
          product: {
            title: "نوع محصول",
            placeholder: "نوع محصول را انتخاب نمایید",
            options: [],
            fetching: false,
            disabled: true,
            value: null,
          },
        },
        second: {
          poisonType: {
            title: "نوع سم",
            placeholder: "نوع سم را انتخاب نمایید",
            options: [],
            fetching: false,
            disabled: true,
            value: null,
          },
          poison: {
            title: "نام سم",
            placeholder: "نام سم را انتخاب نمایید",
            options: [],
            fetching: false,
            disabled: true,
            value: null,
          },
        },
      },
      serviceRequestService: null,
      nextButton: true,
      address: null,
      option: null,
    };
  },
  methods: {
    getTerrains() {
      this.serviceRequestService.getTerrains(
        (data) => {
          this.items.first.terrain.options = data.terrains;
          if ("country" in data.address) {
            this.address = [];
            Object.entries(data.address).forEach((x) => {
              this.address.push({
                type: x[0],
                id: x[1].id,
                title: x[1].title,
              });
            });
            this.address[1].location =
              data.location || data.address.province.location;
          }

          this.items.first.terrain.fetching = false;
        },
        () => {}
      );
    },
    getProducts(terrain) {
      this.serviceRequestService.getProducts(
        terrain,
        (data) => {
          this.items.first.product.options = data.products;
          this.items.first.product.fetching = false;
          this.items.first.product.disabled = false;
        },
        () => {}
      );
    },
    getPoisonTypes() {
      this.serviceRequestService.getPoisonTypes(
        (data) => {
          this.items.second.poisonType.options = data.types;
          this.items.second.poisonType.fetching = false;
        },
        () => {}
      );
    },
    getPoisons(product, poisonType) {
      this.serviceRequestService.getPoisons(
        { product, poisonType },
        (data) => {
          this.items.second.poison.options = data.poisons;
          this.items.second.poison.fetching = false;
          this.items.second.poison.disabled = false;
        },
        () => {}
      );
    },
    enableNextButton() {
      const count = this.address.length - 1;
      this.nextButton = true;
      if (
        this.items.first.product.value &&
        this.items.first.area.value &&
        count > 1
      ) {
        if (this.option == "poisons") {
          if (this.items.second.poison.value) this.nextButton = false;
        } else this.nextButton = false;
      }
    },
    nextPage() {
      let formData = {
        terrain: this.items.first.terrain.value,
        area: this.items.first.area.value,
        product: this.items.first.product.value,
        address: this.address,
      };
      if (this.option == "poisons") {
        formData.poisonType = this.items.second.poisonType.value;
        formData.poison = this.items.second.poison.value;
      }
      this.$emit("next-page", {
        formData,
        pageIndex: 1,
      });
    },
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  mounted() {
    if (this.formData.service) {
      this.getTerrains();
      this.option = this.formData.service.option;
      if (this.option == "poisons") {
        this.items.second.poisonType.fetching = true;
        this.getPoisonTypes();
      }
    }
  },
  watch: {
    "items.first.terrain.value"(v) {
      if (v) {
        this.items.first.product.fetching = true;
        this.items.first.area.disabled = false;
        this.getProducts(v.id);
      }
    },
    "items.first.area.value"() {
      this.enableNextButton();
    },
    "items.first.product.value"(v) {
      if (v) {
        if (this.option == "poisons") {
          this.items.second.poisonType.disabled = false;
          if (this.items.second.poisonType.value) {
            this.items.second.poison.fetching = true;
            this.getPoisons(v.id, this.items.second.poisonType.value.id);
          }
        }
      }
      this.enableNextButton();
    },
    "items.second.poisonType.value"(v) {
      if (v) {
        if (this.items.first.product.value) {
          this.items.second.poison.fetching = true;
          this.getPoisons(this.items.first.product.value.id, v.id);
        }
      }
    },
    "items.second.poison.value"() {
      this.enableNextButton();
    },
    "formData.service.id"() {
      this.items.first.terrain.value = null;
      this.items.first.product.value = null;
      this.items.first.product.disabled = true;
      this.items.first.area.value = null;
      this.items.first.area.disabled = true;
      this.items.second.poisonType.value = null;
      this.items.second.poisonType.disabled = true;
      this.items.second.poison.value = null;
      this.items.second.poison.disabled = true;
      this.nextButton = true;
    },
    "formData.service.option"(v) {
      this.option = v;
      if (v == "poisons" && this.items.second.poisonType.options.length < 1) {
        this.items.second.poisonType.fetching = true;
        this.getPoisonTypes();
      }
    },
    address() {
      this.enableNextButton();
    },
  },
};
</script>

<style>
</style>