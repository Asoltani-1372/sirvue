<template>
  <header>
    <img class="logo" src="../assets/logo.webp" />
    <div class="flex items-center">
      <div class="relative hidden">
        <Button
          icon="pi pi-bell"
          class="p-button-rounded p-button-outlined p-button-sm p-button-plain"
          @click="toggleNotification"
        />
        <Badge
          value="1"
          severity="danger"
          class="-top-3 -right-2 absolute cursor-pointer"
        ></Badge>
        <OverlayPanel ref="notification" class="overflow-hidden w-full">
          <div class="flex flex-col">
            <div class="notification" v-for="i in 4" :key="i">
              <Avatar image="/img/avatar.png" shape="circle" size="large" />
              <div class="w-80">
                <div class="flex justify-between items-center">
                  <div class="font-bold text-lg">عنوان</div>
                  <div class="flex justify-center text-xs">
                    10:30 1400/10/20
                  </div>
                </div>
                <p>لورم ایپسوم متن ساختگی است</p>
              </div>
            </div>
          </div>
        </OverlayPanel>
      </div>
      <Button
        icon="pi pi-sign-out transform rotate-180"
        label="خروج"
        class="p-button-text p-button-danger hidden lg:block"
        @click="logout()"
      />
    </div>
  </header>
</template>

<script>
export default {
  props: ["hiddenLogo"],
  data() {
    return {};
  },
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },

    toggleNotification(event) {
      this.$refs.notification.toggle(event);
    },

    logout() {
      this.$confirm.require({
        message: "آیا از خروج از سامانه اطمینان دارید؟",
        header: "خروج",
        acceptLabel: "خارج شو",
        acceptClass: "p-button-danger p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          if (
            this.$route.path.indexOf("servant/") > 0 ||
            this.$route.path.indexOf("applicant/") > 0
          )
            this.$router.push("/");
          else if (this.$route.path.indexOf("flight/") > 0)
            this.$router.push("/flights");
          else this.$router.push("/management");
        },
        reject: () => {},
      });
    },
  },
  mounted() {
    const roles = {
      applicant: "کشاورز (متقاضی)",
      servant: "پهپاددار (خدمت دهنده)",
      allocator: "کارشناس تخصیص (تخصیص)",
      operator: "مدیر عملیات",
      financial: "کارشناس مالی",
      monitoring: "کارشناس پایش",
      supporter: "پشتیبان",
    };
    try {
      this.role = roles[this.$route.path.split("/")[1]];
    } catch (error) {
      this.role = "کاربر نامشخص";
    }
  },
};
</script>

<style scoped>
header {
  min-height: 4rem;
  @apply w-full h-16 bg-white shadow-sm border-b flex items-center justify-between lg:justify-end px-6 z-10;
}

header > h2 {
  @apply font-bold text-xl lg:hidden;
}

header > div {
  @apply flex gap-3;
}

.p-button-sm {
  @apply w-8 h-8 text-xs !important;
}

.vertical-line {
  @apply border-r-2;
}

.logo {
  @apply flex justify-center items-center max-h-16 lg:hidden mx-auto;
}
</style>
<style>
.p-menuitem-icon {
  @apply m-0 ml-2 !important;
}

.p-overlaypanel-content {
  @apply p-0 !important;
}

.notification {
  @apply flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-200 text-sm;
}
</style>