<template>
  <div class="board-description">
    <div class="description-title">
      <p>سامانه یکپارچه راهبری نو گرا</p>
    </div>
    <div class="text-sm text-gray-500">
      <p>ارایه خدمات مکانیزاسیون کشاورزی (پهپاد و ماشین آلات)</p>
    </div>
    <div class="text-sm text-gray-500">
      <p>در سراسر ایران با کاربران حرفه‌ای</p>
    </div>
    <div>
      <!-- <img src="../../assets/images/client-logos.png" alt="" /> -->
      <div class="flex justify-center gap-2">
        <div>
          <a href="https://www.maj.ir/" class="text-blue-700"
            >وزارت جهاد کشاورزی</a
          >
        </div>
        <div>|</div>
        <div>
          <a href="https://caa.gov.ir/" class="text-blue-700"
            >سازمان هواپیمایی کشوری</a
          >
        </div>
        <div>|</div>
        <div>
          <a href="https://uas.cao.ir/" class="text-blue-700"
            >سامانه ثبت پلاک پهپاد</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.board-description {
  @apply flex flex-col items-center gap-4;
}

.description-title {
  @apply font-bold text-black text-xl;
}

.description-sub {
  @apply text-gray-700 text-base;
}
</style>