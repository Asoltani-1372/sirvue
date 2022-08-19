<template>
  <div class="login-page">
    <div>
      <!-- <SVG /> -->
      <img src="../assets/images/login.webp" alt="" class="w-10/12" >
      <board-description />
      <!-- <div class="px-28 mt-8 slider w-full">
        <Carousel
          dir="ltr"
          :value="comments"
          :numVisible="1"
          :responsiveOptions="responsiveOptions"
          :circular="comments[0].title"
          :autoplayInterval="5000"
        >
          <template #item="slotProps">
            <Card dir="rtl" class="w-full">
              <template #title class="flex justify-center">
                <div class="flex justify-center items-center text-lg font-bold">
                  <p v-if="slotProps.data.title">
                    {{ slotProps.data.title }}
                  </p>
                  <Skeleton width="50%" shape="rectangle" v-else />
                </div>
              </template>
              <template #content>
                <div class="flex justify-start items-center text-md">
                  <p v-if="slotProps.data.content">
                    {{ slotProps.data.content }}
                  </p>
                  <div v-else class="w-full">
                    <Skeleton width=" 100%" shape="rectangle" class="mb-2" />
                    <Skeleton width=" 50%" shape="rectangle" />
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex justify-center items-center text-xs gap-2">
                  <div class="font-bold" v-if="slotProps.data.name">
                    {{ slotProps.data.name }}
                  </div>
                  <Skeleton width="25%" shape="rectangle" v-else />
                  <div v-if="slotProps.data.place">
                    {{ slotProps.data.place }}
                  </div>
                  <Skeleton width="25%" shape="rectangle" v-else />
                </div>
              </template>
            </Card>
          </template>
        </Carousel>
      </div> -->
    </div>

    <div>
      <login-header />
      <div class="slide z-10">
        <transition-group :name="'slide-' + transName" mode="in-out">
          <enter-phone
            v-if="state == 'phone'"
            @call="enterPhone($event)"
            ref="phone"
            :input="phone"
            class="bg-white"
          />
          <enter-password
            v-if="state == 'password'"
            @call="enterPassword($event)"
            @forget="forgetPassword()"
            ref="password"
             class="bg-white"
          />
          <enter-code
            v-if="state == 'code'"
            @call="enterCode($event)"
            @edit-phone="editPhone()"
            ref="code"
            :input="phone"
             class="bg-white"
          />
          <set-password
            v-if="state == 'setPassword'"
            @call="setPassword($event)"
            ref="setPassword"
             class="bg-white"
          />
        </transition-group>
      </div>
      <!-- <copy-right /> -->
      <div class="flex flex-col items-center lg:hidden  mt-80">
        <div
          class="flex justify-center gap-2 text-xs whitespace-nowrap "
        >
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
        </div>
        <div>
          <a
            href="https://uas.cao.ir/"
            class="text-blue-700 text-xs whitespace-nowrap"
            >سامانه ثبت پلاک پهپاد</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//login section
import LoginHeader from "../views/login/LoginHeader.vue";
import EnterPhone from "../views/login/EnterPhone.vue";
import EnterPassword from "../views/login/EnterPassword.vue";
import SetPassword from "../views/login/SetPassword.vue";
import EnterCode from "../views/login/EnterCode.vue";
// import CopyRight from "../views/login/CopyRight.vue";

//board section
import BoardDescription from "../views/login/BoardDescription.vue";
// import SVG from "../views/login/SVG.vue";
import LoginService from "../service/login.js";
export default {
  inject: ["api"],
  components: {
    LoginHeader,
    EnterPhone,
    EnterPassword,
    SetPassword,
    BoardDescription,
    EnterCode,
    
  },
  data() {
    return {
      comments: [{ name: null, title: null, content: null, place: null }],
      transName: "",
      state: "phone",
      phone: "",
      token: "",
      role: null,
      loginService: null,
    };
  },
  created() {
    this.loginService = new LoginService();
  },
  methods: {
    enterPhone(input) {
      this.phone = input.phone;
      const data = {
        phone: this.phone,
        invite: input.invite,
        role: this.role,
      };
      this.loginService.enterPhone(
        data,
        (response) => {
          this.transName = "left";
          this.state = response.state;
          if (response.state == "code") {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "کد تایید ارسال شد",
              life: 3000,
            });
          }
          this.$refs.phone.loading = false;
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
          this.$refs.phone.invalid = true;
          this.$refs.phone.loading = false;
        }
      );
    },
    editPhone() {
      this.transName = "right";
      this.state = "phone";
    },
    enterCode(code) {
      const data = {
        phone: this.phone,
        code,
      };
      this.loginService.verifyCode(
        data,
        (response) => {
          this.transName = "left";
          this.state = "setPassword";
          this.token = response.token;
          localStorage.setItem("token", response.token);
          this.$refs.code.code = null;
          this.$refs.code.loading = false;
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
          this.$refs.code.code = null;
          this.$refs.code.invalid = true;
          this.$refs.code.loading = false;
          this.$refs.code.focus();
        }
      );
    },
    setPassword(password) {
      this.loginService.setPassword(
        { password },
        (data) => {
          this.changeRoute(data.role);
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
          this.$refs.setPassword.loading = false;
        }
      );
    },
    enterPassword(password) {
      const data = { phone: this.phone, password };
      this.loginService.enterPassword(
        data,
        (response) => {
          localStorage.setItem("token", response.token);
          this.changeRoute(response.role);
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
          this.$refs.password.loading = false;
          this.$refs.password.invalid = true;
          this.$refs.password.password = "";
        }
      );
    },
    forgetPassword() {
      const data = {
        phone: this.phone,
        role: this.role,
      };
      this.loginService.forgetPassword(
        data,
        (response) => {
          this.state = response.state;
          if (this.state == "code") {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "کد تایید ارسال شد",
              life: 3000,
            });
          }
          this.$refs.password.loading = false;
          this.$refs.password.foregetClicked = false;
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
          this.$refs.password.invalid = true;
          this.$refs.password.loading = false;
          this.$refs.password.foregetClicked = false;
        }
      );
    },
    changeRoute(role) {
      const hash = this.$route.hash;
      if (role == "servant" && hash) {
        this.$router.push("/" + role + "/requests/published" + hash);
      } else {
        this.$router.push("/" + role + "/");
      }
    },
  },

  mounted() {
    this.role = this.$route.params.role;
    localStorage.removeItem("token");
  },
};
</script>
<style>
.slider .p-carousel-prev {
  @apply hidden;
}
.slider .p-carousel-next {
  @apply hidden;
}
</style>

<style scoped>
.login-page > div:first-child::-webkit-scrollbar {
  @apply w-1;
}

.login-page > div:first-child::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-400;
}

.login-page > div:last-child::-webkit-scrollbar {
  @apply w-1;
}

.login-page > div:last-child::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-400;
}

.login-page {
  @apply h-screen w-full flex items-center justify-center;
}
.login-page > div:first-child {
  @apply h-full overflow-y-auto overflow-x-hidden w-1/2 lg:flex flex-col hidden justify-evenly items-center;
}

.login-page > div:last-child {
  @apply h-screen  overflow-y-auto overflow-x-hidden flex-grow lg:w-1/2 bg-white lg:px-32 px-4 flex flex-col gap-8;
}

.slide {
  /* @apply flex-grow  relative overflow-x-hidden overflow-y-hidden; */
  @apply  relative p-1 lg:pt-12;
}

.slide > div {
  width: 99%;
  @apply absolute;
}

.slide-left-enter-active {
  opacity: 0;
  left: -100% !important;
  transition: all 0.8s;
}

.slide-left-enter-to {
  opacity: 1;
  left: 0 !important;
}

.slide-left-leave-active {
  opacity: 1;
  left: 0 !important;
  transition: all 0.5s;
}

.slide-left-leave-to {
  opacity: 0;
  left: 100% !important;
}

.slide-right-enter-active {
  opacity: 0;
  right: -100% !important;
  transition: all 0.8s;
}

.slide-right-enter-to {
  opacity: 1;
  right: 0 !important;
}

.slide-right-leave-active {
  opacity: 1;
  right: 0 !important;
  transition: all 0.5s;
}

.slide-right-leave-to {
  opacity: 0;
  right: 100% !important;
}
</style>
