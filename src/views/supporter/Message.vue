<template>
  <Card class="w-2/3" :class="{ 'bg-green-50 self-end': input.isUser }">
    <template #title>
      <div class="flex gap-4 items-center">
        <Avatar
          v-if="input.id"
          :image="input.user.avatar"
          shape="circle"
          size="xlarge"
        />
        <Skeleton v-else shape="circle" size="4rem" />
        <div class="flex flex-col gap-2">
          <p v-if="input.id" class="text-lg">{{ input.user.fullname }}</p>
          <Skeleton v-else width="7rem" />
          <p v-if="input.id" class="text-sm font-normal">
            {{ input.user.role }}
          </p>
          <Skeleton v-else width="12rem" height=".7rem" />
        </div>
        <p v-if="input.id" class="text-sm font-normal mr-auto self-start">
          {{ input.date }}
        </p>
        <Skeleton v-else width="5rem" class="mr-auto self-start" />
      </div>
    </template>
    <template #content>
      <p v-if="input.id" class="text-sm">
        {{ input.content }}
      </p>
      <div v-else class="flex flex-col gap-2">
        <Skeleton width="14rem" height=".7rem" />
        <Skeleton width="18rem" height=".7rem" />
        <Skeleton width="24rem" height=".7rem" />
        <Skeleton width="12rem" height=".7rem" />
      </div>
    </template>
    <template #footer>
      <div v-if="input.isUser" class="flex justify-end">
        <Rating
          v-if="input.id"
          :start="5"
          :cancel="false"
          v-model="stars"
          :disabled="true"
        />
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
      this.$emit("call", { stars: v, id: this.input.id });
    },
    "input.stars"(v) {
      this.stars = v;
    },
  },
};
</script>

<style>
</style>