<template>
  <div>
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-2xl w-full"
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
          <div>
            <Button
              label="چاپ"
              class="p-button-raised p-button-success p-button-sm"
              @click="deleteProductDialog = false"
            />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div>مبلغ</div>
          <div>12.000.000</div>
        </div>
        <div class="flex justify-between items-center">
          <div>شماره شبا</div>
          <div>8932938472000028</div>
        </div>
        <div class="flex justify-between items-center">
          <div>تاریخ</div>
          <div>1400/10/26</div>
        </div>
        <div class="flex justify-between items-center">
          <div>کدملی</div>
          <div>3789329378</div>
        </div>
        <div class="flex justify-between items-center">
          <div>تلفن</div>
          <div>09393928392</div>
        </div>
        <div class="flex justify-between items-center">
          <div>نام بانک</div>
          <div>تجارت</div>
        </div>
        <div class="flex justify-between items-center">
          <div>شماره ارجاع</div>
          <div>393200239</div>
        </div>
      </div>

      <template #footer>
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="deleteProductDialog = false"
        />
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