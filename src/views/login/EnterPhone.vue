<template>
  <div class="enter-phone">
    <p class="text-center mb-12">لطفاً شماره موبایل خود را وارد نمایید.</p>
    <div class="p-field p-col-12 p-md-4">
      <span class="p-float-label">
        <InputMask
          mask="9999 999 9999"
          placeholder="09-- --- ----"
          v-model="value"
          class="w-full appearance-none"
          dir="ltr"
          :class="{ 'p-invalid': invalid }"
          slotChar="-"
          autofocus
          :autoClear="false"
          @click="focusScroll($event)"
          autocomplete="on"
        />
        <label class="right-2">شماره موبایل</label>
      </span>
    </div>
    <div
      v-if="
        $route.path.split('/')[2] == 'servant' ||
        $route.path.split('/')[2] == 'applicant'
      "
      class="hidden"
    >
      <span class="p-float-label">
        <InputText type="text" v-model="invite" class="w-full" />
        <label>کد معرف</label>
      </span>
    </div>
    <div class="flex gap-4 w-full flex-col lg:flex-row">
      <Button
        label="ادامه"
        class="p-button-success lg:w-2/3 w-full"
        @click="handleClick($event)"
        :loading="loading"
        :disabled="disabledBtn"
      />
      <Button
        label="راهنمای استفاده"
        class="p-button-warning lg:w-1/3 w-full"
        @click="openGuide()"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      value: this.input,
      invite: null,
      error: "",
      invalid: false,
      loading: false,
      disabledBtn: true,
    };
  },
  watch: {
    value(v) {
      if (v) {
        const phone = v.replaceAll(" ", "").replaceAll("-", "");
        this.disabledBtn = phone.length < 11;
      }
    },
  },
  methods: {
    openGuide() {
      window.open("https://pahpad.sirangplus.ir/sirang/guide", "_blank");
    },
    handleKey() {
      const phone = this.value.replaceAll(" ", "").replaceAll("-", "");
      if (phone.length > 10) {
        this.handleClick();
      }
    },
    handleClick() {
      const phone = this.value.replaceAll(" ", "").replaceAll("-", "");
      const data = { phone: phone, invite: this.invite };

      this.loading = true;
      setTimeout(() => {
        this.$emit("call", data);
      }, 300);
    },
    focusScroll(event) {
      let count = 0;
      for (let i = 0; i < this.value.length; i++) {
        if (!isNaN(parseInt(this.value.charAt(i)))) {
          count++;
          if (this.value.charAt(i - 1) == " ") count++;
        }
      }
      setTimeout(() => {
        event.target.setSelectionRange(count, count);
      }, 1);
    },
    focus() {
      setTimeout(() => {
        try {
          this.$refs.phone.$el.focus();
        } catch (error) {
          this.focus();
        }
      }, 1000);
    },
  },
  mounted() {
    this.focus();
  },
};
</script>

<style scoped>
.enter-phone {
  @apply flex flex-col gap-6;
}
</style>