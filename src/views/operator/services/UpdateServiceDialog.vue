<template>
  <div>
    <Dialog
      :visible="showAddServiceDialog"
      :modal="true"
      :closable="false"
      class="max-w-2xl w-11/12 lg:w-full"
    >
      <template #header>
        <div class="font-bold text-lg">ویرایش خدمت</div>
      </template>

      <div class="flex flex-col gap-3">
        <InputText
          type="text"
          v-model="data.title"
          placeholder="عنوان خدمت"
          :class="{ 'p-invalid': errors.title }"
        />
        <p class="text-xs text-red-600">{{ errors.title }}</p>

        <FileUpload
          mode="basic"
          name="demo[]"
          url="./upload.php"
          accept="image/*"
          :maxFileSize="1000000"
          @upload="onUpload"
          :auto="true"
          chooseLabel="افزودن تصویر خدمت"
          class="w-full"
          :class="{ 'p-invalid': errors.image }"
        />
        <p class="text-xs text-red-600">{{ errors.image }}</p>

        <InputNumber
          v-model="data.price"
          placeholder="قیمت"
          :class="{ 'p-invalid': errors.price }"
        />
        <p class="text-xs text-red-600">{{ errors.price }}</p>

        <!-- <GetLocation @call="place = $event" :place="place" />

        <Textarea
          v-model="desc"
          rows="5"
          cols="30"
          placeholder="توضیحات"
          :class="{ 'p-invalid': errors.desc }"
        /> -->
      </div>

      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="showAddServiceDialog = false"
          />
          <Button
            label="ویرایش خدمت"
            class="p-button-raised p-button-success p-button-sm"
            @click="validation()"
            :loading="loading"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
// import GetLocation from "../../../components/basic/GetLocation.vue";
import ServicesService from "../../../service/operator/services";
export default {
  // components: { GetLocation },
  data() {
    return {
      showAddServiceDialog: false,
      servicesService: null,
      title: "",
      image: "image.png",
      price: null,
      data: null,
      // place: "",
      // desc: null,
      loading: false,
      errors: {},
    };
  },

  created() {
    this.servicesService = new ServicesService();
  },

  methods: {
    open(data) {
      this.showAddServiceDialog = true;
      this.data = data;
    },

    validation() {
      if (this.data.title.length < 3) {
        this.errors.title = "عنوان خدمت حداقل 3 کارکتر یا بیشتر است.";
      } else if (this.image === "") {
        this.errors.image = "تصویر خدمت انتخاب نشده است.";
      } else if (this.data.price == null) {
        this.errors.price = "  قیمت خدمت نمی تواند خالی باشد. ";
      } else {
        this.addService();
      }
    },

    addService() {
      // const data = {
      //   title: this.data.title,
      //   price: this.data.price,
      //   image: this.image,
      // place: this.place,
      // desc: this.desc,
      // };
      this.loading = true;

      this.servicesService.update(
        this.data,
        () => {
          this.loading = false;
          this.showAddServiceDialog = false;
          this.$emit("call", "");
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "خدمت با موفقیت به روزرسانی شد.",
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
    },
  },

  watch: {
    data(v) {
      if (v.title.length > 0) this.errors.title = "";
      else this.errors.title = "عنوان خدمت نمیتواند خالی باشد";
      if (v.price !== null) this.errors.price = "";
      else this.errors.price = "قیمت خدمت نمیتواند خالی باشد";
    },
  },
};
</script>

<style>
</style>