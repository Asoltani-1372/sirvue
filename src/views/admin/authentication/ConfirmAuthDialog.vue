<template>
  <div>
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-lg w-full"
      :modal="true"
      :closable="false"
    >
      <template #header> </template>

      <div>
        <p>آیا میخواهید ادامه دهید ؟</p>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <div>
            <Button
              label="بازگشت"
              class="p-button-text p-button-info p-button-sm"
              @click="deleteProductDialog = false"
            />
          </div>
          <div>
            <Button
              label="تایید هویت"
              class="p-button-raised p-button-success p-button-sm"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
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
</style>