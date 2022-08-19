<template>
  <div>
    <Dialog
      header="درخواست خدمت"
      v-model:visible="displayDialog"
      :modal="true"
      class="max-w-xl w-full"
    >
      <div class="flex flex-col gap-2" v-if="!confirm">
        <MultiSelect
          v-model="selectedServices"
          :options="services"
          optionLabel="title"
          placeholder="نوع خدمت"
          :class="{ 'p-invalid': errors.services }"
        />
        <p class="text-xs text-red-600">{{ errors.services }}</p>
        <GetLocation
          @call="place = $event"
          :place="placeDefault"
          :invalid="errors.place"
        />
        <p class="text-xs text-red-600">{{ errors.place }}</p>
        <div class="flex justify-between items-center">
          <p><i class="pi pi-map-marker"></i> موقعیت مکانی دقیق</p>
          <Button
            :label="location ? 'انتخاب شد' : 'انتخاب روی نقشه'"
            @click="selectLoaction()"
            class="p-button-text"
            :class="[location ? ' p-button-success' : ' p-button-text']"
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
        <Calendar
          v-model="date"
          class="flex-grow text-left"
          placeholder="تاریخ"
          :maxDate="maxDate"
          
          :class="{ 'p-invalid': errors.date }"
        />
        <p class="text-xs text-red-600">{{ errors.date }}</p>
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
            هزینه نهایی : {{ totalPrice }} تومان
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
            label="تایید و درخواست"
            icon="pi pi-check"
            iconPos="left"
            @click="sendRequest()"
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
import GetLocation from "../../../components/basic/GetLocation.vue";
import Map from "../../../components/basic/Map.vue";
//import RequestService from "../../../service/applicant/Request.js";
export default {
  components: { GetLocation, Map },
  props: ["header", "services", "filter", "placeDefault"],
  data() {
    return {
      displayDialog: false,
      selectedServices: [],
      confirm: false,
      place: [],
      location: null,
      date: null,
      landProps: null,
      landType: null,
      landArea: null,
      desc: "",
      landTypes: [
        { title: "باغ", code: "garden" },
        { title: "مزرعه", code: "farm" },
      ],
      request: [],
      maxDate: new Date(1400, 9, 20, 0, 0, 0, 0),
      reserveService: null,
      errors: {
        services: null,
        place: null,
        location: null,
        landType: null,
      },
      totalPrice: 0,
      loading: false,
    };
  },
  created() {
    //this.requestService = new RequestService();
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
      if (this.selectedServices.length < 1) {
        this.errors.services = "حداقل یک خدمت انتخاب نمایید";
      } else if (
        this.place.filter((e) => e.type == "city" || e.type == "village")
          .length == 0
      ) {
        this.errors.place = "روستا یا شهر خود را به درستی انتخاب نمایید";
      } else if (!this.location) {
        this.errors.location =
          "موقغیت مکانی دقیق خود را از روی نقشه انتخاب نمایید";
      } else if (!this.landType) {
        this.errors.landType = "نوع زمین را انتخاب نمایید";
      } else if (!this.landArea) {
        this.errors.landArea = "مساحت زمین را وارد نمایید";
      } else if (!this.date) {
        this.errors.date = "تاریخ را انتخاب نمایید";
      } else {
        this.generateDataConfirm();
      }
    },
    generateDataConfirm() {
      let service = [];
      this.totalPrice = 0;
      for (let i = 0; i < this.selectedServices.length; i++) {
        const element = this.selectedServices[i];
        this.totalPrice += element.price * this.landArea;
        service.push(element.title);
      }
      service = service.join(" ، ");

      let place = [];
      for (let i = 0; i < this.place.length; i++) {
        const element = this.place[i];
        place.push(element.title);
      }
      place = place.join(" ، ");

      let date =
        this.date.getFullYear() +
        "/" +
        this.date.getMonth() +
        "/" +
        this.date.getDate();

      this.request = [
        { title: "خدمت (ها)", value: service },
        { title: "منطقه", value: place },
        { title: "موقعیت مکانی دقیق", value: this.location, type: "location" },
        { title: "تاریخ", value: date },
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
    sendRequest() {
      this.loading = true;
      const services = [];
      this.services.forEach((e) => {
        services.push(e.id);
      });
      const count = this.place.length - 1;
      const place = { type: this.place[count].type, id: this.place[count].id };
      const date =
        this.date.getFullYear() +
        "/" +
        this.date.getMonth() +
        "/" +
        this.date.getDate();
      const data = {
        services,
        place,
        location: this.location,
        landType: this.landType.code,
        landArea: this.landArea,
        date,
        price: this.totalPrice,
      };
      this.requestService.request(
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
          this.$router.push('/applicant/reserveds')
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
    filter(v) {
      if (v.services.length > 0) {
        this.selectedServices = this.services.filter(
          (service) => v.services.indexOf(service.id) > -1
        );
      }
    },
    selectedServices(v) {
      if (v.length > 0) this.errors.services = null;
      else this.errors.services = "نوع خدمت نمیتواند خالی باشد";
    },
    place(v) {
      if (v.length > 0) this.errors.place = null;
      else this.errors.place = "موقعیت مکانی نمیتواند خالی باشد";
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
    date(v) {
      if (v) this.errors.landType = null;
      else this.errors.landType = "تاریخ نمیتواند خالی باشد";
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