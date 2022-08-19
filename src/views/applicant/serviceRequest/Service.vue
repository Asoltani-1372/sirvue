<template>
  <Card class="w-full">
    <template #title>
      <Skeleton width="12rem" height="2rem" v-if="fetching" />
      <p v-else>انتخاب خدمت</p>
    </template>
    <template #content>
      <div class="flex flex-col lg:flex-row gap-4 w-full justify-around">
        <DataTable
          :value="services"
          v-model:selection="service"
          :selectionMode="fetching ? '' : 'single'"
          dataKey="id"
          responsiveLayout="scroll"
          class="w-1/2 text-right"
          :striped="!fetching"
        >
          <Column>
            <template #header>
              <Skeleton width="10rem" v-if="fetching" />
              <p v-else>خدمات دردسترس</p>
            </template>
            <template #body="{ data }">
              <div class="flex items-center gap-4">
                <Skeleton width="5rem" height="3.5rem" v-if="fetching" />
                <img v-else :src="data.image" class="rounded w-20 h-14" />
                <div class="flex flex-col gap-4 w-full text-right">
                  <Skeleton width="10rem" v-if="fetching" />
                  <p v-else class="font-bold">{{ data.title }}</p>
                  <Skeleton width="100%" v-if="fetching" />
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
        <div v-if="fetching" class="flex flex-col gap-4 px-8 w-1/2">
          <Skeleton height="3rem" />
          <Skeleton height="23rem" />
        </div>
        <Calendar
          v-else
          v-model="date"
          :inline="true"
          :minDate="minDate"
          class="w-1/2"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Skeleton v-if="fetching" height="2rem" width="16rem" />
        <Button
          v-else
          label="بازگشت به فهرست درخواست‌ها"
          icon="pi pi-chevron-right"
          iconPos="left"
          class="p-button-text p-button-sm"
          @click="serviceRequestsList()"
        />
        <Skeleton v-if="fetching" height="3rem" width="6rem" />
        <Button
          v-else
          label="بعدی"
          icon="pi pi-chevron-left"
          class="p-button-sm p-button-success"
          iconPos="right"
          @click="nextPage()"
          :disabled="!service || !selectDate"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import ServiceRequestService from "../../../service/applicant/serviceRequestService.js";
export default {
  data() {
    return {
      serviceRequestService: null,
      fetching: true,
      services: [{}, {}, {}, {}],
      service: null,
      place: null,
      date: null,
      minDate: null,
      selectDate: null,
      initDate: false,
    };
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  mounted() {
    this.serviceRequestService.getServices(
      (data) => {
        this.services = data.services;
        const timespan = data.timespan || 0;
        let date = data.date.split("/");
        date.forEach((e, index) => {
          date[index] = parseInt(e);
        });
        this.minDate = new Date(
          date[0],
          date[1] - 1,
          date[2] + timespan,
          0,
          0,
          0,
          0
        );
        this.date = new Date(date[0], date[1] - 1, date[2], 0, 0, 0, 0);
        this.$emit("loaded", "");
        this.fetching = false;
      },
      (error) => {
        if (error == 412) {
          this.$confirm.require({
            message: "برای ثبت درخواست خدمت خود ابتدا نمایه‌تان را کامل نمایید",
            header: "اطلاعیه",
            icon: "pi pi-user",
            acceptLabel: "رفتن به نمایه",
            acceptClass: "p-button-success p-button-sm float-left",
            rejectLabel: "بستن",
            accept: () => {
              this.$router.push("/applicant/profile");
            },
            reject: () => {
              this.$router.push("/applicant/requests");
            },
          });
        }
      }
    );
  },
  methods: {
    nextPage() {
      this.$emit("next-page", {
        formData: {
          service: this.service,
          date:
            this.date.getFullYear() +
            "/" +
            (this.date.getMonth() + 1) +
            "/" +
            this.date.getDate(),
        },
        pageIndex: 0,
      });
    },
    serviceRequestsList() {
      const route = this.$route.path.split("/")[1];
      this.$router.push("/" + route + "/requests");
    },
  },
  watch: {
    date(v) {
      if (v) {
        if (this.initDate) {
          this.selectDate = v;
        } else this.initDate = true;
      }
    },
  },
};
</script>

<style>
</style>