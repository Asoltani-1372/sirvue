<template>
  <Dialog
    v-model:visible="deleteProductDialog"
    class="max-w-sm w-full"
    header="تنظیم زمان"
    :modal="true"
  >
    <template #header> </template>
    <div class="confirmation-content flex-col gap-3 items-center">
      
      </div>
    <template #footer>
      <div class="flex justify-between w-full">
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="deleteProductDialog = false"
        />
        <Button
          label="تایید شود"
          class="p-button-success p-button-sm"
          @click="deleteProductDialog = false"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
export default {
  data() {
    return {
      deleteProductDialog: false,
    };
  },
  methods: {
    open() {
      this.deleteProductDialog = !this.deleteProductDialog;
    },
  },
};
</script>

<style>
.p-datepicker {
  @apply border-0;
}
.p-timepicker{
  direction: ltr;
}
</style>