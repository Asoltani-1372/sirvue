<template>
  <div class="w-11/12 m-auto lg:w-full">
    <Card>
      <template #title>
        <div class="flex justify-between items-center">
          <div v-if="input">تسویه حساب</div>
          <Skeleton width="20%" v-else/>
          <Button
            label="درخواست واریز وجه "
            class="p-button-raised p-button-success p-button-sm"
            v-if="input"
          />
          <Skeleton width="40%" height="2.68rem" v-else />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center" v-if="input">
            <div>شناسه</div>
            <div>4324234</div>
          </div>
          <Skeleton v-else/>
          <div class="flex justify-between items-center" v-if="input">
            <div>تاریخ</div>
            <div>1400/09/01</div>
          </div>
          <Skeleton v-else/>
          <div class="flex justify-between items-center" v-if="input">
            <div>مبلغ</div>
            <div>73.000.000</div>
          </div>
          <Skeleton v-else/>
          <div class="flex justify-between items-center" v-if="input">
            <div>وضعیت</div>
            <div>
              <Tag value="دردست بررسی" />
            </div>
          </div>
          <Skeleton v-else />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {};
  },
};
</script>

<style>
</style>