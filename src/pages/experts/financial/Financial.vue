<template>
  <div class="flex gap-8">
    <div class="w-1/3">
      <Details />
    </div>
    <div class="flex flex-grow">
      <Card class="w-full">
        <template #content>
          <TabMenu :model="items" />
          <router-view />
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import Details from "../../../views/experts/financial/Details.vue";
export default {
  components: { Details },
  data() {
    return {
      items: [
        {
          label: "در انتظار بررسی",
          icon: "pi pi-fw pi-home",
          to: "pending",
        },
        {
          label: "معلق شده",
          icon: "pi pi-fw pi-calendar",
          to: "suspended",
        },
        {
          label: "رد شده",
          icon: "pi pi-fw pi-pencil",
          to: "reject",
        },
        {
          label: "پرداخت شده",
          icon: "pi pi-fw pi-file",
          to: "paid",
        },
      ],
    };
  },
};
</script>

<style>
</style>