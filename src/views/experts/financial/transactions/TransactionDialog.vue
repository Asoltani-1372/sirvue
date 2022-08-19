<template>
  <div>
    <Dialog
      :visible="displayModal"
      class="max-w-2xl w-full"
      :modal="true"
      :closable="false"
    >
      <template #header> جزئیات تراکنش </template>

      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <Avatar :image="data.user.avatar" shape="circle" size="xlarge" />
            <p>{{ data.user.firstname }} {{ data.user.lastname }}</p>
          </div>
          <Tag :severity="data.status.severity" :value="data.status.value" />
        </div>
        <div class="flex justify-between items-center">
          <p>مبلغ</p>
          <p>{{ data.amount }}</p>
        </div>
        <div class="flex justify-between items-center">
          <p>تاریخ</p>
          <p>{{ data.date }}</p>
        </div>
        <div class="flex justify-between items-center" v-if="data.bank">
          <p>نام بانک</p>
          <p>{{ data.bank }}</p>
        </div>
        <div class="flex justify-between items-center" v-if="data.identity">
          <p>شماره شبا</p>
          <p>{{ data.identity }}</p>
        </div>
        <div class="flex justify-between items-center" v-if="data.number">
          <p>شماره حساب</p>
          <p>{{ data.number }}</p>
        </div>
        <div class="flex justify-between items-center">
          <p>شماره تراکنش</p>
          <p>{{ data.transaction }}</p>
        </div>
        <div class="flex justify-between items-center">
          <p>توضیحات</p>
          <p>{{ data.desc }}</p>
        </div>
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
export default {
  data() {
    return {
      displayModal: false,
      data: null,
      statuses: {
        severity: {
          deposit: "info",
          paid: "success",
          cleared: "warning",
        },
        value: {
          deposit: "شارژ کیف پول",
          paid: "هزینه خدمت",
          cleared: "تسویه شده",
        },
      },
    };
  },

  methods: {
    open(data) {
      this.displayModal = true;
      this.data = data;
    },
  },
};
</script>

<style>
</style>