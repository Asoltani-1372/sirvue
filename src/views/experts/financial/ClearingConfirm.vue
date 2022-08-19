<template>
  <div>
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-lg w-full"
      :modal="true"
      :closable="false"
    >
      <template #header> </template>

      <div class="flex flex-col gap-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <Avatar
              image="https://picsum.photos/id/237/200/300"
              shape="circle"
              size="xlarge"
            />
            <div>نام درخواست کننده</div>
          </div>
        </div>
          <InputNumber v-model="value" :useGrouping="false" placeholder="شماره ارجاع"/>
        
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
              label="تایید"
              class="p-button-raised p-button-success p-button-sm"
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