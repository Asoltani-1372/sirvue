<template>
  <div class="service-step h-full">
    <Card class="w-1/4 hidden lg:block">
      <template #title>
        <Skeleton v-if="fetching" width="8rem" height="2rem" />
        <p v-else>درخواست خدمت جدید</p>
      </template>
      <template #content>
        <div class="steps-skeleton" v-if="fetching">
          <div v-for="i in items.length" :key="i">
            <Skeleton shape="circle" size="2.2rem" />
            <Skeleton width="8rem" height="1.5rem" />
          </div>
        </div>
        <Steps v-else :model="items" :readonly="true" class="my-8" />
      </template>
    </Card>
    <router-view
      class="w-full lg:w-3/4 pb-16 lg:pb-0"
      v-slot="{ Component }"
      :formData="formObject"
      @prevPage="prevPage($event)"
      @nextPage="nextPage($event)"
      @complete="complete($event)"
      @loaded="fetching = false"
    >
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
import serviceRequestService from "../../service/applicant/serviceRequestService.js";
export default {
  data() {
    return {
      items: [
        {
          label: "انتخاب خدمت",
          to: "/role/serviceRequest/service",
        },
        {
          label: "مشخصات زمین",
          to: "/role/serviceRequest/terrain",
        },
        {
          label: "موقعیت مکانی",
          to: "/role/serviceRequest/location",
        },
        {
          label: "تخصیص",
          to: "/role/serviceRequest/allocate",
        },
        {
          label: "تایید اطلاعات",
          to: "/role/serviceRequest/confirmation",
        },
      ],
      formObject: { elevation: 0 },
      fetching: true,
      serviceRequestService: null,
      role: null,
    };
  },
  methods: {
    nextPage(event) {
      for (let field in event.formData) {
        this.formObject[field] = event.formData[field];
      }
      this.$router.push(this.items[event.pageIndex + 1].to);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 1000);
      if (this.role == "company") {
        if (event.pageIndex == 3) {
          this.pricing();
        }
      } else {
        if (event.pageIndex == 2) {
          this.pricing();
        }
      }
    },
    prevPage(event) {
      this.formObject.loading = false;
      this.$router.push(this.items[event.pageIndex - 1].to);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 1000);
    },
    complete(event) {
      const count = this.formObject.address.length - 1;
      let address = this.formObject.address[count];
      let data = {
        service: this.formObject.service.id,
        date: this.formObject.date,
        terrain: this.formObject.terrain.id,
        option: this.formObject.service.option,
        area: this.formObject.area,
        product: this.formObject.product.id,
        address: { type: address.type, id: address.id },
        location: this.formObject.location,
      };

      if (this.formObject.service.option == "poisons") {
        data.poison = this.formObject.poison.id;
      }
      if (this.$route.path.split("/")[1] == "allocator") {
        data.price = event;
      }
      if ("applicant" in this.formObject) {
        //data.servant = this.formObject.servant.id;
        try {
          data.applicant = this.formObject.applicant.id;
        } catch (error) {
          //
        }
      }
      this.formObject.loading = true;
      this.serviceRequestService.store(
        data,
        () => {
          this.formObject.loading = false;
          const role = this.$route.path.split("/")[1];
          this.$router.push("/" + role + "/requests#new");
          let msg = "";
          if (role == "applicant") {
            msg = "لطفا بیعانه آن را پرداخت نمایید";
            this.$confirm.require({
              message: "درخواست خدمت شما با موفقیت ثبت شد. " + msg,
              header: "اطلاعیه",
              icon: "pi pi-check",
              acceptLabel: "باشه",
              acceptClass: "p-button-success p-button-sm float-left",
              rejectLabel: "",
              accept: () => {},
              reject: () => {},
            });
          } else if (role == "allocator") {
            this.$confirm.require({
              message: "درخواست خدمت شما با موفقیت ثبت شد. ",
              header: "اطلاعیه",
              icon: "pi pi-check",
              acceptLabel: "باشه",
              acceptClass: "p-button-success p-button-sm float-left",
              rejectLabel: "",
              accept: () => {},
              reject: () => {},
            });
          } else {
            this.$confirm.require({
              message: "درخواست خدمت شما با موفقیت ثبت شد. ",
              header: "اطلاعیه",
              icon: "pi pi-check",
              acceptLabel: "خودم پرداخت میکنم",
              acceptClass: "p-button-success p-button-sm float-left",
              rejectLabel: "کشاورز پرداخت میکند",
              rejectClass: "p-button-help p-button-sm float-right",
              accept: () => {},
              reject: () => {},
            });
          }
        },
        (error) => {
          this.formObject.loading = false;
          this.$toast.add({
            severity: "warn",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    pricing() {
      const count = this.formObject.address.length - 1;
      let address = this.formObject.address[count];
      this.formObject.price = 0;
      const data = {
        service: this.formObject.service.id,
        product: this.formObject.product.id,
        location: this.formObject.location,
        area: this.formObject.area,
        address,
      };
      this.serviceRequestService.pricing(
        data,
        (response) => {
          this.formObject.price = response.price;
          this.formObject.elevation = response.elevation;
        },
        () => {}
      );
    },
  },
  created() {
    this.role = this.$route.path.split("/")[1];
    if (this.role == "applicant") this.items.splice(3, 1);
    this.items.forEach((element) => {
      element.to = element.to.replace("role", this.role);
    });
    this.serviceRequestService = new serviceRequestService();
    if (this.$route.path != this.items[0].to) {
      window.location.href =
        window.location.origin + "/" + this.role + "/serviceRequest/service";
    }
  },
};
</script>

<style scoped>
.steps-skeleton {
  @apply flex flex-row lg:flex-col items-center justify-center gap-14 my-8;
}
.steps-skeleton > div {
  @apply flex flex-col gap-2 items-center;
}
</style>

<style>
.service-step {
  @apply flex flex-col h-full lg:flex-row gap-8 lg:p-8;
}

.service-step .p-steps ul {
  @apply lg:flex-col lg:gap-12;
}
</style>