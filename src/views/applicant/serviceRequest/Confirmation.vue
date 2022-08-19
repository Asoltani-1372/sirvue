<template>
  <Card>
    <template #title> تایید اطلاعات </template>
    <template #content>
      <div class="lg:flex">
        <div class="flex flex-col gap-4 lg:p-8 h-full lg:w-2/3">
          <div
            class="flex item-center gap-20"
            v-for="item in infos"
            :key="item"
          >
            <p class="text-left w-32">{{ item.title }}</p>
            <p class="text-right font-bold">{{ item.value }}</p>
          </div>
        </div>
        <div
          class="
            flex flex-col
            gap-12
            justify-start
            items-center
            w-full
            lg:w-1/3
          "
        >
          <img
            class="rounded w-1/2 opacity-75"
            :src="formData.service.image"
            alt=""
          />
          <div class="flex flex-col gap-4 items-center">
            <p class="font-bold text-xl">هزینه خدمت</p>
            <div
              class="p-inputgroup mt-4"
              dir="ltr"
              v-if="formData.price && $route.path.split('/')[1] == 'allocator'"
            >
              <span class="p-inputgroup-addon border-l border-r-0">تومان</span>
              <InputNumber
                v-model="price"
                class="p-inputtext-sm w-auto"
                placeholder="هزینه خدمت"
              />
            </div>
            <p
              v-if="formData.price && $route.path.split('/')[1] != 'allocator'"
              class="text-lg text-green-700"
            >
              {{ formData.price }} تومان
            </p>
            <p class="text-lg text-red-700" v-if="!formData.price">
              درحال محاسیه ...
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Button
          label="ویرایش"
          icon="pi pi-pencil"
          class="p-button-text p-button-sm"
          @click="edit()"
          :disabled="formData.loading"
        />
        <Button
          label="ثبت نهایی"
          icon="pi pi-check"
          class="p-button-sm p-button-success"
          iconPos="left"
          @click="complete()"
          :loading="formData.loading"
          :disabled="!formData.price"
        />
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  props: ["formData"],
  data() {
    return {
      infos: [],
      items: {
        service: "نوع خدمت",
        date: "تاریخ",
        terrain: "نوع زمین",
        area: "مساحت زمین",
        product: "نوع محصول",
        poisonType: "نوع سم",
        poison: "نام سم",
        address: "نشانی زمین",
        applicant: "کشاورز",
      },
      price: 0,
      loading: false,
    };
  },
  created() {
    const route = this.$route.path.split("/")[1];
    if (route == "applicant") {
      delete this.items.applicant;
      delete this.items.servant;
    }
  },
  methods: {
    initial(v) {
      let price = v.price + "";
      price = price.replaceAll(",", "");
      this.price = parseInt(price);
      this.infos = [];
      let items = Object.entries(this.items);
      items.forEach((item) => {
        let info = { title: item[1] };
        if (item[0] in v) {
          if (item[0] == "address") {
            info.value = "";
            v.address.forEach((element) => {
              if (element.title) {
                if (info.value.length > 0) {
                  info.value = " , ";
                }
                info.value =
                  element.title.replace("کشور", "") +
                  " ( " +
                  v.elevation +
                  " متر)";
              }
            });
          } else if (item[0] == "date") {
            info.value = v.date;
          } else if (item[0] == "area") {
            info.value = v.area + " هکتار";
          } else if (item[0] == "applicant") {
            if (v[item[0]]) {
              info.value = v[item[0]].firstname + " " + v[item[0]].lastname;
            } else {
              info.value = "برای خودم";
            }
          } else if (item[0] == "servant") {
            if (v[item[0]]) {
              info.value = v[item[0]].firstname + " " + v[item[0]].lastname;
            } else {
              info.value = "انتشار عمومی";
            }
          } else {
            info.value = v[item[0]].title;
          }
          this.infos.push(info);
        }
      });
    },
    complete() {
      this.$emit("complete", this.price);
    },
    edit() {
      const route = this.$route.path.split("/")[1];
      const pageIndex = route == "company" ? 4 : 3;
      this.$emit("prevPage", { pageIndex });
    },
  },
  watch: {
    formData: {
      handler(v) {
        this.initial(v);
        this.loading = false;
        // let price = v.price + "";
        // price = price.replaceAll(",", "");
        // this.price = parseInt(price);
      },
      deep: true,
    },
  },
  mounted() {
    if (this.formData.service) {
      this.initial(this.formData);
    }
  },
};
</script>

<style>
</style>