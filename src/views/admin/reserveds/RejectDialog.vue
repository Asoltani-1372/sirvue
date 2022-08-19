<template>
  <div>
    <Dialog
      header="Header"
      v-model:visible="deleteProductDialog"
      class="max-w-2xl w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">رد شده</div>
      </template>
      <div class="flex flex-col gap-3">
        <div class="flex justify-around mb-4">
          <div>
            <div class="flex flex-col items-center gap-3">
              <Avatar
                image="https://primefaces.org/primevue/showcase/demo/images/avatar/ionibowcher.png"
                size="xlarge"
              />
              <div class="text-left">نام متقاضی</div>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <div>تاریخ</div>
          <div>1400.12.12</div>
        </div>
        <div class="flex justify-between">
          <div>منطقه</div>
          <div>تهران</div>
        </div>
        <div class="flex justify-between">
          <div>خدمت</div>
          <div>خدمت</div>
        </div>
        <div class="flex justify-between" v-for="i in 4" :key="i">
          <div>عنوان مشخصات زمین</div>
          <div>مقدار</div>
        </div>
        <div class="flex justify-between">
          <div>توضیحات</div>
          <div>توضیحات من</div>
        </div>
        <div
          class="
            w-full
            h-48
            flex
            justify-center
            items-center
            bg-indigo-300
            rounded
          "
        >
          Map
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-sm"
            @click="open"
          />
        </div>
      </template>
    </Dialog>
    <CancelDialog ref="cancelDialog" />
  </div>
</template>


<script>
import CancelDialog from "./CancelDialog.vue";
export default {
  components: { CancelDialog },
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