<template>
  <div>
    <Dialog
      :visible="displayModal"
      class="max-w-2xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
      :dragable="false"
    >
      <template #header>
        <div class="font-bold text-lg">تسویه حساب</div>
      </template>

      <div class="text-sm">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3 items-center">
            <Avatar :image="data.user.avatar" shape="circle" size="xlarge" />
            <p>{{ data.user.firstname + " " + data.user.lastname }}</p>
          </div>

          <div class="flex justify-between">
            <p>مبلغ</p>
            <p>{{ data.amount }}</p>
          </div>

          <div class="flex justify-between">
            <p>تاریخ درخواست</p>
            <p>{{ data.date_created }}</p>
          </div>

          <div class="flex justify-between hidden">
            <p>تاریخ تایید</p>
            <p>{{ data.date_confirmed }}</p>
          </div>

          <div class="flex flex-col gap-3">
            <InputText
              v-model="transaction"
              placeholder="شناسه واریز"
              class="pi-inputtext-sm"
              :class="{ 'p-invalid': errors.transaction }"
              :useGrouping="false"
              @input="checker()"
              type="number"
            />
            <p class="text-xs text-red-600">{{ errors.transaction }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="displayModal = false"
          />
          <Button
            label="تسویه شود"
            class="p-button-raised p-button-success p-button-sm"
            @click="validation()"
            :loading="loading"
            :disabled="!transaction"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import FinancialExpert from "../../../../service/financialExpert";
export default {
  data() {
    return {
      financialService: null,
      loading: false,
      transaction: null,
      data: null,
      displayModal: false,
      errors: {},
    };
  },

  created() {
    this.financialService = new FinancialExpert();
  },

  methods: {
    checker() {
      if (this.transaction) {
        this.errors.transaction = "";
      } else if (!this.transaction) {
        this.errors.transaction = "شناسه پرداخت نمی تواند خالی باشد.";
      }
    },

    open(data) {
      this.data = data;
      this.transaction = null;
      this.errors.transaction = "";
      this.displayModal = true;
    },

    validation() {
      if (!this.transaction) {
        this.errors.transaction = "شناسه پرداخت نمی تواند خالی باشد.";
      } else {
        this.payOf();
      }
    },

    payOf() {
      this.loading = true;
      const data = {
        id: this.data.id,
        transaction: this.transaction,
      };
      this.financialService.payOf(
        data,
        () => {
          this.$emit("call", "");
          this.displayModal = false;
          this.loading = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "با موفقیت اطلاعات تسویه ثبت شد",
            life: 3000,
          });
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
  },
};
</script>

<style>
</style>