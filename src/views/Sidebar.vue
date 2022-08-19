<template>
  <nav class="sidebar" :class="[extend ? 'w-56' : 'w-20']">
    <div class="nav-logo pt-4">
      <img src="../assets/logo.webp" alt="logo" width="65" height="60" />
    </div>
    <div class="flex-grow border-l z-0">
      <PanelMenu
        :model="menu"
        :class="[extend ? 'menu-extend' : 'menu-collapse']"
        class="text-sm"
        ref="panelMenu"
        @click="extend = true"
      />
    </div>
    <label class="collapse">
      <input type="checkbox" v-model="extend" class="hidden" />
      <i
        class="pi pi-angle-double-left transform transition-transform"
        :class="[extend ? 'rotate-180' : 'rotate-0']"
      ></i>
      <p :class="[extend ? 'opacity-100 ' : 'opacity-0 w-0 hidden']">
        جمع کردن
      </p>
    </label>
  </nav>
</template>

<script>
export default {
  props: ["menu"],
  data() {
    return {
      menuService: null,
      extend: false,
      extendable: false,
      expandedKeys: {},
    };
  },
  methods: {
    createTooltip(text) {
      var tooltip = document.createElement("div");
      tooltip.innerText = text;
      tooltip.className = "p-tooltip p-component p-tooltip-left";
      tooltip.innerHTML =
        '<div class="p-tooltip-arrow"></div><div class="p-tooltip-text">' +
        text +
        "</div";
      return tooltip;
    },
  },
  mounted() {
    let panelMenus = this.$refs.panelMenu.$el;
    let childIndex = 0;
    panelMenus.childNodes.forEach((element, index) => {
      if (element.tagName == "DIV") {
        const tooltip = this.createTooltip(this.items[childIndex].label);
        this.$refs.panelMenu.$el.childNodes[index].appendChild(tooltip);
        childIndex++;
      }
    });
    
  },
  watch: {
    extend(v) {
      if (!v) {
        this.$refs.panelMenu.activeItem = null;
      } else {
        if (!this.extendable) {
          this.extend = false;
        }
      }
    },
    menu(v) {
      this.extendable = v.length > 0;
      this.extend = v.length > 0;
    },
  },
};
</script>

<style scoped>
.sidebar {
  @apply transition-all duration-300 z-50 hidden lg:flex flex-col;
}

nav {
  @apply h-full bg-white;
}

.nav-logo {
  @apply w-full h-16 bg-white pb-5 sticky flex items-center justify-around border-b shadow-sm z-0;
}

.nav-logo > img {
  @apply flex justify-center items-center;
}

.collapse {
  min-height: 3.8rem;
  @apply py-4 pl-4 pr-5 cursor-pointer mt-auto flex items-center overflow-hidden border-t justify-center gap-1;
}

.angle-icon {
  @apply pl-1 duration-500 text-lg;
}

.collapse:hover {
  background-color: #f4f4f5;
}

.collapse > p {
  @apply whitespace-nowrap transition-all duration-300;
}
</style>

<style>
.p-panelmenu-panel {
  @apply relative;
}
.menu-collapse > .p-panelmenu-panel:hover > .p-tooltip {
  @apply block !important;
}
.menu-collapse > .p-panelmenu-panel > .p-tooltip {
  @apply top-0  mr-20 z-50 text-center cursor-pointer;
}

.menu-collapse > .p-panelmenu-panel > .p-tooltip > div:last-child {
  @apply whitespace-nowrap;
}
.menu-extend .collapse {
  /* @apply bg-red-500; */
}

.menu-collapse .collapse > p {
  /* @apply hidden !important; */
}

.menu-extend .p-menuitem-text {
  @apply whitespace-nowrap transition-opacity delay-75 duration-300 opacity-100;
}
.menu-collapse .p-menuitem-text {
  @apply whitespace-nowrap transition-opacity duration-300 opacity-0;
}

.menu-extend .p-panelmenu-header .pi-chevron-right:before {
  content: "\e900" !important;
  @apply whitespace-nowrap transition-opacity duration-300 opacity-100;
}

.menu-collapse .p-panelmenu-header .pi-chevron-right:before {
  content: "\e900" !important;
  @apply whitespace-nowrap transition-opacity duration-300 opacity-0;
}

.menu-extend .p-menuitem-icon {
  @apply text-lg transition-all duration-500;
}

.menu-collapse .p-menuitem-icon {
  @apply text-lg transition-all  duration-500 mr-2.5 ml-0 !important;
}

.p-panelmenu-header .pi-chevron-right:before {
  content: "\e900" !important;
}

.p-panelmenu .p-panelmenu-header > a .p-panelmenu-icon {
  margin-right: 0.5 rem;
  @apply absolute left-3;
}

.p-toggleable-content .pi-angle-right:before {
  content: "\e931" !important;
}

.p-panelmenu-header > a {
  @apply bg-white !important;
}

.p-panelmenu .p-panelmenu-header > a {
  border: none !important;
  padding: 15px 20px 15px 15px !important;
  margin-top: 8px !important;
  margin-bottom: 8px !important;
}

.p-panelmenu
  .p-panelmenu-content
  .p-submenu-list:not(.p-panelmenu-root-submenu) {
  padding: 0 1rem 0 0 !important;
}

.p-panelmenu .p-panelmenu-header > a:hover {
  background: #f4f4f5 !important;
}

.p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link:focus {
  box-shadow: inset 0 0 0 0 !important;
}

.p-panelmenu .p-panelmenu-content {
  border-bottom: 1px solid #f4f4f5 !important;
  border-left: none !important;
}

.p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link {
  @apply relative;
}

.p-panelmenu
  .p-panelmenu-content
  .p-menuitem
  .p-menuitem-link
  .p-panelmenu-icon {
  margin-right: 0.5 rem;
  @apply absolute left-3;
}

.p-panelmenu .p-panelmenu-panel:first-child .p-panelmenu-header > a {
  border-top-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
}

.p-panelmenu .p-panelmenu-panel:last-child .p-panelmenu-header > a {
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.p-panelmenu .p-panelmenu-header > a:focus {
  outline: none;
  outline-offset: 0;
  box-shadow: 0 0 0 0 !important;
}

.p-panelmenu-panel .p-panelmenu-icon {
  @apply ml-2;
}

.router-link-active-exact {
  @apply text-yellow-400 !important;
  
}
</style>