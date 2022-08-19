<template>
  <Calendar
    v-model="parent.date"
    :inline="true"
    :minDate="parent.minDate"
    dateFormat="yyyy/dd/mm"
    class="max-w-screen-sm"
  />
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