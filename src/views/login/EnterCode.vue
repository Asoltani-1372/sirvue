<template>
  <div class="flex justify-center">
    <div class="flex flex-col max-w-min gap-3 items-center">
      <div class="flex gap-2 text-center mb-12">
        <p>کد ارسال شده به شماره</p>
        <p class="underline cursor-pointer" @click="editPhone()">
          <i class="pi pi-pencil text-red-500 ml-1"></i>{{ input }}
        </p>
        <p>را وارد کنید</p>
      </div>
      <div class="code-container" ref="inputs">
        <!-- <InputNumber
          v-for="(n, i) in 6"
          :key="i"
          inputClass="w-12 text-center"
          @keyup="nextFocus(i)"
          @focus="focus(i)"
          v-model="code[i]"
          :disabled="i > 0"
          :class="[
            code[i] != '' ? 'border-blue' : 'border-gray-500',
            invalid ? 'p-invalid' : '',
          ]"
          type="number"
        /> -->

        <InputText
          class="w-full text-center"
          v-model="code"
          :disabled="loading"
          placeholder="کد 6 رقمی را وارد کنید"      
          autofocus
          
        />
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
      <Button
        label="ارسال"
        class="p-button-success w-full"
        @click="handleClick()"
        :loading="loading"
      />
      <code-timer class="self-end" />
    </div>
  </div>
</template>

<script>
import CodeTimer from "./CodeTimer.vue";
export default {
  components: { CodeTimer },
  props: ["input"],
  data() {
    return {
      code: null,
      complete: false,
      loading: false,
      errorMessage: "",
      reSendCodeText: "",
      reSendCodeTextColor: "",
      sentCode: true,
      second: 30,
      error: "",
      invalid: false,
    };
  },
  mounted() {
    //this.$refs["inputs"].children[0].children[0].focus();
  },
  methods: {
    // focus() {
    //   if (this.complete) {
    //     this.complete = false;
    //     this.code = [];
    //     let inputs = this.$refs["inputs"].children;
    //     for (var j = 1; j < 6; j++) {
    //       inputs[j].children[0].value = null;
    //       inputs[j].children[0].disabled = true;
    //     }
    //     setTimeout(() => {
    //       inputs[0].children[0].focus();
    //     }, 100);
    //   }
    // },
    // nextFocus(i) {
    //   let inputs = this.$refs["inputs"].children;
    //   let input = inputs[i].children[0];
    //   let value = input.value;
    //   if (value.length >= 1) {
    //     if (value.length > 1) {
    //       for (let j = 0; j < value.length; j++) {
    //         inputs[i].children[0].value = value[j];
    //         inputs[i].children[0].focus();
    //         inputs[i].children[0].disabled = true;
    //         this.code[i] = value[j];
    //         i++;
    //       }
    //     }
    //     if (i < 5) {
    //       setTimeout(() => {
    //         input.disabled = true;
    //       }, 100);

    //       let nextInput = inputs[i + 1].children[0];
    //       this.code[i + 1] = null;
    //       nextInput.disabled = false;
    //       nextInput.focus();
    //     } else {
    //       input.blur();
    //       this.complete = true;
    //       for (var j = 0; j < 6; j++) {
    //         inputs[j].children[0].disabled = false;
    //       }
    //     }
    //   } else {
    //     if (i > 0) {
    //       let preInput = inputs[i - 1].children[0];
    //       preInput.disabled = false;
    //       this.code[i - 1] = null;
    //       preInput.focus();
    //     }
    //   }
    // },
    editPhone() {
      this.$emit("editPhone", "");
    },
    handleClick() {
      //const code = this.code.join("");
      if (this.code.length < 6) {
        this.error = "کد وارد شده صحیح نمی باشد";
        this.invalid = true;
      } else {
        this.loading = true;
        this.$emit("call", this.code);
      }
    },
  },
  watch: {
    complete(v) {
      console.log(v);
      if (v) {
        this.handleClick();
      }
    },
    code(v){
      if (v && v.length == 6) {
        this.handleClick();
      }
    }
  },
};
</script>

<style scoped>
.code-container {
  @apply flex justify-center gap-4 w-full;
}
</style>