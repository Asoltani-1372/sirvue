<template>
  <div>
    <Dialog
      :visible="displayModal"
      class="max-w-xl lg:w-full w-11/12"
      :modal="true"
      :closable="false"
      header="جزئیات درخواست"
    >
      <div class="flex flex-col gap-3">
        <div class="flex justify-evenly items-center">
          <div
            class="flex items-center justify-center flex-col gap-3"
            v-if="data.applicant"
          >
            <Avatar
              :image="data.applicant.avatar"
              shape="circle"
              size="xlarge"
            />

            <p>{{ data.applicant.firstname }} {{ data.applicant.lastname }}</p>
          </div>

          <div
            class="flex items-center justify-center flex-col gap-3"
            v-if="data.servant"
          >
            <Avatar :image="data.servant.avatar" shape="circle" size="xlarge" />

            <p>{{ data.servant.firstname }} {{ data.servant.lastname }}</p>
          </div>
        </div>
        <Tag
          :severity="data.status.severity"
          :value="data.status.title"
          class="w-1/3 mx-auto"
        />
        <div class="flex justify-between" v-if="data.phone">
          <p>شماره تماس خدمت دهنده</p>
          <p>{{ data.phone }}</p>
        </div>
        <div class="flex justify-between">
          <p>نوع خدمت</p>
          <p>{{ data.service }}</p>
        </div>
        <div class="flex justify-between">
          <p>نوع زمین</p>
          <p>{{ data.terrain }}</p>
        </div>
        <div class="flex justify-between">
          <p>نوع محصول</p>
          <p>{{ data.product }}</p>
        </div>
        <div class="flex justify-between" v-if="data.poison">
          <p>نوع سم</p>
          <p>{{ data.poison.type }}</p>
        </div>
        <div class="flex justify-between" v-if="data.poison">
          <p>نام سم</p>
          <p>{{ data.poison.title }}</p>
        </div>
        <div class="flex justify-between">
          <p>تاریخ انجام</p>
          <p>{{ data.date }} {{ data.time }}</p>
        </div>
        <div class="flex justify-between">
          <p>مساحت زمین</p>
          <p>{{ data.area }} هکتار</p>
        </div>
        <div class="flex justify-between">
          <p>هزینه خدمت</p>
          <p>{{ data.price }} تومان</p>
        </div>
        <div class="flex justify-between" v-if="data.transport != 0">
          <p>ایاب و ذهاب</p>
          <p>{{ data.transport }} تومان</p>
        </div>
        <div class="flex justify-between">
          <p>نشانی زمین</p>
          <p>{{ data.address }}</p>
        </div>
        <div class="flex justify-between items-center">
          <p>موقعیت مکانی</p>
          <Button
            class="p-button-text p-button-success p-button-sm"
            icon="pi pi-map"
            label="مشاهده"
            @click="$refs.mapDialog.displayDialog = true"
          />
        </div>
      </div>
      <Map :input="data.location" ref="mapDialog" />
      <template #footer>
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="displayModal = false"
        />
        <Button
          v-if="data.status.state == 'broadcast' && $route.path.split('/')[1] == 'allocator'"
          label="انتقال به درخواست ها"
          class="p-button-raised p-button-success p-button-sm float-left"
          @click="move(data.id)"
          :loading="loading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import Map from "../../../components/basic/Map.vue";
import ServiceRequestService from "../../../service/applicant/serviceRequestService.js";
export default {
  components: { Map },
  data() {
    return {
      displayModal: false,
      data: null,
      loading: false,
      statuses: {
        allocating: { severity: "warning", title: "در انتظار تایید کارشناس" },
        accepting: { severity: "info", title: "در انتظار تایید خدمت دهنده" },
        paying: { severity: "primary", title: "در انتظار پرداخت" },
        coordinating: { severity: "help", title: "در انتظار هماهنگی" },
        doing: { severity: "info", title: "در انتظار انجام" },
        rating: { severity: "success", title: "در انتظار تایید انجام" },
        done: { severity: "success", title: "تکمیل شده" },
        expired: { title: "منقضی شده", severity: "danger" },
        rejected: { severity: "danger", title: "رد شده" },
        canceled: { severity: "danger", title: "لغو شده" },
        verifying: { severity: "primary", title: "در انتظار صدور مجوز" },
      },
    };
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  methods: {
    open(data) {
      this.displayModal = true;
      this.data = data;
    },

    move(id) {
      this.$confirm.require({
        message: "آیا از انتقال این خدمت اطمینان دارید؟",
        header: "هشدار",
        icon: "pi pi-check",
        acceptLabel: "منتقل شود",
        acceptClass: "p-button-success p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.loading = true;
          this.serviceRequestService.move(
            id,
            () => {
              this.displayModal = false;
              this.loading = false;
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "با موفقیت انقال یافت",
                life: 3000,
              });
               this.$emit('call', '');
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
        reject: () => {},
      });
    },
  },
};
</script>

<style>
</style>