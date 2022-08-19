<template>
  <div class="flex gap-8">
    <Card class="w-full">
      <template #title>
        <div>تاریخچه خدمت</div>
      </template>
      <template #content>
        <TabMenu :model="items" v-model:activeIndex="index"/>
        <current-requests :input="requests" v-if="index == 0" />
        <service-histories :input="histories" v-if="index == 1" />
      </template>
    </Card>
  </div>
</template>

<script>
import CurrentRequests from './CurrentRequests.vue';
import ServiceHistories from './ServiceHistories.vue';
export default {
  components: {CurrentRequests, ServiceHistories  },
  props: ["requests", "histories"],
  data() {
    return {
      index: 0,
      items: [
        { label: "درخواست های جاری ",   },
        { label: "سابقه درخواست",   },
      ],
    };
  },
};
</script>

<style>
</style>