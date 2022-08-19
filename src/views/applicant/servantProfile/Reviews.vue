<template>
  <Card class="servant-review" v-if="!input || input.length > 0">
    <template #title>
      <div v-if="input">نظرات مشتریان</div>
      <Skeleton width="30%" height="1.3rem" v-else />
    </template>
    <template #content>
      <div class="flex flex-col gap-8">
        <div v-for="review in reviews" :key="review">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center">
              <Avatar
                image="https://primefaces.org/primevue/showcase/demo/images/avatar/amyelsner.png"
                shape="circle"
                class="z-20"
              />
              <p class="text-sm mr-2" v-if="input">
                {{ review.fullname }}
              </p>
              <Skeleton v-else />
            </div>
            <Rating
              :modelValue="review.stars"
              :readonly="true"
              :stars="5"
              :cancel="false"
              dir="ltr"
            />
          </div>
          <div class="">
            <p v-if="input">
              {{ review.comment }}
            </p>
            <Skeleton v-else />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <Paginator
        :rows="10"
        :totalRecords="totalItemsCount"
        v-if="input"
      ></Paginator>
      
        <Skeleton width="100%" height="3rem"  v-else/>
      
    </template>
  </Card>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      reviews: [],
    };
  },
  watch: {
    input(v) {
      if (v) {
        this.reviews = v;
      }
    },
  },
};
</script>

<style >
.servant-review {
  @apply mb-8;
}

.servant-review .p-rating-icon {
  @apply text-sm !important;
}
</style>