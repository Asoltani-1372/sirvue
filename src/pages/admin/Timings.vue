<template>
  <div class="timing">
    <TimingsList class="flex-grow"/>
  </div>
</template>

<script>
import TimingsList from "../../views/admin/timings/TimingsList.vue";
export default {
  components: { TimingsList },
};
</script>

<style scoped>
.timing {
  @apply flex gap-8 m-auto h-full items-start ;
}
</style>