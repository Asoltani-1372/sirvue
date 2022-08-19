<template>
  <div class="flex gap-8">
    <div class="w-1/3">
      <Add />
    </div>

    <List class="flex-grow" />
  </div>
</template>

<script>
import List from "../../views/admin/supportType/List.vue";
import Add from "../../views/admin/supportType/Add.vue";
export default {
  components: { List, Add },
};
</script>

<style>
</style>