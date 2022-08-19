<template>
  <div class="header-container">
    <logo />
    <h1 class="login-title hidden lg:block">به سیرنگ پلاس خوش آمدید!</h1>
    <h2 class="login-title lg:hidden">سامانه یکپارچه راهبری نو گرا</h2>
     <p class="lg:hidden text-center text-sm leading-8">ارایه خدمات مکانیزاسیون کشاورزی (پهپاد و ماشین آلات)</p>
     <p class="lg:hidden text-center text-sm leading-8">در سراسر ایران با کاربران حرفه‌ای</p>
     
  </div>
</template>

<script>
import Logo from "./Logo.vue";
export default {
  components: { Logo },
  props: ["input"],
};
</script>

<style scoped>
.header-container {
  @apply flex flex-col justify-between items-center border-b pb-4;
}

.login-welcome {
  @apply text-lg text-gray-400 text-center pt-4;
}

.login-title {
  @apply text-xl font-bold text-black text-center pb-4;
}
</style>