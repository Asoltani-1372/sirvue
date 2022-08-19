<template>
  <div>
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-lg w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">
            رد درخواست
        </div>
      </template>
      <div>
        <InputNumber
          v-model="value"
          :useGrouping="false"
          placeholder="توضیح"
          class="w-full"
        />
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
              label="رد درخواست"
              class="p-button-raised p-button-danger p-button-sm"
              @click="$refs.detailsDialog.open()"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  props: ["confirmBtn", "mapShow"],
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