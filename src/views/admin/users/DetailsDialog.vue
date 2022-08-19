<template>
  <div>
    <Dialog
      :visible="detailsDialog"
      class="max-w-2xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">جزئیات کاربر</div>
      </template>

      <div class="flex flex-col gap-3">
        <div class="flex flex-col justify-center items-center">
          <Avatar shape="circle" :image="data.profile.avatar" size="xlarge" />
          <div>
            {{ data.profile.fullname }}
          </div>
          <div>
            <Tag
              value="خدمت دهنده"
              severity="info"
              v-if="data.role == 'servant'"
            />
            <Tag
              value="متقاضی"
              severity="success"
              v-else-if="data.role == 'applicant'"
            />
            <Tag value="کارشناس" v-else-if="data.role == 'operation'" />
            <Tag
              value="مدیر"
              severity="warning"
              v-else-if="data.role == 'admin'"
            />
            <Tag
              value="پشتیبان"
              severity="danger"
              v-else-if="data.role == 'supporter'"
            />
            <Tag value="نامشخص" v-else />
          </div>
        </div>

        <div class="flex justify-between">
          <div>جنسیت</div>

          <div v-if="data.profile.gender == 'male'">مرد</div>
          <div v-if="data.profile.gender == 'female'">زن</div>
        </div>

        <div class="flex justify-between">
          <div>تاریخ تولد</div>
          <div>{{ data.profile.birthday }}</div>
        </div>

        <div class="flex justify-between">
          <div>منطقه</div>
          <div>{{ data.profile.place }}</div>
        </div>

        <div class="flex justify-between">
          <div>شماره تلفن</div>
          <div>{{ data.phone }}</div>
        </div>

        <div class="flex justify-between">
          <div>پست الکترونیک</div>
          <div>{{ data.profile.email }}</div>
        </div>

        <div class="flex justify-between">
          <div>تاریخ ثبت نام</div>
          <div>{{ data.register_time }}</div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="detailsDialog = false"
          />
          <div>
            <Button
              label="تغییر نقش"
              class="p-button-text p-button-success p-button-sm"
              @click="$refs.updateRoleDialog.open(data)"
            />

            <!-- v-if not working with multiple condition 
             data.status!= "active" || data.role != "applicant" -->
            <Button
              label="تایید کاربر"
              class="p-button-raised p-button-success p-button-sm"
              v-if="data.status != 'active'"
              :loading="loading"
              @click="verifyUser()"
            />
          </div>
        </div>
      </template>
    </Dialog>
    <UpdateRoleDialog
      ref="updateRoleDialog"
      :input="roles1"
      @call="closeDialog()"
    />
  </div>
</template>

<script>
import UsersService from "../../../service/admin/users.js";
import UpdateRoleDialog from "./UpdateRoleDialog.vue";
export default {
  props: ["confirmBtn", "mapShow", "input", "roles1"],
  components: { UpdateRoleDialog },
  data() {
    return {
      usersService: null,
      loading: false,
      data: null,
      selectedRoles: null,
      detailsDialog: false,
    };
  },

  created() {
    this.usersService = new UsersService();
  },

  methods: {
    open(data) {
      this.data = data;
      this.detailsDialog = !this.detailsDialog;
    },

    verifyUser() {
      const data = { user: this.data.id, role: this.data.role };
      this.loading = true;

      this.usersService.verifyUser(
        data,
        () => {
          this.loading = false;
          this.$emit("call", "");
          this.detailsDialog = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "کاربر با موفقیت تایید شد.",
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

    closeDialog() {
      this.detailsDialog = false;
      this.$emit("call", "");
    },
  },
};
</script>

<style>
</style>