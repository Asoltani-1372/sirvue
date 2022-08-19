<template>
  <div class="flex gap-8">
    <div class="w-1/3">
      <Add />
    </div>

    <List class="flex-grow" />
  </div>
</template>

<script>
import List from "../../views/admin/unauthPlaces/List.vue";
import Add from "../../views/admin/unauthPlaces/Add.vue";
export default {
  components: { List, Add },
};
</script>

<style>
</style>