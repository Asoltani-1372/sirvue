<template>
  <div>
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-2xl w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">بررسی هویت</div>
      </template>
      <div class="flex justify-center items-center">
        <Image :src="nationalCodeImage" alt="تصویر کارت ملی" preview />
      </div>

      <div class="flex flex-col gap-8">
        <div class="flex justify-between items-center">
          <div>نام</div>
          <div>سید رسول موسوی</div>
        </div>
        <div class="flex justify-between items-center">
          <div>تاریخ تولد</div>
          <div>1400/10.20</div>
        </div>
        <div class="flex justify-between items-center">
          <div>جنسیت</div>
          <div>مرد</div>
        </div>
        <div class="flex justify-between items-center">
          <div>کدملی</div>
          <div>3231931391</div>
        </div>
        <div class="flex justify-between items-center">
          <div>نقش</div>
          <div>خدمات دهنده</div>
        </div>
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
              @click="$refs.rejectAuthDialog.open()"
            />
            <Button
              label="تایید هویت"
              class="p-button-raised p-button-success p-button-sm"
              @click="$refs.confirmAuthDialog.open()"
            />
          </div>
        </div>
      </template>
    </Dialog>
    <ConfirmAuthDialog ref="confirmAuthDialog" />
    <RejectAuthDialog ref="rejectAuthDialog" />
  </div>
</template>

<script>
import ConfirmAuthDialog from "./ConfirmAuthDialog.vue";
import RejectAuthDialog from "./RejectAuthDialog.vue";
export default {
  components: { ConfirmAuthDialog, RejectAuthDialog },
  data() {
    return {
      deleteProductDialog: false,
      nationalCodeImage: "https://picsum.photos/id/1/200/300",
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