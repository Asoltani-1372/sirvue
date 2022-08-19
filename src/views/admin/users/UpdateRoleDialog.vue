<template>
  <div>
    <Dialog
      v-model:visible="deleteUpdateRoleDialog"
      class="max-w-xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">تغییر نقش کاربر</div>
      </template>

      <Dropdown
        v-model="selectedRole"
        :options="input"
        optionLabel="title"
        optionValue="id"
        placeholder="نقش های کاربری"
        class="w-full"
      />

      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="deleteUpdateRoleDialog = false"
          />

          <Button
            label="تغییر نقش"
            class="p-button-raised p-button-success p-button-sm"
            @click="updateRole()"
            :loading="loading"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import UsersService from "../../../service/admin/users.js";
export default {
  props: ["input"],
  data() {
    return {
      usersService: null,
      loading: false,
      data: null,
      selectedRole: null,
      deleteUpdateRoleDialog: false,
    };
  },

  created() {
    this.usersService = new UsersService();
  },

  methods: {
    open(data) {
      this.data = data;
      this.deleteUpdateRoleDialog = !this.deleteUpdateRoleDialog;
    },

    updateRole() {
      const data = { user: this.data.id, role: this.selectedRole };
      this.loading = true;

      this.usersService.updateRole(
        data,
        () => {
          this.$emit("call", "");
          this.loading = false;
          this.deleteUpdateRoleDialog = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "نقش کاربر با موفقیت تغییر کرد.",
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