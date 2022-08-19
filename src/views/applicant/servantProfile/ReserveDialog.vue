<template>
  <div>
    <Dialog
      header="رزرو نوبت"
      v-model:visible="displayDialog"
      :modal="true"
      class="max-w-xl w-full"
    >
      <div class="flex flex-col gap-2" v-if="!confirm">
        <div class="flex flex-col">
          <div
            class="flex gap-8 items-center border-b -mx-2 px-2 py-3"
            v-for="(item, index) in defaultItems"
            :key="index"
            :class="{ 'bg-gray-50': index % 2 != 0 }"
          >
            <p class="w-1/4">{{ item.title }}</p>
            <p class="flex-grow text-left font-bold">{{ item.value }}</p>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <p><i class="pi pi-map-marker"></i> موقعیت مکانی دقیق</p>
          <Button
            :label="location ? 'انتخاب شد' : 'انتخاب روی نقشه'"
            @click="selectLoaction()"
            class="p-button-text -ml-4"
            :class="[location ? ' p-button-success' : ' p-button-info']"
          />
        </div>
        <p class="text-xs text-red-600 -mt-4 mb-2">{{ errors.location }}</p>
        <Dropdown
          optionLabel="title"
          placeholder="نوع زمین"
          :multiple="true"
          :options="landTypes"
          v-model="landType"
          :class="{ 'p-invalid': errors.landType }"
        />
        <p class="text-xs text-red-600">{{ errors.landType }}</p>
        <InputText
          placeholder="مساحت زمین"
          v-model="landArea"
          :class="{ 'p-invalid': errors.landArea }"
        />
        <p class="text-xs text-red-600">{{ errors.landArea }}</p>
        <Textarea
          v-model="desc"
          :autoResize="true"
          placeholder="توضیحات"
          rows="5"
          cols="30"
        />
      </div>
      <div class="flex flex-col gap-3" v-else>
        <div
          class="flex gap-8 items-center"
          v-for="item in request"
          :key="item"
        >
          <p class="w-1/4 text-left">{{ item.title }}</p>
          <Button
            v-if="item.type == 'location'"
            label="نمایش روی نقشه"
            @click="selectLoaction()"
            class="p-button-text p-button-info p-button-sm -mr-4 -my-4"
          />
          <p class="flex-grow" v-else>
            {{ item.value }}
          </p>
        </div>
        <div class="flex justify-center items-center py-4">
          <p class="text-lg text-green-700 font-bold p-3 border-b">
            هزینه نهایی : {{ totalPrice.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.000','') }} تومان
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            @click="closeDialog()"
            class="p-button-text p-button-info"
          />
          <Button
            v-if="confirm"
            label="تایید و رزرو"
            icon="pi pi-check"
            iconPos="left"
            @click="setReserve()"
            class="p-button-success"
            :loading="loading"
          />
          <Button
            v-else
            label="ادامه"
            icon="pi pi-chevron-left"
            iconPos="right"
            @click="validation()"
            class="p-button-success"
          />
        </div>
      </template>
    </Dialog>
    <Map ref="myMap" @call="location = $event" />
  </div>
</template>

<script>
import Map from "../../../components/basic/Map.vue";
// import ReserveService from "../../../service/applicant/Reserve.js";
export default {
  components: { Map },
  props: ["input"],
  data() {
    return {
      displayDialog: false,
      defaultItems: [],
      confirm: false,
      location: null,
      landProps: null,
      landType: null,
      landArea: null,
      desc: "",
      landTypes: [
        { title: "باغ", code: "garden" },
        { title: "مزرعه", code: "farm" },
      ],
      reserve: [],
      reserveService: null,
      errors: {},
      totalPrice: 0,
      loading: false,
    };
  },
  created() {
    //this.reserveService = new ReserveService();
  },
  methods: {
    showDialog() {
      this.displayDialog = true;
    },
    requestContinue() {
      this.confirm = !this.confirm;
      this.generateDataConfirm();
    },
    validation() {
      if (!this.location) {
        this.errors.location =
          "موقغیت مکانی دقیق خود را از روی نقشه انتخاب نمایید";
      } else if (!this.landType) {
        this.errors.landType = "نوع زمین را انتخاب نمایید";
      } else if (!this.landArea) {
        this.errors.landArea = "مساحت زمین را وارد نمایید";
      } else {
        this.generateDataConfirm();
      }
    },
    generateDataConfirm() {
      this.totalPrice = this.input.service.price * this.landArea;
      this.request = [
        { title: "خدمت", value: this.input.service.title },
        { title: "منطقه", value: this.input.place },
        { title: "موقعیت مکانی دقیق", value: this.location, type: "location" },
        { title: "تاریخ", value: this.input.date },
        { title: "نوع زمین", value: this.landType.title },
        { title: "مساحت زمین", value: this.landArea },
      ];
      if (this.desc) {
        this.request.push({ title: "توضیحات", value: this.desc });
      }

      this.confirm = true;
    },
    selectLoaction() {
      this.$refs.myMap.displayDialog = true;
    },
    closeDialog() {
      this.displayDialog = this.confirm;
      this.confirm = false;
    },
    setReserve() {
      this.loading = true;
      const timing = this.input.id;
      const data = {
        timing,
        location: this.location,
        landType: this.landType.code,
        landArea: this.landArea,
      };
      this.reserveService.reserve(
        data,
        () => {
          this.loading = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "درخواست شما با موفقیت ثبت شد",
            life: 5000,
          });
          this.confirm = false;
          this.closeDialog();
          this.$router.push("/applicant/reserveds");
        },
        (error) => {
          this.loading = false;
          this.$toast.add({
            severity: "error",
            summary: "موفق",
            detail: error,
            life: 3000,
          });
        }
      );
    },
  },
  watch: {
    input(v) {
      if (v) {
        this.defaultItems = [
          { title: "نوع خدمت", value: v.service.title },
          { title: "موقعیت مکانی", value: v.place },
          { title: "تاریخ", value: v.date },
        ];
      }
    },

    location() {
      this.errors.location = null;
    },
    landType() {
      this.errors.landType = null;
    },
    landArea(v) {
      if (v && parseInt(v) != v) this.errors.landArea = "عدد وارد نمایید";
      else if (v) this.errors.landArea = null;
      else this.errors.landArea = "مساحت زمین نمیتواند خالی باشد";
    },
  },
};
</script>

<style>
.p-dialog-content::-webkit-scrollbar {
  @apply w-2;
}

.p-dialog-content::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-500;
}
</style>