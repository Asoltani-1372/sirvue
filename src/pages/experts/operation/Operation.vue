<template>
  <div class="reserveds">
    <Card>
      <template #content>
        <div class="flex items-center relative">
          <TabMenu :model="items" class="w-full" />
        </div>
        <router-view />
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          label: "در انتطار تایید",
          // icon: "pi pi-fw pi-home",
          to: "pending-confirm",
        },
        {
          label: "در انتظار انجام",
          // icon: "pi pi-fw pi-home",
          to: "pending-done",
        },
        {
          label: "گذشته ",
          // icon: "pi pi-fw pi-calendar",
          to: "past",
        },
      ],
    };
  },
};
</script>

<style>
</style>