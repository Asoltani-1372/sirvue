<template>
  <Dialog
    :visible="displayModal"
    class="max-w-xl lg:w-full w-11/12"
    header="لغو خدمت"
    :modal="true"
    :closable="false"
  >
    <div class="confirmation-content flex-col gap-3 pt-1">
      <Dropdown
        v-model="reason"
        :options="reasons"
        optionLabel="title"
        optionValue="id"
        placeholder="دلیل لغو خدمت"
        class="w-full"
        :class="{ 'p-invalid': errors.reason }"
      />
      <p class="text-xs text-red-600">{{ errors.reason }}</p>

      <Textarea
        placeholder="توضیحات"
        :autoResize="true"
        class="w-full"
        rows="7"
        v-model="desc"
        :class="{ 'p-invalid': errors.desc }"
      />
      <p class="text-xs text-red-600">{{ errors.desc }}</p>
    </div>
    <template #footer>
      <div class="flex justify-between w-full">
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="displayModal = false"
          :disabled="loading"
        />
        <Button
          label="لغو خدمت"
          class="p-button-danger p-button-outlined p-button-sm"
          @click="cancelService(id)"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import ServiceRequestService from "../../../service/applicant/serviceRequestService";
export default {
  data() {
    return {
      displayModal: false,
      serviceRequestService: null,
      reasons: null,
      id: null,
      reason: null,
      desc: "",
      errors: {},
      loading:false
    };
  },

  created() {
    this.serviceRequestService = new ServiceRequestService();
  },

  methods: {
    open(id, reasons) {
      this.displayModal = true;
      this.reasons = reasons;
      this.reason = null;
      this.desc = '';
      this.id = id;
      this.loading = false
    },

    cancelService() {
      const data = {
        desc: this.desc,
        reason: this.reason,
      };
      if (!this.reason) {
        this.errors.reason = "دلیل لغو خدمت انتخاب نشده است.";
      } else if (this.desc.length < 15) {
        this.errors.desc = "توضیحات حداقل 15 حرف  می باشد";
      } else {
        this.loading = true;
        this.serviceRequestService.Cancel(
          this.id,
          data,
          () => {
            this.$emit("call", "");
            this.displayModal = false;
            this.$toast.add({
              severity: "success",
              summery: "موفق",
              detail: "خدمت با موفقیت لغو شد.",
              life: 3000,
            });
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
      }
    },
  },

  watch: {
    desc(v) {
      if (v.length > 0) {
        this.errors.desc = "";
      } else {
        this.errors.desc = "توضیحات نمی تواند خالی باشد.";
      }
    },
  },
};
</script>

<style>
</style>