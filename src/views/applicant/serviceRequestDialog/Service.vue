<template>
  <div class="service-cards">
    <div
      v-for="service in parent.services"
      :key="service"
      @click="select(service)"
      :class="{
        'border-blue-600 bg-blue-50': parent.service == service,
      }"
    >
      <Skeleton width="6rem" height="6rem" v-if="fetching" />
      <img v-else :src="service.image" class="rounded w-24 h-24 object-cover" />
      <div class="flex flex-col gap-2 items-center flex-grow">
        <Skeleton width="5rem" v-if="fetching" />
        <p v-else class="font-bold">{{ service.title }}</p>
        <Skeleton width="10rem" v-if="fetching" />
        <!-- <p v-else class="text-xs">قیمت پایه {{ service.price }} تومان</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parent: null,
      fetching: true,
    };
  },
  methods: {
    select(service) {
      if (!this.fetching) {
        this.parent.service = service;
      }
    },
  },
  created() {
    this.parent = this.$parent.$parent.$parent;
  },

  watch: {
    "parent.services"(v) {
      if (v.length > 0 && "id" in v[0]) {
        this.fetching = false;
      }
    },
  },
};
</script>

<style scoped>
.service-cards {
  @apply w-full grid grid-cols-2 gap-4 items-center justify-around;
}

.service-cards > div {
  @apply flex flex-col items-center w-full cursor-pointer rounded-md  border p-4;
}
</style>