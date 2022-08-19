<template>
  <div
    class="flex text-xs gap-1 justify-end text-gray-400"
    @click="handleClick()"
  >
    <span>{{ timeText }}</span>
    <p class="text-left" :class="{ 'text-blue-700 cursor-pointer': 1 > timer }">
      {{ timer > 0 ? "تا ارسال مجدد" : "ارسال مجدد کد" }}
    </p>
  </div>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      timer: 0,
      timeText: "",
      interval: null,
    };
  },
  methods: {
    start() {
      this.timer = 120;
      this.interval = setInterval(() => {
        this.timer--;
        this.timeText = Math.floor(this.timer / 60) + ":" + (this.timer % 60);
        if (this.timer < 1) {
          this.stop();
        }
      }, 1000);
    },
    stop() {
      clearInterval(this.interval);
      this.timeText = "";
    },
    handleClick() {
      if (this.timer < 1) {
        this.$emit("call", "");
        this.start();
      }
    },
  },
  mounted() {
    this.start();
  },
};
</script>

<style scoped>
</style>