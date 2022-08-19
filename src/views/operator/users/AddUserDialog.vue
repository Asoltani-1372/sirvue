<template>
  <div>
    <Dialog
      :visible="displayModal"
      :modal="true"
      :closable="false"
      class="max-w-2xl w-11/12 lg:w-full"
    >
      <template #header>
        <div class="font-bold text-lg">افزودن کاربر</div>
      </template>

      <div class="flex flex-col gap-3">
        <MultiSelect
          v-model="role"
          :options="roles"
          optionLabel="title"
          placeholder="نقش کاربری"
        />
        <p class="text-xs text-red-600">{{ errors.role }}</p>

        <InputText
          type="text"
          v-model="firstname"
          placeholder=" نام"
          :class="{ 'p-invalid': errors.firstname }"
        />
        <p class="text-xs text-red-600">{{ errors.firstname }}</p>

        <InputText
          type="text"
          v-model="lastname"
          placeholder=" نام خانوادگی"
          :class="{ 'p-invalid': errors.lastname }"
        />
        <p class="text-xs text-red-600">{{ errors.lastname }}</p>

        <InputText
          type="text"
          v-model="email"
          placeholder="ایمیل"
          :class="{ 'p-invalid': errors.email }"
        />
        <p class="text-xs text-red-600">{{ errors.email }}</p>

        <InputMask
          mask="9999 999 9999"
          placeholder="09-- --- ----"
          v-model="phone"
          class="w-full"
          dir="ltr"
          :autoClear="false"
          :class="{ 'p-invalid': errors.phone }"
          slotChar="-"
        />
        <p class="text-xs text-red-600">{{ errors.phone }}</p>

        <Password
          v-model="password"
          :feedback="false"
          inputClass="w-full px-0"
          toggleMask
          placeholder="رمز عبور"
          :class="{ 'p-invalid': errors.password }"
        />
        <p class="text-xs text-red-600">{{ errors.password }}</p>

        <Password
          v-model="repassword"
          :feedback="false"
          inputClass="w-full px-0"
          toggleMask
          placeholder="تکرار رمز عبور"
          :class="{ 'p-invalid': errors.repassword }"
        />
        <p class="text-xs text-red-600">{{ errors.repassword }}</p>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="closeModal()"
          />
          <Button
            label="افزودن کاربر"
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
import UsersService from "../../../service/operator/users";
export default {
  data() {
    return {
      displayModal: false,
      usersService: null,
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      roles: null,
      role: null,
      testRole: [],
      password: "",
      repassword: "",
      loading: false,
      errors: {},
    };
  },

  created() {
    this.usersService = new UsersService();
  },

  methods: {
    open() {
      this.errors = {};
      this.displayModal = true;
      if (!this.roles) {
        this.getRole();
      }
    },

    closeModal() {
      this.displayModal = false;
      this.firstname = "";
      this.lastname = "";
      this.phone = "";
      this.email = "";
      this.roles = null;
      this.role = null;
      this.testRole = [];
      this.password = "";
      this.repassword = "";
      this.loading = false;
    },

    getRole() {
      this.usersService.getRoles(
        (data) => {
          this.roles = data.roles;
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

    validation() {
      if (!this.role) {
        this.errors.role = "نقش کاربر را انتخاب نمایید .";
      } else if (this.firstname.length < 3) {
        this.errors.firstname = "نام حداقل 3 کارکتر یا بیشتر است.";
      } else if (this.lastname.length < 3) {
        this.errors.lastname = "نام خانوادگی حداقل 3 کارکتر یا بیشتر است.";
      } else if (this.phone.length < 11) {
        this.errors.phone = "شماره تلفن  11 رقمی می باشد";
      } else if (this.email.indexOf("@") < 0) {
        this.errors.email = "ایمیل نامعتبر است.";
      } else if (this.password.length < 8) {
        this.errors.password = "رمز عبور حداقل 8 کاراکتر می باشد";
      } else if (this.password != this.repassword) {
        this.errors.repassword = "رمز عبور و تکرار رمز عبور یکسان نیست";
      } else {
        this.addUser();
      }
    },

    addUser() {
      for (let i = 0; i < this.role.length; i++) {
        this.testRole.push(this.role[i].id);
      }
      this.loading = true;
      let data = {
        firstname: this.firstname,
        lastname: this.lastname,
        phone: this.phone.replaceAll(" ", ""),
        email: this.email,
        roles: this.testRole,
        password: this.password,
      };

      this.usersService.storeUser(
        data,
        () => {
          this.$emit("call", "");
          this.loading = false;
          this.closeModal();
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "کاربر جدید با موفقیت افزوده شد.",
            life: 3000,
          });
        },
        (error) => {
          this.loading = false;
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
    role() {
      this.errors.role = null;
    },

    firstname(v) {
      if (v.length > 0) this.errors.firstname = "";
      else this.errors.firstname = "نام نمیتواند خالی باشد";
    },

    lastname(v) {
      if (v.length > 0) this.errors.lastname = "";
      else this.errors.lastname = "نام خانوادگی نمیتواند خالی باشد";
    },

    phone(v) {
      if (v.length > 0) this.errors.phone = "";
      else this.errors.phone = "شماره تلفن نمی تواند خالی باشد";
    },

    email(v) {
      if (v.length > 0) this.errors.email = "";
      else this.errors.email = "ایمیل نمی تواند خالی باشد";
    },

    password(v) {
      if (v.length > 0) this.errors.password = "";
      else this.errors.password = "رمز عبور نمی تواند خالی باشد";
    },
  },
};
</script>

<style>
</style>