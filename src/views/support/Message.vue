<template>
  <Card class="message" :class="{ 'bg-green-50 self-end': input.isUser }">
    <template #title>
      <div class="flex gap-4 items-center">
        <Avatar
          v-if="input.id"
          :image="input.user.avatar"
          shape="circle"
          size="large"
        />
        <Skeleton v-else shape="circle" size="3rem" />
        <div class="flex flex-col gap-2">
          <p v-if="input.id" class="text-sm lg:text-lg">{{ input.user.fullname }}</p>
          <Skeleton v-else  width="5rem" />
          <p v-if="input.id" class="text-xs lg:text-sm font-normal">{{ input.user.role }}</p>
          <Skeleton v-else  width="7rem" height=".7rem" />
        </div>
        <p v-if="input.id" class="text-xs lg:text-sm font-normal mr-auto self-start mt-4">
          {{ input.date }}
        </p>
        <Skeleton v-else  width="3rem" class="mr-auto self-start" />
      </div>
    </template>
    <template #content>
      <p v-if="input.id" class="text-sm">
        {{ input.content }}
      </p>
      <div v-else class="flex flex-col gap-2">
        <Skeleton width="7rem" height=".7rem" />
        <Skeleton width="9rem" height=".7rem" />
        <Skeleton width="12rem" height=".7rem" />
        <Skeleton width="6rem" height=".7rem" />
      </div>
    </template>
    <template #footer>
      <div v-if="!input.isUser" class="flex justify-end">
        <Rating v-if="input.id" :start="5" :cancel="false" v-model="stars" :disabled="!input.setStars" />
        <Skeleton v-else width="8rem" class="mr-auto" />
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      stars: this.input.stars,
    };
  },
  watch: {
    stars(v) {
      this.$emit("call", { stars: v, message: this.input.id });
    },
   
  },
};
</script>

<style>
.message{
  @apply w-full lg:w-2/3;
}
.message .p-card-title{
  background: transparent;
}
</style>