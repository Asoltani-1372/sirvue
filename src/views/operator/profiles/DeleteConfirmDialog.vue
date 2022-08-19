<template>
  <div>
    <Dialog header="Confirmation" :visible="showDeleteConfirmDialog" :modal="true">
      <template #header>
        <div class="font-bold text-xl">حذف کاربر</div>
      </template>
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>آیا مطمئن هستید که می خواهید کاربر را حذف نمایید؟</span>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            @click="showDeleteConfirmDialog = false"
            class="p-button-text"
          />
          <Button
            label="تایید"
            @click="destroyUser()"
            class="p-button-raised p-button-success p-button-sm"
            autofocus
            :loading="loading"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import UsersService from "../../../service/operator/users";
export default {
  props: ["confirmBtn"],
  data() {
    return {
      usersService: null,
      showDeleteConfirmDialog: false,
      loading: false,
    };
  },

  created() {
    this.usersService = new UsersService();
  },
  methods: {
    open() {
      this.showDeleteConfirmDialog = true;
    },

    destroyUser() {
      const id = this.$route.params.id;
      this.loading = true;

      this.usersService.destroyUser(
        id,
        () => {
          this.loading = false;
          this.showDeleteConfirmDialog = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "کاربر با موفقیت حذف شد.",
            life: 3000,
          });
          this.loading = false;
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