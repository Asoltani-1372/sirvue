<template>
  <div class="reserveds">
    <Card>
      <template #content>
        <div class="flex items-center relative">
          <TabMenu :model="items" class="w-full" />
          <div class="flex justify-end absolute left-0">
            <span class="p-input-icon-right">
              <InputText placeholder="جسنجو ..." class="w-72 p-inputtext-sm" />
              <i class="pi pi-search" />
            </span>
          </div>
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
          label: "در انتطار بررسی",
          icon: "pi pi-fw pi-home",
          to: "pending",
        },
        {
          label: "تایید شده",
          icon: "pi pi-check",
          to: "confirmed",
        },
        {
          label: "رد شده",
          icon: "pi pi-times",
          to: "reject",
        },
      ],
    };
  },
};
</script>

<style>
</style>