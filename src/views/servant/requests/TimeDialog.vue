<template>
  <Dialog
    v-model:visible="hourDialog"
    class="max-w-md lg:w-full w-9/12"
    header="تنظیم زمان"
    :modal="true"
  >
    <template #header> </template>
    <div class="confirmation-content flex-col gap-3 items-center">
      <p>زمان ارائه خدمت را تنظیم نمایید</p>
      <Calendar
        class="w-full"
        :timeOnly="true"
        :inline="true"
        placeholder="زمان ارائه خدمت را تنظیم نمایید"
        v-model="time"
      />
    </div>
    <!-- <InputNumber
      class="w-full my-1 text-sm"
      v-model="marginPrice"
      placeholder="هزینه مورد نظر تان را اینجا وارد نمایید"
    /> -->
    <template #footer>
      <div class="flex justify-between w-full">
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="hourDialog = false"
        />
        <Button
          label="تایید شود"
          class="p-button-success p-button-sm"
          @click="confirm()"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import ServiceRequestService from "../../../service/servant/ServiceRequests.js";
export default {
  data() {
    return {
      hourDialog: false,
      loading: false,
      time: new Date(),
      marginPrice: null,
    };
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  methods: {
    open() {
      this.hourDialog = true;
    },
    close() {
      this.hourDialog = false;
      this.loading = false;
    },
    confirm() {
      this.loading = true;
      const time = this.time.getHours() + ":" + this.time.getMinutes();
      const data = {
        time,
        marginPrice : this.marginPrice
      }
      this.$emit("call", data);
    },
  },
};
</script>

<style>
.p-datepicker {
  @apply border-0;
}
.p-timepicker {
  direction: ltr;
}
</style>