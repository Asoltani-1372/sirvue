<template>
  <div>
    <Dialog
      header="Confirmation"
      v-model:visible="deleteProductDialog"
      :modal="true"
      class="max-w-xl w-10/12 lg:w-full"
    >
      <template #header>
        <div class="font-bold text-xl">رد درخواست</div>
      </template>
      <div class="confirmation-content flex flex-col">
        <Textarea v-model="value2" :autoResize="true" rows="3" cols="25" placeholder="توضیحات"/>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            @click="open"
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