<template>
  <card class="details">
    <template #title>
      <div class="flex justify-between items-center">
        <p v-if="input">مشخصات</p>
        <Skeleton v-else width="20%" height="1.2rem" />
        <Button
          v-if="!editMode && input"
          icon="pi pi-pencil"
          class="p-button-rounded p-button-outlined p-button-plain w-4 h-4"
          @click="editMode = true"
        />
        <Skeleton v-else-if="!editMode" shape="circle" size="3.2rem" />
      </div>
    </template>
    <template #content>
      <div class="flex w-full flex-col gap-3 px-4">
        <div
          class="
            flex
            items-center
            -mx-5
            gap-4
            lg:gap-8
            text-left text-sm
            lg:text-base
          "
          v-for="(item, index) in items"
          :key="index"
        >
          <p v-if="input" class="w-1/3 lg:w-1/5 text-xs lg:text-base text-left">
            {{ item.title }}
            <span class="text-red-600" v-if="editMode && index != 'email'"
              >*</span
            >
          </p>
          <Skeleton v-else width="15%" class="mr-10" />
          <div
            v-if="editMode"
            class="flex flex-grow flex-col gap-2 w-2/3 lg:w-4/5"
          >
            <InputText
              v-if="item.type == 'text'"
              type="text"
              v-model="item.input"
              :placeholder="item.title"
              class="flex-grow p-inputtext-sm w-full"
              :class="{ 'p-invalid': errors[index] }"
            />
            <Dropdown
              v-model="item.input"
              v-if="item.type == 'options'"
              :options="genderes"
              class="flex-grow text-right"
              optionLabel="name"
              :optionGroupChildren="[]"
              :placeholder="item.title"
              :class="{ 'p-invalid': errors[index] }"
            />
            <Calendar
              v-model="item.input"
              :maxDate="maxDate"
              v-if="item.type == 'birthday'"
              class="flex-grow text-left"
              :placeholder="item.title"
              :class="{ 'p-invalid': errors[index] }"
            />
            <p class="text-xs text-red-600 text-right">{{ errors[index] }}</p>
          </div>
          <p
            v-else-if="input"
            class="
              font-bold
              w-2/3
              lg:w-4/5
              text-right
              overflow-ellipsis overflow-hidden
            "
          >
            {{ item.value }}
          </p>
          <Skeleton v-else width="30%" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end" v-if="editMode">
        <Button
          label="انصراف"
          class="p-button-text p-button-success"
          @click="cancelEdit()"
        />
        <Button
          label="بروزرسانی"
          class="p-button-success p-button-plain"
          :loading="loading"
          @click="saveDetails()"
          :disabled="updateBtnEnable"
        />
      </div>
    </template>
  </card>
</template>

<script>
import ProfileService from "../../service/profile.js";
export default {
  props: ["input"],
  data() {
    return {
      profileService: null,
      editMode: false,
      loading: false,
      updateBtnEnable: true,
      items: {
        firstname: { title: "نام", type: "text" },
        lastname: { title: "نام خانوادگی", type: "text" },
        username: { title: "نام کاربری", type: "text" },
        gender: { title: "جنسیت", type: "options" },
        birthday: { title: "تاریخ تولد", type: "birthday" },
        email: { title: "ایمیل", type: "text" },
      },
      genderes: [
        { name: "آقا", code: "male" },
        { name: "خانم", code: "female" },
      ],
      maxDate: null,
      errors: {
        firstname: null,
        lastname: null,
        username: null,
        email: null,
        gender: null,
        birthday: null,
      },
    };
  },
  created() {
    this.profileService = new ProfileService();
    let date = new Date();
    this.maxDate = this.getDate(date.toLocaleDateString("fa-IR"));
  },
  methods: {
    saveDetails() {
      const firstname = this.items.firstname.input.trim();
      const lastname = this.items.lastname.input.trim();
      const username = this.items.username.input.trim();
      let email = this.items.email.input || "";
      email = email.trim();
      const gender = this.items.gender.input;
      let birthday = this.items.birthday.input;
      if (firstname.length < 3) {
        this.errors.firstname = "نام باید حداقل 2 و بیشتر حرف باشد";
      } else if (lastname.length < 3) {
        this.errors.lastname = "نام خانوادگی باید حداقل 2 و بیشتر حرف باشد";
      } else if (username.length < 3) {
        this.errors.lastname = "نام کاربری باید حداقل 2 و بیشتر حرف باشد";
      } else if (!gender) {
        this.errors.gender = "جنسیت را انتخاب نمایید";
      } else if (!birthday) {
        this.errors.birthday = "تاریخ تولد را وارد نمایید";
      } else {
        this.loading = true;
        birthday =
          birthday.getFullYear() +
          "/" +
          (birthday.getMonth() + 1) +
          "/" +
          birthday.getDate();
        const data = {
          id: this.$route.path.indexOf("servant") < 0 ? 1 : 2,
          firstname,
          lastname,
          username,
          gender: gender.code,
          birthday,
          email,
        };
        this.profileService.updateDetails(
          data,
          () => {
            this.loading = false;
            this.editMode = false;
            this.items.firstname.value = firstname;
            this.$emit("call", firstname + " " + lastname);
            this.items.lastname.value = lastname;
            this.items.username.value = username;
            this.items.gender.value = gender.name;
            this.items.birthday.value = birthday;
            this.items.email.value = email;
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "با موفقیت بروزرسانی شد",
              life: 3000,
            });
          },
          (error) => {
            this.loading = false;
            this.editMode = false;
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
    checkChange() {
      try {
        if (
          this.items.firstname.input &&
          this.items.lastname.input &&
          this.items.username.input &&
          this.items.gender.input.name &&
          this.items.birthday.input
        ) {
          this.updateBtnEnable =
            this.items.firstname.value == this.items.firstname.input &&
            this.items.lastname.value == this.items.lastname.input &&
            this.items.username.value == this.items.username.input &&
            this.items.gender.value == this.items.gender.input.name &&
            this.items.birthday.value == this.items.birthday.input &&
            this.items.email.value == this.items.email.input;
        } else {
          this.updateBtnEnable = true;
        }
      } catch (error) {
        //
      }
    },
    initInputs() {
      this.items.firstname.input = this.items.firstname.value;
      this.items.lastname.input = this.items.lastname.value;
      this.items.username.input = this.items.username.value;
      this.items.gender.input = this.genderes.filter(
        (item) => item.name == this.items.gender.value
      )[0];
      this.items.birthday.input = this.getDate(this.items.birthday.value);
      this.items.email.input = this.items.email.value;
    },
    cancelEdit() {
      this.initInputs();
      this.editMode = false;
    },
    getDate(date) {
      if (date) {
        const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
        id.forEach((e, i) => (date = date.replaceAll(e, i)));
        date = date.split("/");
        return new Date(date[0], date[1] - 1, date[2], 0, 0, 0, 0);
      }
    },
  },
  watch: {
    input: {
      handler(v) {
        if (v) {
          try {
            const firstname = this.input.firstname;
            const lastname = this.input.lastname;
            const username = this.input.username;
            const gender = this.genderes.filter(
              (item) => item.code == this.input.gender
            )[0];
            const email = this.input.email;
            this.items.firstname.value = firstname;
            this.items.lastname.value = lastname;
            this.items.username.value = username;
            this.items.birthday.value = this.input.birthday;
            this.items.email.value = email;
            this.items.gender.value = gender ? gender.name : null;
            this.initInputs();
          } catch (error) {
            console.log(error);
          }
        }
      },
      deep: true,
    },
    "items.firstname.input"(v) {
      if (this.editMode) {
        if (v) this.errors.firstname = null;
        else this.errors.firstname = "نام نمیتواند خالی باشد";
        this.checkChange();
      }
    },
    "items.lastname.input"(v) {
      if (this.editMode) {
        if (v) this.errors.lastname = null;
        else this.errors.lastname = "نام خانوادگی نمیتواند خالی باشد";
        this.checkChange();
      }
    },
    "items.username.input"(v) {
      if (this.editMode) {
        if (v) this.errors.username = null;
        else this.errors.username = "نام کاربری نمیتواند خالی باشد";
        this.checkChange();
      }
    },
    "items.gender.input"(v) {
      if (this.editMode) {
        if (v) this.errors.gender = null;
        this.checkChange();
      }
    },
    "items.birthday.input"(v) {
      if (this.editMode) {
        if (v) this.errors.birthday = null;
        else this.errors.birthday = "تاریخ تولد نمیتواند خالی باشد";
        this.checkChange();
      }
    },
    // "items.email.input"(v) {
    //   if (this.editMode) {
    //     if (v) this.errors.email = null;
    //     else this.errors.email = "ایمیل نمیتواند خالی باشد";
    //     this.checkChange();
    //   }
    // },
  },
};
</script>

<style scoped>
.details {
  @apply w-full;
}
</style>
<style>
.details .p-cascadeselect-label {
  @apply p-2.5 !important;
}
</style>
