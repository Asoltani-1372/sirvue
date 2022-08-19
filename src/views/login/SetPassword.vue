<template>
  <div class="set-password">
    <p class="text-center mb-12">لطفاً یک رمزعبور جدید وارد نمایید.</p>
    <div class="p-field p-col-12 p-md-4">
      <span class="p-float-label">
        <Password
          v-model="password"
          tabindex="0"
          class="password"
          inputClass="w-full px-0"
          :class="{ 'p-invalid': error }"
          toggleMask
          promptLabel="یک رمز عبور وارد نمایید"
          weakLabel="ضعیف"
          strongLabel="قوی"
          mediumLabel="متوسط"
          :feedback="false"
          ref="password"
          @keypress.enter="nextFocus()"
        />
        <label class="right-2"> رمز عبور (حداقل ۸ حرف)</label>
      </span>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
    <div class="p-field p-col-12 p-md-4 mt-5">
      <span class="p-float-label">
        <Password
          v-model="repassword"
          tabindex="1"
          class="password"
          ref="repassword"
          inputClass="w-full px-0"
          :class="{ 'p-invalid': error2 }"
          :feedback="false"
          toggleMask
          @keypress.enter="handleClick()"
        />
        <label class="right-2">تکرار رمزعبور</label>
      </span>
      <p v-if="error2" class="error-text">{{ error2 }}</p>
    </div>
    <Button
      class="p-button-success"
      label="ورود"
      :loading="loading"
      @click="handleClick()"
      :disabled="this.password.length < 8 || this.password != this.repassword"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      repassword: "",
      error: "",
      error2: "",
      loading: false,
    };
  },
  methods: {
    handleClick() {
      setTimeout(() => {
        this.$refs["password"].$el.focus();
      }, 300);

      if (!this.password || this.password.length < 8) {
        this.error = "رمزعبور باید حداقل 8 کاراکتر باشد";
      } else if (this.password != this.repassword) {
        this.error2 = "رمزعبور و تکرار ان یکسان نیست";
      } else {
        this.loading = true;
        setTimeout(() => {
          this.$emit("call", this.password);
        }, 300);
      }
    },
    nextFocus() {
      this.$refs.repassword.children[0].focus();
    },
  },
  watch: {
    password(v) {
      if (v) {
        this.error = "";
      } else {
        this.error = "رمزعبور نمیتواند خالی باشد";
      }
    },
    repassword(v) {
      if (v) {
        this.error2 = "";
      } else {
        this.error2 = "تکرار رمزعبور نمیتواند خالی باشد";
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
.set-password {
  @apply flex flex-col gap-3;
}
.password {
  @apply w-full flex flex-row-reverse;
}
</style>