<template>
  <Card class="w-11/12 m-auto lg:w-full">
    <template #title>
      <div class="flex justify-between items-center">
        <div v-if="input">کیف پول</div>
        <Skeleton width="20%" v-else />
        <Button
          label="افزایش "
          class="p-button-raised p-button-success p-button-sm"
          icon="pi pi-plus"
          v-if="input"
        />
        <Skeleton width="5.75rem" height="2.68rem"/>
      </div>
    </template>
    <template #content>
      <div>
        <div class="flex justify-between items-center" v-if="input">
          <div class="font-bold">موجودی</div>
          <div class="flex items-center">10.000.000</div>
        </div>
        <Skeleton v-else class="mb-2"/>
        <div class="flex justify-between items-center" v-if="input">
          <div class="font-bold">موجودی معلق</div>
          <div class="flex items-center">10.000.000</div>
        </div>
        <Skeleton v-else/>
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