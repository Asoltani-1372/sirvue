<template>
  <Dialog
    v-model:visible="deleteProductDialog"
    class="max-w-2xl w-11/12"
    :modal="true"
    :closable="false"
  >
    <template #header>
      <div class="font-bold text-lg">افزودن منطقه جدید</div>
    </template>
    <GetLocation @call="place = $event" ref="location" />
    <template #footer>
      <div class="flex justify-between w-full">
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="deleteProductDialog = false"
        />
        <Button
          label="افزودن"
          icon="pi pi-plus"
          class="p-button-success p-button-plain p-button-sm"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  components: {GetLocation},

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