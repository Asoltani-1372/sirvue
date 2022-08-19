<template>
  <Card>
    <template #content>
      <div class="flex items-center relative">
        <TabMenu :model="items" class="w-full" />
        <div class="flex justify-end absolute left-0"></div>
      </div>
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
          label: "درخواست های جدید",
          to: "request",
        },
        {
          label: "تخصیص یافته",
          to: "allocated",
        },
        {
          label: "گذشته",
          to: "history",
        },
      ],
    };
  },
  mounted() {
    const role = this.$route.path.split("/")[1];
    if (role == "flight") {
      this.items[0].label = "درخواست‌های مجوز"
      this.items[1].label = "عملیات جاری";
      
    }
  },
};
</script>

<style>
</style>