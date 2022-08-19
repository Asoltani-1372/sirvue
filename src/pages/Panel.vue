<template>
  <div class="panel">
    <Sidebar :menu="menu" :class="[menu.length > 0 ? '' : '-mr-20']" />
    <div :class="[show ? 'pb-16' : 'pb-0']">
      <Header :hidden-logo="menu.length > 0" />
      <main>
        <div class="lg:p-8 md:p-4 box-border">
          <router-view />
        </div>
        <Footer />
      </main>
      <Navigation :menu="menu" />
    </div>
  </div>
</template>

<script>
import Sidebar from "../views/Sidebar.vue";
import Header from "../views/Header.vue";
import Footer from "../views/Footer.vue";
import MenuService from "../service/menu.js";
import Navigation from "../views/Navigation.vue";
import Pusher from "pusher-js";
export default {
  components: { Sidebar, Header, Footer, Navigation },
  data() {
    return {
      menu: [],
      avatar: null,
      show: true,
      notifyPermitted: false,
    };
  },
  created() {
    this.menuService = new MenuService();
    this.menuService.getMenu(
      (data) => {
        this.menu = data.menu;
        this.notification(data.user);
      },
      () => {}
    );
  },
  methods: {
    notification(user) {
      const self = this;
      const pusher = new Pusher("826a05bb26a1c9879145", {
        cluster: "eu",
      });
      const channel = pusher.subscribe(`data-channel-${user}`);
      channel.bind("data-event", function (response) {
        const data = response.data;
        if (self.notifyPermitted) {
          const notification = new Notification("سیرنگ پلاس", {
            body: data.message,
            icon: "/img/logo.png",
          });
          notification.onclick = function (event) {
            console.log(event);
            event.preventDefault();
            if (self.$route.path == data.route) history.back();
            setTimeout(() => {
              self.$router.push(data.route);
            }, 100);
          };
        }
        self.$confirm.require({
          message: data.message,
          header: "اعلان جدید",
          acceptClass: "p-button-success p-button-sm float-left",
          rejectClass: "p-button-text p-button-sm",
          acceptLabel: "مشاهده",
          rejectLabel: "بازگشت",
          position: "top",
          accept: () => {
            if (self.$route.path == data.route) location.reload();
            setTimeout(() => {
              self.$router.push(data.route);
            }, 1000);
          },
          reject: () => {},
        });
      });
    },
  },
  mounted() {
    const self = this;
    this.show = this.$route.path.indexOf("serviceRequest/") < 0;
    if (Notification.permission != "granted") {
      Notification.requestPermission().then(function (result) {
        if (result == "granted") self.notifyPermitted = true;
      });
    }
  },

  watch: {
    "$route.path"(v) {
      this.show = v.indexOf("serviceRequest/") < 0;
    },
  },
};
</script>

<style scoped>
.panel {
  @apply flex w-screen h-screen overflow-x-hidden;
}
.panel > div {
  @apply flex flex-col flex-grow justify-between lg:pb-0;
}

.panel > div > main {
  @apply overflow-auto h-full flex flex-col justify-between flex-grow z-50;
}

#sidebar:checked ~ .sidebar {
  @apply w-16;
}

#sidebar:checked ~ .sidebar > label {
  @apply bg-red-800 !important;
}

main::-webkit-scrollbar {
  @apply lg:w-2;
}

main::-webkit-scrollbar-thumb {
  @apply lg:rounded-full lg:bg-gray-500;
}
</style>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>