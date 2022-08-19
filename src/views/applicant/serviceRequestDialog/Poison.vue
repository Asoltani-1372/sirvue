<template>
  <div
    class="w-full h-80 flex flex-col gap-3  p-px"
  >
    <p class="font-bold">نوع سم</p>
    <Dropdown
      v-model="parent.type"
      :options="parent.types"
      optionLabel="title"
      placeholder="نوع سم را انتخاب نمایید"
      :loading="!parent.types"
    />
    <p class="font-bold mt-4">نام سم</p>
    <Dropdown
      v-model="parent.poison"
      :options="parent.poisons"
      optionLabel="title"
      placeholder="سم را انتخاب نمایید"
      :loading="parent.type && !parent.poisons"
      :disabled="!parent.type || !parent.poisons"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      parent: null,
      type: null,
    };
  },

  created() {
    this.parent = this.$parent.$parent.$parent;
  },

};
</script>

<style>
</style>