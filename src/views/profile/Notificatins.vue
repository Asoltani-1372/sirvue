<template>
  <card class="bank">
    <template #header> </template>
    <template #title>
      <div class="flex justify-between items-center">
        <p>پیام رسانی</p>
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-outlined p-button-plain"
        />
      </div>
    </template>
    <template #content>
      <div class="flex w-full flex-col gap-3 px-4">
       
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <Button label="انصراف" class="p-button-text p-button-success" />
        <Button label="ذخیره" class="p-button-success p-button-plain" />
      </div>
    </template>
  </card>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created() {},
};
</script>

<style scoped>
.bank {
  @apply w-full;
}
</style>
<style>
.bank .p-cascadeselect-label {
  @apply p-2.5 !important;
}
</style>
