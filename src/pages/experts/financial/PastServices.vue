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
          label: "محاسبه‌های جدید",
          to: "calculating",
        },
        {
          label: "محاسبه شده‌ها ",
          to: "calculated",
        },
        {
          label: "تصفیه شده",
          to: "refined",
        },
      ],
    };
  },
};
</script>

<style>
</style>