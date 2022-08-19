<template>
  <div>
    <Dialog
      :visible="deleteDetailsDialog"
      class="max-w-2xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">جزئیات خدمت</div>
      </template>
      <div class="flex flex-col gap-3">
        <div class="flex justify-center">
          <Avatar :image="image" class="" size="xlarge" shape="circle" />
          <FileUpload
            mode="basic"
            url="./upload"
            :auto="true"
            @select="onSelect"
            class="rounded-full p-button-success opacity-80 -mb-10 -mr-5"
          />
        </div>

        <InputText
          type="text"
          v-model="title"
          placeholder="افزودن خدمت"
          class="w-full"
        />
        <InputNumber v-model="price" mode="decimal" placeholder="قیمت" />
        <Textarea v-model="desc" rows="5" cols="30" placeholder="توضیحات" />
      </div>

      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="deleteDetailsDialog = false"
          />
          <div>
            <Button
              label="ویرایش خدمت"
              class="p-button-raised p-button-success p-button-sm"
              @click="updateService()"
              :loading="loading"
            />
            <Button
              label="حذف خدمت"
              class="p-button-text p-button-danger p-button-sm"
              @click="deleteService()"
              :loading="deleteLoading"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import ServicesService from "../../../service/admin/services";
export default {
  data() {
    return {
      servicesService: null,
      deleteDetailsDialog: false,
      title: null,
      price: null,
      desc: null,
      id: null,
      image: null,
      loading: false,
      deleteLoading: false,
    };
  },

  created() {
    this.servicesService = new ServicesService();
  },

  methods: {
    open(service) {
      this.service = service;
      this.title = service.title;
      this.price = service.price.replaceAll(",", "");
      this.desc = service.desc;
      this.id = service.id;
      this.image = service.image;
      this.deleteDetailsDialog = true;
    },

    updateService() {
      const data = {
        id: this.id,
        title: this.title,
        price: this.price,
        desc: this.desc,
        image: this.image,
      };
      this.loading = true;
      this.servicesService.updateService(
        data,
        (data) => {
          this.$emit("call", "");
          this.loading = false;
          this.services = data.services;
          this.skeleton = true;
          this.deleteDetailsDialog = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "خدمت به روزرسانی شد.",
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

    deleteService() {
      this.deleteLoading = true;
      this.servicesService.deleteService(
        this.id,
        () => {
          this.deleteLoading = false;
          this.deleteDetailsDialog = false;
          this.$emit("call", "");
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "خدمت با موفقیت حذف شد.",
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
};
</script>

<style>
</style>