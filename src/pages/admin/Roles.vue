<template>
  <div class="flex gap-8">
    <div class="w-1/3">
      <AddRole />
    </div>

    <List class="flex-grow" />
  </div>
</template>

<script>
import List from "../../views/admin/roles/List.vue";
import AddRole from "../../views/admin/roles/AddRole.vue";
export default {
  components: { List, AddRole },
};
</script>

<style>
</style>