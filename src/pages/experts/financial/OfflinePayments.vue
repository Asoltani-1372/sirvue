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
          label: "درخواست جدید",
          to: "new",
        },
        {
          label: "تایید شده",
          to: "verified",
        },
        {
          label: "رد شده",
          to: "rejected",
        },
      ],
    };
  },
};
</script>

<style>
</style>