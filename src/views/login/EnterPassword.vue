<template>
  <div class="enter-password">
    <p class="text-center mb-12">لطفاً رمزعبور خود را وارد نمایید.</p>
    <div class="p-field p-col-12 p-md-4">
      <span class="p-float-label">
        <Password
          v-model="password"
          class="password"
          ref="password"
          inputClass="w-full px-0"
          :feedback="false"
          :class="{ 'p-invalid': invalid }"
          toggleMask
          @keypress.enter="handleClick()"
        />
        <label class="right-2">رمزعبور</label>
      </span>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
    <Button
      class="p-button-success"
      label="ورود"
      :loading="loading"
      @click="handleClick()"
      :disabled="this.password.length < 8"
    />
    <Button
      class="p-button-text p-button-sm self-end"
      label="فراموشی رمزعبور؟"
      :loading="foregetClicked"
      @click="forgetPassword()"
    />
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      error: "",
      loading: false,
      invalid: false,
      foregetClicked: false,
    };
  },
  watch: {
    password(v) {
      if (v) {
        this.error = "";
        this.invalid = false;
      } else if (!this.invalid) {
        this.error = "رمزعبور نمیتواند خالی باشد";
        this.invalid = true;
      } else {
        setTimeout(() => {
          this.$refs.password.$el.children[0].focus();
        }, 500);
      }
    },
  },
  methods: {
    handleClick() {
      this.loading = true;
      setTimeout(() => {
        this.$emit("call", this.password);
      }, 300);
    },
    forgetPassword() {
      if (!this.foregetClicked) {
        this.foregetClicked = true;
        setTimeout(() => {
          this.$emit("forget", "");
        }, 300);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.password.$el.children[0].focus();
    }, 1000);
  },
};
</script>

<style scoped>
.enter-password {
  @apply flex flex-col gap-3;
}
.password {
  @apply w-full flex flex-row-reverse;
}
</style>
<style>
</style>