<template>
  <div class="w-full">
    <Message severity="warn" v-if="message" @click="messageClick(message.route)" >
      <div class="flex items-center gap-3">
        <span class="whitespace-normal text-sm">{{ message.content }}</span>
        <Button
          class="p-button p-button-text p-button-sm hidden lg:block"
          @click="messageClick(message.route)"
          :label="message.label"
        />
      </div>
    </Message>
    <Card>
      <template #content>
        <div class="w-full relative">
          <TabMenu
            :model="items"
            class="
              absolute
              left-0
              right-0
              text-xs
              lg:text-base
              whitespace-nowrap
            "
          />
        </div>
        <router-view class="mt-16" @call="message = $event" />
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
          label: "درخواست های عمومی",
          icon: "pi pi-fw pi-home",
          to: "published",
        },
        {
          label: "درخواست ها",
          icon: "pi pi-fw pi-home",
          to: "new",
        },
        {
          label: "در انتظار انجام",
          icon: "pi pi-fw pi-calendar",
          to: "doing",
        },
        {
          label: "گذشته",
          icon: "pi pi-fw pi-file",
          to: "history",
        },
      ],
      message: null,
    };
  },
  methods: {
    messageClick(route) {
      this.$router.push(route);
      this.message = null;
    },
  },
};
</script>

<style>
</style>