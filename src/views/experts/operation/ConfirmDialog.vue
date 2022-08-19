<template>
  <div>
    <Dialog
      header="Confirmation"
      v-model:visible="deleteProductDialog"
      :modal="true"
    >
      <template #header>
        <div class="font-bold text-xl">تایید درخواست</div>
      </template>
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>آیا مطمئن هستید که می خواهید ادامه دهید؟</span>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            @click="closeConfirmation"
            class="p-button-text"
          />
          <Button
            label="تایید"
            @click="closeConfirmation"
            class="p-button-raised p-button-success p-button-sm"
            autofocus
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  props: ["confirmBtn"],
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
</style>