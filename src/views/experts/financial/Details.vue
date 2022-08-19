<template>
  <Card>
    <template #title> جزئیات </template>
    <template #content>
      <div class="flex flex-col gap-3">
        <div class="flex justify-between">
          <div>تعداد درخواست درانتظار</div>
          <div>21</div>
        </div>
        <div class="flex justify-between">
          <div>تعداد درخواست معلق شده</div>
          <div>21</div>
        </div>
        <div class="flex justify-between">
          <div>مجموع مبلغ تسویه شده</div>
          <div>930.000.000</div>
        </div>
        <div class="flex justify-between">
          <div>مجموع مبلغ تسویه نشده</div>
          <div>230.000.000</div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
export default {};
</script>

<style>
</style>