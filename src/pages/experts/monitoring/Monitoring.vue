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
          label: "خدمت‌های جاری",
          to: "requests",
        },
        {
          label: "خدمت‌های گذشته",
          to: "histories",
        },
      ],
    };
  },
};
</script>

<style>
</style>