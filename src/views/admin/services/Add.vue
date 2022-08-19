<template>
  <Card>
    <template #title>
      <div>افزودن خدمت</div>
    </template>
    <template #content>
      <div class="flex flex-col gap-3">
        <InputText
          type="text"
          v-model="title"
          placeholder="نام خدمت"
          class="w-full"
          :class="{ 'p-invalid': errors.title }"
        />
        <div v-if="errors.title" class="text-xs text-red-600">
          {{ messages.title }}
        </div>
        <InputNumber
          v-model="price"
          mode="decimal"
          placeholder="قیمت"
          :class="{
            'p-invalid': errors.price,
          }"
        />
        <div v-if="errors.price" class="text-xs text-red-600">
          {{ messages.price }}
        </div>

        <AutoComplete
          :multiple="true"
          v-model="selectedCountries"
          :suggestions="filteredCountries"
          @complete="searchCountry($event)"
          field="name"
          placeholder="مناطق غیر مجاز"
          class="w-full hidden"
        />
        <Textarea
          v-model="desc"
          rows="5"
          cols="30"
          placeholder="توضیحات"
          :class="{ 'p-invalid': errors.desc }"
        />
        <div v-if="errors.desc" class="text-xs text-red-600">
          {{ messages.desc }}
        </div>
        <FileUpload
          mode="basic"
          name="file"
          url="http://192.168.1.150/api/upload?state=service"
          :auto="true"
          @before-send="beforeUpload"
          @upload="onUpload"
          @select="onSelect"
          accept="image/*"
          chooseLabel="بارگذاری تصویر"
          class="w-full"
        />
        <div class="flex justify-end">
          <Button
            label="افزودن"
            class="p-button-success p-button-sm"
            icon="pi pi-plus"
            @click="addService()"
            :loading="loading"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import ServicesService from "../../../service/admin/services";
export default {
  data() {
    return {
      servicesService: null,
      loading: false,
      title: "",
      price: null,
      image: null,
      desc: "",
      errors: {
        title: null,
        price: null,
        email: null,
        desc: null,
      },
      messages: {
        title: " نام خدمت نامعتبر است.",
        price: "قیمت نامعتبر است.",
        desc: "توضیحات نامعتبر است.",
      },
    };
  },

  created() {
    this.servicesService = new ServicesService();
  },

  methods: {
    addService() {
      const data = {
        title: this.title,
        price: this.price,
        image: this.image,
        desc: this.desc,
      };
      if (data.title.length < 3) {
        this.errors.title = true;
        this.errors.price = false;
        this.errors.desc = false;

        this.loading = false;
      } else if (data.price == null) {
        this.errors.title = false;
        this.errors.price = true;
        this.errors.desc = false;

        this.loading = false;
      } else if (data.desc.length < 10) {
        this.errors.title = false;
        this.errors.price = false;
        this.errors.desc = true;

        this.loading = false;
      } else {
        this.loading = true;
        this.errors.title = false;
        this.errors.price = false;
        this.errors.desc = false;

        if (!this.image) {
          //error = تصویر انتخاب نشده است
        }

        this.servicesService.storeService(
          data,
          () => {
            this.loading = false;
            this.deleteProductDialog = false;
            //emit
            this.title = "";
            this.price = null;
            this.desc = "";
            this.$emit("call", "");
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "خدمت جدید با موفقیت ثبت شد.",
              life: 3000,
            });
          },
          (error) => {
            this.$toast.add({
              severity: "error",
              summary: "خطا",
              detail: error,
              life: 3000,
            });
          }
        );
      }
    },

    checkValidate() {
      this;
    },
    onSelect(event) {
      this.image = event.files[0].objectURL;
    },

    onUpload(e) {
      const xhr = e.xhr;
      if (xhr.readyState == 4 && xhr.status == 200) {
        this.$toast.add({
          severity: "success",
          summary: "موفق",
          detail: "با موفقیت بارگذاری شد",
          life: 3000,
        });
        this.image = xhr.response;
      } else {
        this.$toast.add({
          severity: "error",
          summary: "خطا",
          detail: "خطا بارگذاری تصویر",
          life: 3000,
        });
        this.image = null;
      }
    },

    beforeUpload(e) {
      e.xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
  },

  watch: {},
};
</script>

<style>
.p-autocomplete .p-autocomplete-multiple-container {
  @apply w-full !important;
}
</style>