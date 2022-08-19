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
          label: "در انتطار تایید",
          icon: "pi pi-fw pi-home",
          to: "pending",
        },
        {
          label: "درخواست آنی",
          icon: "pi pi-fw pi-home",
          to: "request",
        },
        {
          label: "در انتظار انجام",
          icon: "pi pi-fw pi-calendar",
          to: "task",
        },
        {
          label: "انجام شده",
          icon: "pi pi-fw pi-pencil",
          to: "done",
        },
        {
          label: "رد شده",
          icon: "pi pi-fw pi-file",
          to: "reject",
        },
        {
          label: "گذشته",
          icon: "pi pi-fw pi-file",
          to: "past",
        },
      ],
    };
  },
};
</script>

<style>
</style>