<template>
  <div class="flex flex-col px-8 py-2 h-full">
    <div class="my-8">
      <p class="text-center font-bold my-8">
        کد ارسال شده به موبایل را در اینجا وارد نمایید
      </p>
      <div class="flex flex-row-reverse justify-around mt-20" ref="inputs">
        <input
          min="0"
          max="9"
          class="otp-code"
          type="number"
          v-for="(n, i) in 5"
          :key="i"
          @keyup="nextFocus(i)"
          @focus="focus(i)"
          v-model="code[i]"
          :disabled="i > 0"
          :class="[code[i] != '' ? 'border-blue' : 'border-gray-500']"
        />
      </div>
      <p
        class="mt-3 mr-2 font-bold max-w-max"
        :class="[reSendCodeTextColor]"
        @click="reSendCode"
      >
        {{ reSendCodeText }}
      </p>
      <p class="text-red-600 py-5 text-center font-bold">
        {{ errorMessage }}<br />
      </p>
    </div>

    <next-btn @click="nextLevel" :loading="loading" />
  </div>
</template>

<script>
import NextBtn from "./NextBtn.vue";
export default {
  props: ["data"],
  inject: ["userBaseUrl"],
  components: { NextBtn },
  data() {
    return {
      code: ["", "", "", "", ""],
      complete: false,
      loading: false,
      errorMessage: "",
      reSendCodeText: "",
      reSendCodeTextColor: "",
      sentCode: true,
      second: 30,
    };
  },
  methods: {
    reSendCode() {
      if (!this.sentCode) {
        this.sentCode = true;
        this.reSendCodeTextColor = "text-gray-400";
        this.reSendCodeText = "درحال ارسال ...";
        const self = this;

        this.axios
          .get(
            this.userBaseUrl +
              "/user-resend-verify-code?id=" +
              this.data.userId,
            {
              headers: {
                Authorization: "Bearer " + self.data.accessToken,
              },
            }
          )
          .then((response) => {
            console.log(response);
            self.second = 30;
            self.timer();
          })
          .catch(function (error) {
            console.log(error.response);

            self.second = 0;
            self.timer();
          });
      }
    },

    timer() {
      if (this.second > 0) {
        this.reSendCodeText = "ارسال مجدد کد بعد از " + this.second + " ثانیه";
        setTimeout(() => {
          this.second--;
          this.timer();
        }, 1000);
      } else {
        this.reSendCodeText = "ارسال مجدد کد";
        this.reSendCodeTextColor = "text-red-600";
        this.sentCode = false;
      }
    },

    nextLevel() {
      this.errorMessage = "";
      if (!this.loading) {
        const codeJoin = this.code.join("");
        if (codeJoin.length < 5) {
          this.errorMessage = "کد را به درست وارد نمایید";
          this.complete = true;
          this.focus(0);
          const element = this.$refs.inputs;
          element.classList.add("invalid");
          setTimeout(() => {
            element.classList.remove("invalid");
          }, 200);
        } else {
          const self = this;
          this.loading = true;
          const body = {
            code: this.code.join(""),
            phone: this.data.phone,
          };
          const query = Object.keys(body)
            .map(function (k) {
              return encodeURIComponent(k) + "=" + encodeURIComponent(body[k]);
            })
            .join("&");
          this.axios
            .post(this.userBaseUrl + "/smsVerification?" + query, {})
            .then((response) => {
              self.loading = false;
              if (response.data.flag) {
                localStorage.setItem(
                  "accessToken",
                  response.data.data.access_token
                );
                self.$router.push("/");
              }
            })
            .catch(function (error) {
              self.loading = false;
              if (error.response.status == 500) {
                self.code = ["", "", "", "", ""];
                self.errorMessage =
                  error.response.data.error || error.response.data;
              }
            });
        }
      }
    },

    focus(i) {
      if (this.complete) {
        this.complete = false;
        this.code = ["", "", "", "", ""];
        let inputs = this.$refs["inputs"].children;
        inputs[i].blur();
        for (var j = 1; j < 5; j++) {
          inputs[j].disabled = true;
        }
        setTimeout(() => {
          inputs[0].focus();
        }, 100);
      }
    },

    nextFocus(i) {
      let inputs = this.$refs["inputs"].children;
      let input = inputs[i];
      let value = input.value;
      if (value.length >= 1) {
        if (value.length > 1) {
          for (let j = 0; j < value.length; j++) {
            console.log(i);
            inputs[i].focus();
            inputs[i].value;
            inputs[i].disabled = true;
            this.code[i] = value[j];
            i++;
          }
        }
        if (i < 4) {
          input.disabled = true;
          let nextInput = inputs[i + 1];
          this.code[i + 1] = "";
          nextInput.disabled = false;
          nextInput.focus();
        } else {
          input.blur();
          this.complete = true;
          for (var j = 0; j < 5; j++) {
            inputs[j].disabled = false;
          }
        }
      } else {
        if (i > 0) {
          let preInput = inputs[i - 1];
          preInput.disabled = false;
          this.code[i - 1] = "";
          preInput.focus();
        }
      }
    },
  },
  
  created() {
    this.reSendCodeText = "ارسال مجدد کد بعد از 30 ثانیه";
    this.reSendCodeTextColor = "text-gray-400";
    this.second = 30;
    this.timer();
  },
};
</script>

<style>
.otp-code {
  direction: ltr;
  @apply border-2  w-12 h-12 p-4 outline-none text-center appearance-none;
}
.otp-code:focus {
  border-color: #fe724e;
}
</style>