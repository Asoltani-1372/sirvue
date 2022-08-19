<template>
  <Dialog
    header="درخواست خدمت"
    :visible="display"
    :modal="true"
    :closable="false"
    class="w-11/12"
  >
    <p class="pb-4 text-sm">{{ subTitles[current] }}</p>
    <div class="flex justify-center items-center">
      <Service v-if="steps[current] == 'service'" />
      <Date v-if="steps[current] == 'date'" />
      <Terrain v-if="steps[current] == 'terrain'" />
      <Poison v-if="steps[current] == 'poison'" />
      <Location v-if="steps[current] == 'location'" />
      <Confirm v-if="steps[current] == 'confirm'" />
    </div>
    <template #footer>
      <Buttons />
    </template>
  </Dialog>
</template>

<script>
import Buttons from "../serviceRequestDialog/Buttons.vue";
import Service from "../serviceRequestDialog/Service.vue";
import Date from "../serviceRequestDialog/Date.vue";
import Poison from "../serviceRequestDialog/Poison.vue";
import Terrain from "../serviceRequestDialog/Terrain.vue";
import Location from "../serviceRequestDialog/Location.vue";
import Confirm from "../serviceRequestDialog/Confirm.vue";
import ServiceRequestService from "../../../service/applicant/serviceRequestService.js";
export default {
  components: { Terrain, Buttons, Service, Date, Poison, Location, Confirm },
  data() {
    return {
      display: false,
      steps: ["service", "date", "terrain", "poison", "location", "confirm"],
      subTitles: [
        "خدمت مورد نظر خود را انتخاب نمایید",
        "تاریخ ارائه خدمت را مشخص نمایید",
        "مشخصات زمین را وارد نمایید",
        "نوع و نام سم را مشخص نمایید",
        "موقعیت مکانی دقیق زمین را مشخص نمایید",
        "آیا این اطلاعات مورد تایید است؟",
      ],
      current: 0,
      service: null,
      date: null,
      terrain: null,
      area: null,
      product: null,
      address: null,
      type: null,
      poison: null,
      location: null,
      disableNextButton: true,
      loading: false,
      serviceRequestService: null,
      services: null,
      terrains: null,
      products: null,
      types: null,
      poisons: null,
      minDate: null,
      currentDate: null,
      profile: false,
      price: 0,
      elevation: 0,
    };
  },
  methods: {
    close() {
      this.display = false;
    },
    prev() {
      if (this.current == 4 && this.service.option != "poisons")
        this.current -= 2;
      else this.current--;
      this.enableNextButton();
    },
    next() {
      this.disableNextButton = true;
      if (this.current == 2 && this.service.option != "poisons") {
        this.current += 2;
      } else this.current++;
      this.enableNextButton();
      if (this.current == 3 && !this.types) {
        this.getPoisonTypes();
      }
      if (this.current == 5) {
        this.pricing();
      }
    },
    complete() {
      const count = this.address.length - 1;
      let address = this.address[count];
      let data = {
        service: this.service.id,
        date:
          this.date.getFullYear() +
          "/" +
          (this.date.getMonth() + 1) +
          "/" +
          this.date.getDate(),
        option: this.service.option,
        area: this.area,
        product: this.product.id,
        address: { type: address.type, id: address.id },
        location: this.location,
      };

      if (this.service.option == "poisons") {
        data.poison = this.poison.id;
      }
      this.loading = true;
      this.serviceRequestService.store(
        data,
        () => {
          this.display = false;
          this.loading = false;
          setTimeout(() => {
            this.$confirm.require({
              message:
                "درخواست خدمت شما با موفقیت ثبت شد. لطفا بیعانه آن را پرداخت نمایید",
              header: "اطلاعیه",
              icon: "pi pi-check",
              acceptLabel: "باشه",
              acceptClass: "p-button-success p-button-sm float-left",
              rejectLabel: "",
              accept: () => {
                this.$router.push("/applicant/requests#new");
              },
              reject: () => {},
            });
          }, 500);
        },
        (error) => {
          this.loading = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    getTerrains() {
      this.serviceRequestService.getTerrains(
        (data) => {
          this.terrains = data.terrains;
          if ("country" in data.address) {
            this.address = [];
            this.location = data.location || data.address.province.location;
            Object.entries(data.address).forEach((x) => {
              this.address.push({
                type: x[0],
                id: x[1].id,
                title: x[1].title,
              });
            });
          }
        },
        () => {}
      );
    },
    getProducts(terrain) {
      this.products = null;
      this.product = null;
      this.serviceRequestService.getProducts(
        terrain,
        (data) => {
          this.products = data.products;
        },
        () => {}
      );
    },
    getPoisonTypes() {
      this.serviceRequestService.getPoisonTypes(
        (data) => {
          this.types = data.types;
        },
        () => {}
      );
    },
    getPoisons(product, poisonType) {
      this.poisons = null;
      this.poison = null;
      this.serviceRequestService.getPoisons(
        { product, poisonType },
        (data) => {
          this.poisons = data.poisons;
        },
        () => {}
      );
    },
    pricing() {
      const count = this.address.length - 1;
      let address = this.address[count];
      this.price = 0;
      this.elevation = 0;
      const data = {
        service: this.service.id,
        product: this.product.id,
        location: this.location,
        area: this.area,
        address,
      };
      this.serviceRequestService.pricing(
        data,
        (response) => {
          this.price = response.price;
          this.elevation = response.elevation;
        },
        () => {}
      );
    },
    enableNextButton() {
      switch (this.current) {
        case 0:
          this.disableNextButton = this.service == null;
          break;
        case 1:
          this.disableNextButton = this.date == this.currentDate;
          break;
        case 2:
          {
            if (!this.address) {
              this.disableNextButton = true;
            } else {
              const count = this.address.length - 1;
              const address = this.address[count];
              this.disableNextButton =
                this.area < 1 ||
                count < 2 ||
                this.product == null;
              if (address.type == "province") {
                this.location = address.location;
                this.disableNextButton = true;
              }
            }
          }
          break;

        case 3:
          this.disableNextButton = this.poison == null;
          break;

        case 4:
          this.disableNextButton = this.location == this.address[1].location;
          break;
        default:
          this.disableNextButton = false;
          break;
      }
    },
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  watch: {
    service(v) {
      this.disableNextButton = v == null;
      this.terrain = null;
      this.product = null;
      this.type = null;
      this.poison = null;
      this.price = null;
    },
    date() {
      if (!this.terrains) {
        this.getTerrains();
      }
      this.enableNextButton();
    },
    address() {
      if (this.service) {
        this.enableNextButton();
        this.price = null;
      }
    },
    area() {
      this.enableNextButton();
      this.price = null;
    },
    terrain(v) {
      if (v) this.getProducts(v.id);
    },
    product() {
      this.enableNextButton();
      this.type = null;
      this.poison = null;
    },
    type(v) {
      if (v) this.getPoisons(this.product.id, v.id);
    },
    poison() {
      this.enableNextButton();
    },
    location() {
      this.enableNextButton();
    },
    display(v) {
      if (v) {
        if (!this.services || !this.profile) {
          this.services = [{}, {}, {}, {}];
          this.serviceRequestService.getServices(
            (data) => {
              this.services = data.services;
              const timespan = data.timespan || 0;
              let date = data.date.split("/");
              date.forEach((e, index) => {
                date[index] = parseInt(e);
              });
              this.currentDate = this.$parent.getDate(date);
              this.date = this.currentDate;
              this.minDate = this.$parent.getDate(date, timespan);
              this.profile = true;
            },
            (error) => {
              if (error == 412) {
                this.$confirm.require({
                  message:
                    "برای ثبت درخواست خدمت خود ابتدا نمایه‌تان را کامل نمایید",
                  header: "اطلاعیه",
                  icon: "pi pi-user",
                  acceptLabel: "رفتن به نمایه",
                  acceptClass: "p-button-success p-button-sm float-left",
                  rejectLabel: "بستن",
                  accept: () => {
                    this.$router.push("/applicant/profile");
                  },
                  reject: () => {},
                });
                this.display = false;
              }
            }
          );
        } else {
          this.date = this.currentDate;
          if (!this.profile) {
            this.$confirm.require({
              message:
                "برای ثبت درخواست خدمت خود ابتدا نمایه‌تان را کامل نمایید",
              header: "اطلاعیه",
              icon: "pi pi-user",
              acceptLabel: "رفتن به نمایه",
              acceptClass: "p-button-success p-button-sm float-left",
              rejectLabel: "بستن",
              accept: () => {
                this.$router.push("/applicant/profile");
              },
              reject: () => {},
            });
            this.display = false;
          }
        }
      } else {
        this.current = 0;
        this.service = null;
        this.date = null;
        this.area = null;
        this.terrain = null;
        this.product = null;
        this.type = null;
        this.poison = null;
        this.location = null;
        this.disableNextButton = true;
      }
    },
  },
};
</script>

<style>
</style>