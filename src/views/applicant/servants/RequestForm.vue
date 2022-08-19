<template>
  <Card>
    <template #title>درخواست خدمت</template>
    <template #content>
      <div class="flex flex-col gap-2">
        <MultiSelect
          v-model="selectedServices"
          :options="services"
          optionLabel="title"
          placeholder="نوع خدمت"
          :class="{ 'p-invalid': errors.services }"
        >
          <template #option="slotProps">
            <div class="flex justify-between items-center w-full">
              <span>{{ slotProps.option.title }}</span>
              <span>
                از{{
                  slotProps.option.price
                    .toFixed(3)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    .replace(".000", "")
                }}
                تومان</span
              >
            </div>
          </template>
        </MultiSelect>
        <p class="text-xs text-red-600">{{ errors.services }}</p>
        <GetLocation
          @call="place = $event"
          :place="placeDefault"
          :invalid="errors.place"
        />
        <p class="text-xs text-red-600">{{ errors.place }}</p>
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
          :minDate="minDate"
          :class="{ 'p-invalid': errors.date }"
          dateFormat="yy/mm/dd"
          :manualInput="false"
        />
        <p class="text-xs text-red-600">{{ errors.date }}</p>
        <Textarea
          v-model="desc"
          :autoResize="true"
          placeholder="توضیحات"
          rows="2"
          cols="30"
        />
      </div>
    </template>
    <template #footer>
      <Button
        label="ثبت درخواست خدمت"
        class="p-button p-button-success w-full p-button-sm"
        @click="setReserve()"
        :loading="loading"
      />
    </template>
  </Card>
</template>

<script>
import GetLocation from "../../../components/basic/GetLocation.vue";
import RequestService from "../../../service/applicant/Request.js";
export default {
  props: ["input", "confirmLocation"],
  components: { GetLocation },
  data() {
    return {
      selectedServices: [],
      confirm: false,
      place: [],
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
      minDate: new Date(1400, 10, 9, 0, 0, 0, 0),
      maxDate: new Date(1400, 11, 20, 0, 0, 0, 0),
      requestService: null,
      errors: {
        services: null,
        place: null,
        location: null,
        landType: null,
      },
      totalPrice: 0,
      loading: false,
      placeDefault: [],
      services: null,
      location: null,
    };
  },
  created() {
    this.requestService = new RequestService();
  },
  methods: {
    setReserve() {
      if (this.selectedServices.length < 1) {
        this.errors.services = "حداقل یک خدمت انتخاب نمایید";
      } else if (
        this.place.filter((e) => e.type == "city" || e.type == "village")
          .length == 0
      ) {
        this.errors.place = "روستا یا شهر خود را به درستی انتخاب نمایید";
      } else if (!this.landType) {
        this.errors.landType = "نوع زمین را انتخاب نمایید";
      } else if (!this.landArea) {
        this.errors.landArea = "مساحت زمین را وارد نمایید";
      } else if (!this.date) {
        this.errors.date = "تاریخ را انتخاب نمایید";
      } else if (!this.location) {
        this.$toast.add({
          severity: "warn",
          summary: "هشدار",
          detail: "موقغیت مکانی دقیق خود را از روی نقشه انتخاب و تایید نمایید",
          life: 5000,
        });
      } else {
        this.loading = true;
        const services = [];
        this.selectedServices.forEach((e) => {
          services.push(e.id);
        });
        const count = this.place.length - 1;
        const place = {
          type: this.place[count].type,
          id: this.place[count].id,
        };
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
            this.$router.push("/applicant/reserveds");
          },
          (error) => {
            this.loading = false;
            this.$toast.add({
              severity: "error",
              summary: "هطا",
              detail: error,
              life: 3000,
            });
          }
        );
      }
    },
  },
  watch: {
    input: {
      handler(v) {
        if (v) {
          this.services = v.services;
          let place = [];
          Object.entries(v.place).forEach((x) => {
            place.push({
              type: x[0],
              id: x[1].id,
              title: x[1].title,
            });
          });
          this.placeDefault = place;
          
        }
      },
      deep: true,
    },
    confirmLocation(v){
      this.location = v;
    },
    selectedServices(v) {
      if (v.length > 0) this.errors.services = null;
      else this.errors.services = "نوع خدمت نمیتواند خالی باشد";
    },
    place(v) {
      if (v.length > 0) this.errors.place = null;
      else this.errors.place = "موقعیت مکانی نمیتواند خالی باشد";
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
      if (v) this.errors.date = null;
      else this.errors.date = "تاریخ نمیتواند خالی باشد";
    },
  },
};
</script>

<style>
</style>