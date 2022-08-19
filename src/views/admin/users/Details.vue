<template>
  <Card>
    <template #title>
      <div v-if="input">
        جزئیات

        {{ input.title }}
      </div>
      <Skeleton width="5rem" v-else />
    </template>
    <template #content>
      <div class="flex flex-col gap-3" v-if="input">
        <div
          v-for="(item, index) in input"
          :key="index"
          class="flex justify-between"
        >
          <div>
            {{ item.title }}
          </div>
          <div>
            {{ item.count }}
          </div>
        </div>
      </div>
      <div v-else>
        <Skeleton width="100%" class="mb-6" />
        <Skeleton width="100%" />
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  props: ["input"],
};
</script>

<style>
</style>