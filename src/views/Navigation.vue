<template>
  <div
    class="navigation"
    v-if="menu.length > 0 && $parent.show"
    :style="[extend ? 'height: ' + height + 'rem' : 'height: 4.5rem']"
  >
    <nav>
      <div class="circle" v-if="role == 'applicant'"><div></div></div>
      <div class="menu-grid h-16">
        <button
          v-for="(item, index) in items"
          :key="item"
          class="p-button p-button-rounded"
          :class="[
            $route.path.indexOf(item.to) > -1
              ? 'p-button-info'
              : 'p-button-secondary',
            role == 'applicant' && index == 2
              ? '-mt-8 p-button-success'
              : ' p-button-text',
          ]"
          :style="item.style"
          @click="handleClick(item.to)"
        >
          <i class="pi" :class="item.icon"></i>
          <span
            class="text-xs whitespace-nowrap"
            v-if="role != 'applicant' || index != 2"
            >{{ item.label }}</span
          >
        </button>
      </div>
    </nav>
    <ServiceRequestDialog ref="serviceRequestDialog" class="block lg:hidden" />
  </div>
</template>

<script>
import ServiceRequestDialog from "../views/applicant/serviceRequest/ServiceRequestDialog.vue";
export default {
  components: { ServiceRequestDialog },
  props: ["menu"],
  data() {
    return {
      role: null,
      items: [],
      extend: false,
      height: 4.5,
      screenHeight: 0,
      navHeight: 0,
    };
  },
  methods: {
    handleClick(to) {
      if (to == "more") {
        this.extend = !this.extend;
        this.items[4].icon = this.extend ? "pi-chevron-down" : "pi-chevron-up";
        this.items[4].label = this.extend ? "کمتر" : "بیشتر";
        if (this.extend) {
          this.height = (this.items.length / 5) * 4.5;
        } else this.height = 4.5;
      } else if (to == "/") {
        this.$confirm.require({
          message: "آیا از خروج از سامانه اطمینان دارید؟",
          header: "خروج",
          acceptLabel: "خارج شو",
          acceptClass: "p-button-danger p-button-sm float-left",
          rejectLabel: "بازگشت",
          accept: () => {
            this.$router.push("/");
          },
          reject: () => {},
        });
      } else {
        if (to == "/applicant/serviceRequest/")
          this.$refs.serviceRequestDialog.display = true;
        else {
          this.$router.push(to);
          setTimeout(() => {
            if (this.extend) this.handleClick("more");
          }, 100);
        }
      }
    },
    getDate(date, timespan = 0) {
      return new Date(date[0], date[1] - 1, date[2] + timespan, 0, 0, 0, 0);
    },
  },

  mounted() {
    let self = this;
    window.visualViewport.addEventListener("resize", function (e) {
      try {
        if (this.menu.length > 0) {
          if (self.screenHeight < 1) {
            const margin = document.querySelector(".navigation");
            self.navHeight = margin.offsetHeight;
            self.screenHeight = e.target.height;
            self.$parent.show = false;
          } else if (self.screenHeight < e.target.height) {
            self.screenHeight = e.target.height;
            self.$parent.show = true;
          } else {
            if (self.screenHeight - self.navHeight > e.target.height) {
              if (self.$parent.show) {
                self.$parent.show = false;
              }
            } else {
              if (!self.$parent.show) {
                self.$parent.show = true;
              }
            }
          }
        }
      } catch (error) {
        //
      }
    });
    document
      .getElementsByTagName("main")[0]
      .addEventListener("click", function () {
        if (self.extend) {
          self.handleClick("more");
        }
      });
  },

  watch: {
    menu(v) {
      if (v) {
        this.role = this.$route.path.split("/")[1];
        const moreIndex = this.role == "applicant" ? 3 : 4;
        v.forEach((element, index) => {
          if (moreIndex == 3 && index == 2) {
            this.items.push({
              icon: "pi-plus text-xl",
              to: "/applicant/serviceRequest/",
              label: "درخواست خدمت",
            });
          } else if (index == moreIndex) {
            this.items.push({
              icon: "pi-chevron-up",
              to: "more",
              label: "بیشتر",
            });
          }
          this.items.push(element);
        });

        this.items.push({
          style: "color:red;!important",
          icon: "pi-sign-out rotate-180 transform ",
          to: "/",
          label: "خروج",
        });
      }
    },

    "$route.path"(v) {
      this.$parent.show = v.indexOf("serviceRequest/") < 0;
    },
  },
};
</script>

<style scoped>
.navigation {
  @apply fixed bottom-3 left-2 right-2 bg-white rounded-2xl border shadow z-10 px-4 py-1;
  @apply transition-all duration-300 lg:hidden z-50;
}
nav {
  @apply relative z-0;
}
.menu-grid {
  @apply grid grid-cols-5 gap-1 justify-evenly justify-items-center;
}

.menu-grid > button {
  @apply flex flex-col h-16 gap-2 w-16 items-center justify-center;
}

.circle {
  @apply absolute -top-1 -mt-px bg-transparent mx-auto left-0 right-0 w-20 h-11 overflow-hidden;
}

.circle > div {
  @apply rounded-full shadow-inner w-full h-20 absolute left-0 ring-0 bottom-0;
  @apply border;
  background-color: rgb(246, 248, 251) !important;
}
</style>