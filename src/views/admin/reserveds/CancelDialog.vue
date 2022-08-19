<template>
  <div>
    <Dialog
      header="Confirmation"
      v-model:visible="displayConfirmation"
      :style="{ width: '350px' }"
      :modal="true"
    >
      <template #header>
        <div class="font-bold text-lg">لغو خدمت</div>
      </template>
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>آیا مطمئن هستید که می خواهید ادامه دهید؟</span>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            icon="pi pi-times"
            @click="open"
            class="p-button-text p-button-sm"
          />
          <Button
            label="تایید"
            icon="pi pi-check"
            @click="open"
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
  data() {
    return {
      displayConfirmation: false,
    };
  },
  methods: {
        
    open() {
      this.displayConfirmation = !this.displayConfirmation;
    },
  },
};
</script>

<style>
</style>