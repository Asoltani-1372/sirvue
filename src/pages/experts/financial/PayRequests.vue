<template>
  <Card class="w-full">
    <template #content>
      <TabMenu :model="items" />
      <router-view />
    </template>
  </Card>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          label: "درخواست تسویه",
          to: "new",
        },
        {
          label: "در انتظار تسویه",
          to: "awaiting",
        },
        {
          label: "تسویه شده",
          to: "cleared",
        },
      ],
    };
  },
};
</script>

<style>
</style>