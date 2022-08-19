<template>
  <Card class="overflow-hidden ">
    <template #header>
      <img
        src="https://wp.technologyreview.com/wp-content/uploads/2016/07/fotolia88050102subscriptionmonthlym-7.jpg"
        alt=""
        class="object-cover h-32 filter blur z-0"
        v-if="fullname"
      />
      <Skeleton width="100%" height="8rem" v-else />
    </template>
    <template #title>
      <div
        class="flex flex-col gap-1 items-center justify-center pt-5 -m-24 mb-4"
      >
        <Avatar
          :image="avatar"
          shape="circle"
          class="w-24 h-24 z-10"
          v-if="avatar"
        />
        <Skeleton size="6rem" shape="circle" v-else/>

        <p v-if="fullname">{{ fullname }}</p>
        <Skeleton width="15%" v-else />
      </div>
    </template>
    <template #subtitle>
      <div class="flex flex-col items-center">
        <Rating
          :modelValue="stars"
          :readonly="true"
          :stars="5"
          :cancel="false"
          v-if="stars"
        />
        <Skeleton width="30%" v-else class="mb-2" />

        <div class="flex items-center" v-if="place">
          <i class="pi pi-map-marker pl-1"></i>
          <span>{{ place }}</span>
        </div>
        <Skeleton width="35%" v-else />
      </div>
    </template>
    <template #content>
      <div v-if="place">
        <div
          class="flex justify-between mb-3"
          v-for="rate in rates"
          :key="rate"
        >
          <div class="text-sm">{{ rate.title }}</div>
          <ProgressBar
            :value="rate.value"
            class="w-2/4 h-4"
            dir="ltr"
            v-if="rate.value"
          />
        </div>
      </div>
      <div v-else>
        <Skeleton width="100%" class="mb-4" />
        <Skeleton width="100%" class="mb-4" />
        <Skeleton width="100%" />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center" v-if="serviceCount">
        <span class="pl-1">{{ serviceCount }}</span>
        <span> خدمت انجام شده</span>
      </div>
      <div class="flex justify-center" v-else>
        <Skeleton width="35%" />
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      value: 50,
      avatar: null,
      fullname: null,
      stars: null,
      place: null,
      rates: null,
      serviceCount: null,
    };
  },
  watch: {
    input(v) {
      if (v) {
        this.avatar = v.avatar;
        this.fullname = v.fullname;
        this.stars = v.stars;
        this.place = v.place;
        this.rates = v.rates;
        this.serviceCount = v.serviceCount;
      }
    },
  },
};
</script>

<style scoped>
.p-card-title > p {
  @apply text-center;
}
</style>
<style>
.p-progressbar-label {
  @apply text-xs !important;
}
</style>