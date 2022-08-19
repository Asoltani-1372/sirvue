<template>
  <div class="landing w-screen h-screen relative overflow-hidden" ref="landing">
    <div class="texture texture-hidden" ref="texture">
      <div>
        <img src="../assets/logo.webp" alt="لوگو سیرنگ" class="logo" />
        <div class="grid grid-cols-2 px-8 justify-items-stretch items-center justify-self-stretch gap-3 w-screen md:w-full">
          <Button
            @click="login('applicant')"
            label="کشاورز"
            class="p-button-success flex-grow whitespace-nowrap p-button-sm"
            :loading="loading.applicant"
          />
          <Button
            label="کاربر پهپاد"
            class="p-button-warning flex-grow whitespace-nowrap p-button-sm"
            @click="login('servant')"
            :loading="loading.servant"
          />
          <Button
            label="شرکت پشتیبان"
            class="p-button-help flex-grow whitespace-nowrap col-span-2 p-button-sm"
            @click="login('company')"
            :loading="loading.company"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false,
      loading: {
        servant: false,
        applicant: false,
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.landing.classList.toggle("bg-show");
      this.$refs.texture.classList.remove("texture-hidden");
      this.$refs.texture.classList.add("texture-show");
    }, 1000);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 900);
  },
  methods: {
    login(role) {
      this.loading[role] = true;
      setTimeout(() => {
        this.$refs.texture.classList.remove("texture-show");
        this.$refs.texture.classList.add("texture-hidden");
        this.$refs.landing.classList.toggle("bg-show");
        setTimeout(() => {
          this.$router.push("/login/" + role);
        }, 100);
      }, 1000);
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 960px) {
  .landing {
    background-image: url("../assets/images/m-bg.webp");
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    @apply bg-opacity-0;
  }

  .texture {
    height: 190vw;
    bottom: -100vw;
    right: -40vw;
    left: -40vw;
    background-position: center;
    @apply rounded-full bg-black bg-opacity-20 backdrop-filter backdrop-blur-3xl absolute;
    @apply border-4 border-black transition-all translate-y-full;
  }
  .texture > div {
    height: 65vw;
    width: 100vw;
    @apply mx-auto flex flex-col items-center justify-around transform duration-1000;
  }
  .texture-show {
    @apply transform translate-y-0;
  }
  .texture-hidden {
    @apply transform translate-y-full;
  }
}
@media screen and (min-width: 960px) {
  .landing {
    background-image: url("../assets/images/d-bg.webp");
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    @apply opacity-0 transition-opacity duration-500;
  }
  .texture {
    width: 190vh;
    right: -120vh;
    bottom: -40vh;
    top: -40vh;
    background-position: center;
    @apply rounded-full bg-black bg-opacity-60 absolute;
    @apply border-4 border-black flex items-center justify-end transform duration-1000 delay-300;
  }
  .texture > div {
    width: 60vh;
    height: 100vh;
    margin-left: 10vh;
    @apply flex flex-col items-center justify-evenly;
  }
  .texture-show {
    @apply transform  translate-x-0;
  }
  .texture-hidden {
    @apply transform translate-x-full;
  }

  .bg-show {
    @apply opacity-100 !important;
  }
}
.logo {
  background: radial-gradient(#ffff5050 -50%, #ffffff01 60%);
  @apply w-1/2 lg:w-80 rounded-full;
}
</style>