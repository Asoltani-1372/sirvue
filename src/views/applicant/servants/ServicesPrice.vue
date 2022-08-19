<template>
  <Card>
    <template #title>
      <div v-if="input">هزینه خدمات</div>
      <Skeleton width="40%" v-else />
    </template>
    <template #content>
      <div class="flex flex-col gap-3">
        <div
          v-for="service in services"
          :key="service"
          class="flex justify-between items-center"
        >
          <p v-if="service.title">{{ service.title }}</p>
          <Skeleton width="50%" v-else />

          <p v-if="service.price">{{ service.price }} تومان</p>
          <Skeleton width="30%" v-else />
        </div>
      </div>
    </template>
    <template #footer>
      <Button
        label="درخواست خدمت"
        class="p-button-success w-full p-button-sm"
        @click="$emit('call', '')"
        v-if="input"
      />
      <Skeleton width="100%" height="3.125rem" v-else />
    </template>
  </Card>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      services: [{}, {}, {}],
    };
  },
  watch: {
    input(v) {
      if (v) this.services = v;
    },
  },
};
</script>

<style scoped>
.service-price {
}
</style>