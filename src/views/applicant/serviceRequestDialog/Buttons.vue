<template>
  <div class="flex justify-between" v-if="parent">
    <Button
      v-if="parent.current == 0"
      label="بازگشت"
      class="p-button-text p-button-sm"
      @click="parent.close()"
    />
    <Button
      v-else-if="parent.current == parent.steps.length - 1"
      label="ویرایش"
      icon="pi pi-pencil"
      class="p-button-text p-button-sm"
      @click="parent.prev()"
      :disabled="parent.loading"
    />
    <Button
      v-else
      label="قبلی"
      icon="pi pi-chevron-right"
      class="p-button-text p-button-sm"
      @click="parent.prev()"
    />
    <Button
      v-if="parent.current == parent.steps.length - 1"
      label="ثبت نهایی"
      icon="pi pi-check"
      class="p-button-sm p-button-success"
      iconPos="left"
      @click="parent.complete()"
      :loading="parent.loading"
    />
    <Button
      v-else
      label="بعدی"
      icon="pi pi-chevron-left"
      class="p-button-sm "
      :class="[parent.disableNextButton ? 'p-button-secondary p-button-text': 'p-button-success']"
      iconPos="right"
      @click="parent.next()"
      :disabled="parent.disableNextButton"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      parent: null,
    };
  },
  created() {
    this.parent = this.$parent.$parent.$parent;
  },
};
</script>

<style>
</style>