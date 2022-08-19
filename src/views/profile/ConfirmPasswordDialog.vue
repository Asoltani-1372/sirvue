<template>
  <div>
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-2xl w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="text-lg font-bold">به روزرسانی اطلاعات</div>
      </template>
      <div class="flex flex-col gap-3">
        <Password
          v-model="value3"
          toggleMask
          placeholder="رمز عبور "
          inputClass="flex-grow p-inputtext-sm"
        />
      </div>

      <template #footer>
        <div class="flex justify-between w-full">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="deleteProductDialog = false"
          />
          <div class="flex">
            <Button
              label="تایید"
              class="p-button-success p-button-sm"
              @click="$refs.confirmDialog.open()"
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