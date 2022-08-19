<template>
  <div>
    <Dialog
      :visible="displayModal"
      class="max-w-xl lg:w-full w-11/12"
      :modal="true"
      :closable="false"
    >
      <template #header> جزئیات درخواست </template>
      <div class="flex flex-col gap-3">
        <div
          class="flex items-center justify-center flex-col gap-3"
          v-if="serviceHistory.servant"
        >
          <Avatar :image="serviceHistory.servant.avatar" shape="circle" size="xlarge" />

          <p>{{ serviceHistory.servant.firstname }} {{ serviceHistory.servant.lastname }}</p>
          <Tag :severity="serviceHistory.status.severity" :value="serviceHistory.status.value" />
        </div>
        <div class="flex justify-between">
          <p>نوع خدمت</p>
          <p>{{ serviceHistory.service }}</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.terrain">
          <p>نوع زمین</p>
          <p>{{ serviceHistory.terrain }}</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.product">
          <p>نوع محصول</p>
          <p>{{ serviceHistory.product }}</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.poison">
          <p>نوع سم</p>
          <p>{{ serviceHistory.poison.type }}</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.poison">
          <p>نام سم</p>
          <p>{{ serviceHistory.poison.title }}</p>
        </div>
        <div class="flex justify-between">
          <p>تاریخ درخواست</p>
          <p>{{ serviceHistory.date }} {{ serviceHistory.time }}</p>
        </div>
        <div class="flex justify-between">
          <p>مساحت زمین</p>
          <p>{{ serviceHistory.area }}</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.price">
          <p>هزینه خدمت</p>
          <p>{{ serviceHistory.price }} تومان</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.transport">
          <p>ایاب و ذهاب</p>
          <p>{{ serviceHistory.transport }} تومان</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.rate">
          <p>نقاط قوت</p>
          <p>{{ serviceHistory.rate.strengths.join(', ') }}</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.rate">
          <p>نقاط صعف</p>
          <p>{{ serviceHistory.rate.weaks.join(', ') }}</p>
        </div>
        <div class="flex justify-between" v-if="serviceHistory.rate">
          <p>نظر متقاضی</p>
          <p>{{ serviceHistory.rate.comment }}</p>
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
        <Map :input="serviceHistory.location" ref="mapDialog" class=""/>
      </div>

      <template #footer>
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="displayModal = false"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import ServiceRequestService from "../../../service/applicant/serviceRequestService";
import Map from "../../../components/basic/Map.vue";
export default {
  components: {Map},
  data() {
    return {
      serviceRequestService: null,
      displayModal: false,
      id: null,
      serviceHistory: null,
      statuses: {
        canceled: { value: "لغو شده", severity: "danger" },
        rejected: { value: "رد شده", severity: "danger" },
        expired: { value: "منقضی شده", severity: "danger" },
        completed: { value: "انجام شده", severity: "success" },
      },
      fetching: true,
    };
  },

  created() {
    this.serviceRequestService = new ServiceRequestService();
  },

  mounted() {},

  methods: {
    open(id, index) {
      this.id = id;
      this.serviceRequestService.getServiceHistoryDialog(
        this.id,
        (data) => {
          this.serviceHistory = data.serviceHistory;
          this.serviceHistory.status = this.statuses[data.serviceHistory.status];
          this.displayModal = true;
          this.$parent.serviceHistories[index].loading = false;
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summery: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
  },
};
</script>

<style>
</style>