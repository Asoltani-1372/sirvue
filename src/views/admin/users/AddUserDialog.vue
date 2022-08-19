<template>
  <div>
    <Dialog
      v-model:visible="displayModal"
      class="max-w-2xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">افزودن کاربر</div>
      </template>
      <div class="flex flex-col gap-3">
        <Dropdown
          v-model="role"
          :options="input"
          optionLabel="title"
          placeholder="نقش کاربری"
          :class="{ 'p-invalid': errors.role }"
        />
        <p class="text-xs text-red-600">{{ errors.role }}</p>

        <InputText
          type="text"
          v-model="firstName"
          placeholder="نام"
          :class="{ 'p-invalid': errors.firstName }"
        />
        <p class="text-xs text-red-600">{{ errors.firstName }}</p>

        <InputText
          type="text"
          v-model="lastName"
          placeholder="نام خانوادگی"
          :class="{ 'p-invalid': errors.lastName }"
        />
        <p class="text-xs text-red-600">{{ errors.lastName }}</p>

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

        <InputText
          type="text"
          v-model="email"
          placeholder=" ایمیل"
          :class="{ 'p-invalid': errors.email }"
        />
        <p class="text-xs text-red-600">{{ errors.email }}</p>

        <GetLocation
          @call="place = $event"
          :place="place"
          :class="{ 'p-invalid': errors.place }"
          v-if="role && (role.name == 'servant' || role.name == 'applicant')"
        />
        <p class="text-xs text-red-600">{{ errors.place }}</p>

        <Password
          v-model="password"
          inputClass="w-full px-0"
          toggleMask
          placeholder="رمز عبور"
          :class="{ 'p-invalid': errors.password }"
        />
        <p class="text-xs text-red-600">{{ errors.password }}</p>

        <Password
          v-model="repassword"
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
            @click="displayModal = false"
          />
          <Button
            label="افزودن"
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
import UsersService from "../../../service/admin/users";
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  props: ["input"],
  components: { GetLocation },
  data() {
    return {
      loading: false,
      usersService: null,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      role: null,
      place: "",
      password: "",
      repassword: "",
      displayModal: false,

      errors: {},
    };
  },

  created() {
    this.usersService = new UsersService();
  },

  methods: {
    open() {
      this.displayModal = !this.displayModal;
    },

    validation() {
      const count = this.place.length - 1;
      if (!this.role) {
        this.errors.role = "نقش کاربر را انتخاب نشده است.";
      } else if (this.firstName.length < 3) {
        this.errors.firstName = "نام حداقل 3 کارکتر یا بیشتر است.";
      } else if (this.lastName.length < 3) {
        this.errors.lastName = "نام خانوادگی حداقل 3 کارکتر یا بیشتر است.";
      } else if (this.phone.length < 11) {
        this.errors.phone = "شماره تلفن  11 رقمی می باشد";
      } else if (this.email.indexOf("@") < 0) {
        this.errors.email = "ایمیل نامعتبر است.";
      } else if (
        (this.role == "servant" || this.role == "applicant") &&
        this.place[count].type != "village" &&
        this.place[count].type != "city"
      ) {
        this.errors.place = "نشانی خود را انتخاب نمایید.";
      } else if (this.password.length < 8) {
        this.errors.password = "رمز عبور حداقل 8 کاراکتر می باشد";
      } else if (this.password != this.repassword) {
        this.errors.repassword = "رمز عبور و تکرار رمز عبور یکسان نیست";
      } else {
        this.addUser();
      }
    },

    addUser() {
      this.loading = true;

      const count = this.place.length - 1;
      let data = {
        firstname: this.firstName,
        lastname: this.lastName,
        phone: this.phone.replaceAll(" ", ""),
        email: this.email,
        role: this.role.id,
        password: this.password,
      };
      if (this.role.name == "servant" || this.role.name == "applicant") {
        data.part = this.place[count].type;
        data.place = this.place[count].id;
      }
      this.usersService.storeUser(
        data,
        () => {
          this.$emit("call", "");
          this.loading = false;
          this.displayModal = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "کاربر جدید با موفقیت افزوده شد.",
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
    firstName(v) {
      if (v.length > 0) this.errors.firstName = "";
      else this.errors.firstName = "نام نمیتواند خالی باشد";
    },

    lastName(v) {
      if (v.length > 0) this.errors.lastName = "";
      else this.errors.lastName = "نام خانوادگی نمیتواند خالی باشد";
    },

    phone(v) {
      if (v.length > 0) this.errors.phone = "";
      else this.errors.phone = "شماره تلفن نمی تواند خالی باشد";
    },

    role() {
      this.errors.role = null;
    },

    place() {
      this.errors.place = null;
    },

    email(v) {
      if (v.length > 0) this.errors.email = "";
      else this.errors.email = "ایمیل  نمی تواند خالی باشد";
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