<template>
  <div>
    <Dialog
      :visible="displayModal"
      class="max-w-xl lg:w-full w-11/12"
      :modal="true"
      :closable="false"
      header="پرداخت آفلاین"
    >
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-3 items-center">
          <Avatar :image="data.user.avatar" shape="circle" size="large" />
          <p>
            {{ data.user.firstname + " " + data.user.lastname }}
          </p>
        </div>
        <div class="flex justify-between">
          <p>مبلغ</p>
          <p>{{ data.amount }} تومان</p>
        </div>
        <div class="flex justify-between">
          <p>تاریخ</p>
          <p>{{ data.date_created }}</p>
        </div>
        <div class="flex justify-between">
          <img :src="data.image" alt="تصویر" class="w-full h-auto" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="displayModal = false"
          />
          <div class="flex gap-3" v-if="data.status == 'pending'">
            <Button
              label="رد کردن"
              class="p-button-danger p-button-text p-button-sm"
              @click="reject()"
              :loading="rejecting"
            />
            <Button
              label="تایید پرداخت"
              class="p-button-success p-button-info p-button-sm"
              @click="verify()"
              :loading="verifing"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import FinancialService from "../../../../service/financialExpert";
export default {
  data() {
    return {
      displayModal: false,
      data: null,
      financialService: null,
      rejecting: false,
      verifing: false,
    };
  },
  created() {
    this.financialService = new FinancialService();
  },
  methods: {
    open(data) {
      this.data = data;
      this.displayModal = true;
    },

    reject() {
      this.rejecting = true;
      this.financialService.reject(
        this.data.id,
        () => {
          this.rejecting = false;
          this.displayModal = false;
          this.$emit("call", "");
          this.$toast.add({
            severity: "warn",
            summary: "موفق",
            detail: 'باموفقیت رد شد',
            life: 3000,
          });
        },
        (error) => {
          this.rejecting = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },

    verify() {
      this.verifing = true;
      this.financialService.verify(
        this.data.id,
        () => {
          this.verifing = false;
          this.displayModal = false;
          this.$emit("call", "");
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: 'باموفقیت تایید شد',
            life: 3000,
          });
        },
        (error) => {
          this.verifing = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
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