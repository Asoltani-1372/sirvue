<template>
  <div class="flex flex-col w-full gap-4 text-sm">
    <img class="service-img" :src="parent.service.image" />
    <div class="flex flex-col gap-4 h-full w-full">
      <div
        class="flex item-center justify-between w-full items-center gap-4"
        v-for="item in infos"
        :key="item"
      >
        <p class="text-left">{{ item.title }}</p>
        <p class="h-px bg-gray-200 flex-grow"></p>
        <p class="text-right font-bold">{{ item.value }}</p>
      </div>
    </div>
    <div class="price-card">
      <p class="font-bold text-lg">هزینه خدمت</p>
      <p v-if="parent.price" class="text-lg text-green-700">
        {{ parent.price }} تومان
      </p>
      <p v-else class="text-lg text-red-700">درحال محاسیه ...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parent: null,
      infos: [],
      items: {
        service: "نوع خدمت",
        date: "تاریخ",
        address: "نشانی زمین",
        area: "مساحت زمین",
        terrain: "نوع زمین",
        product: "نوع محصول",
        poisonType: "نوع سم",
        poison: "نام سم",
      },
      price: 0,
      loading: false,
    };
  },
  methods: {
    initial(v) {
      this.infos = [];
      let items = Object.entries(this.items);
      items.forEach((item) => {
        let info = { title: item[1] };
        if (item[0] in v && v[item[0]]) {
          if (item[0] == "address") {
            info.value = "";
            v.address.forEach((element) => {
              if (element.title) {
                if (info.value.length > 0) {
                  info.value = " , ";
                }
                info.value = element.title.replace("کشور", "") + " ( " + v.elevation + " متر)";
              }
            });
          } else if (item[0] == "date") {
            info.value =
              v.date.getFullYear() +
              "/" +
              (v.date.getMonth() + 1) +
              "/" +
              v.date.getDate();
          } else if (item[0] == "area") {
            info.value = v.area + " هکتار";
          } else {
            info.value = v[item[0]].title;
          }
          this.infos.push(info);
        }
      });
    },
  },
  watch: {
    "parent.$data": {
      handler(v) {
        if (v.steps[v.current] == "confirm") {
          this.initial(v);
          this.loading = false;
        }
      },
      deep: true,
    },
  },
  created() {
    this.parent = this.$parent.$parent.$parent;
    if (this.parent.service) {
      this.initial(this.parent);
    }
  },
};
</script>

<style scoped>
.price-card {
  @apply flex flex-col gap-2 items-center justify-center my-4 rounded max-w-min mx-auto;
  @apply border-2 border-green-500 py-2 px-12 bg-gray-50 shadow-inner;
}
.service-img {
  @apply rounded  w-1/2 opacity-30 absolute -top-1/4 bottom-0 left-0 right-0 m-auto;
}
</style>