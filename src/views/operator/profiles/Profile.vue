<template>
  <card class="details">
    <template #title>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <Button
            v-if="!editMode && input"
            icon="pi pi-arrow-right"
            class="p-button-rounded p-button-outlined p-button-plain w-4 h-4"
            @click="$router.push('/'+$route.path.split('/')[1]+'/users/' + $route.path.split('/')[2])"
          />
          <Skeleton v-else-if="!editMode" shape="circle" size="3.2rem" />
          <p v-if="input">مشخصات</p>
          <Skeleton v-else width="10rem" height="1.2rem" />
        </div>

        <div class="flex flex-row gap-3 items-center" v-if="
              $route.path.split('/')[1] == 'allocator' &&
              $route.path.split('/')[1] == 'company'
            ">
          <Button
            v-if="!editMode && input"
            icon="pi pi-pencil"
            class="p-button-rounded p-button-outlined p-button-plain w-4 h-4"
            @click="activeEdit()"

            
          />
          <Skeleton v-else-if="!editMode" shape="circle" size="3.2rem" />
        </div>
      </div>
    </template>
    <template #content>
      <div class="flex w-full flex-col gap-3 px-4">
        <div
          class="flex items-center gap-8 text-left"
          v-for="(item, index) in items"
          :key="index"
        >
          <p v-if="input" class="w-1/5">{{ item.title }}</p>
          <Skeleton v-else width="15%" class="mr-10" />
          <div v-if="editMode" class="flex flex-grow flex-col gap-2">
            <MultiSelect
              v-if="item.type == 'multiSelect'"
              v-model="role"
              :options="roles"
              optionLabel="title"
              placeholder="نقش کاربری"
            />

            <InputText
              v-if="item.type == 'text'"
              type="text"
              v-model="item.input"
              :placeholder="item.title"
              class="flex-grow p-inputtext-sm"
              :class="{ 'p-invalid': errors[index] }"
            />

            <GetLocation
              v-if="item.type == 'location'"
              @call="item.input = $event"
              :place="item.value"
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

            <Dropdown
              v-model="item.input"
              v-if="item.type == 'options1'"
              :options="roles"
              class="flex-grow text-right"
              optionLabel="title"
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
          <p v-else-if="input" class="font-bold">{{ item.value }}</p>
          <Skeleton v-else width="30%" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-between" v-if="editMode">
        <div class="flex flex-row gap-3">
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
      </div>
    </template>
  </card>
</template>

<script>
import UsersService from "../../../service/operator/users";
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  props: ["input"],
  components: { GetLocation },
  data() {
    return {
      usersService: null,
      editMode: false,
      loading: false,
      updateBtnEnable: true,
      roles: null,
      items: {
        roles: { title: "نقش", type: "multiSelect" },
        firstname: { title: "نام", type: "text" },
        lastname: { title: "نام خانوادگی", type: "text" },
        place: { title: "نشانی", type: "location" },
        gender: { title: "جنسیت", type: "options" },
        birthday: { title: "تاریخ تولد", type: "birthday" },
        phone: { title: "شماره تلفن", type: "text" },
        email: { title: "ایمیل", type: "text" },
        password: { title: "رمز عبور", type: "text" },
      },
      genderes: [
        { name: "آقا", code: "male" },
        { name: "خانم", code: "female" },
      ],
      maxDate: new Date(1400, 9, 20, 0, 0, 0, 0),
      errors: {
        roles: null,
        firstname: null,
        lastname: null,
        place: null,
        gender: null,
        birthday: null,
        phone: null,
        email: null,
        password: null,
      },
    };
  },

  created() {
    this.usersService = new UsersService();
  },

  methods: {
    saveDetails() {
      const roles = [this.items.roles.input.id];
      const firstname = this.items.firstname.input.trim();
      const lastname = this.items.lastname.input.trim();
      const place = this.items.place.input;
      const count = place.length - 1;
      const gender = this.items.gender.input;
      let birthday = this.items.birthday.input;
      const email = this.items.email.input.trim();
      const phone = this.items.phone.input.trim();

      if (!roles) {
        this.errors.roles = "نقش کاربر را انتخاب نمایید.";
      } else if (firstname.length < 3) {
        this.errors.firstname = "نام باید حداقل 2 و بیشتر حرف باشد";
      } else if (lastname.length < 3) {
        this.errors.lastname = "نام خانوادگی باید حداقل 2 و بیشتر حرف باشد";
      } else if (
        place[count].type != "village" &&
        place[count].type != "city"
      ) {
        this.errors.place = "نشانی کاربر را انتخاب نمایید";
      } else if (!gender) {
        this.errors.gender = "جنسیت را انتخاب نمایید";
      } else if (!email) {
        this.errors.email = "ایمیل کاربر را وارد نمایید";
      } else if (!phone) {
        this.errors.email = "شماره تلفن کاربر را وارد نمایید";
      } else if (!birthday) {
        this.errors.birthday = "تاریخ تولد را وارد نمایید";
      } else {
        this.loading = true;
        birthday =
          birthday.getFullYear() +
          "/" +
          birthday.getMonth() +
          "/" +
          birthday.getDate();
        const data = {
          id: this.$route.path.indexOf("applicant") < 0 ? 1 : 2,
          roles,
          firstname,
          lastname,
          gender: gender.code,
          birthday,
          email,
          phone,
          place: place[count].id,
          part: place[count].type,
        };
        this.usersService.updateUser(
          data,
          () => {
            this.loading = false;
            this.editMode = false;
            this.items.firstname.value = firstname;
            this.$emit("call", firstname + " " + lastname);
            this.items.lastname.value = lastname;
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
        this.updateBtnEnable =
          this.items.firstname.value == this.items.firstname.input &&
          this.items.lastname.value == this.items.lastname.input &&
          this.items.gender.value == this.items.gender.input.name &&
          this.items.birthday.value == this.items.birthday.input &&
          this.items.email.value == this.items.email.input;
      } catch (error) {
        //
      }
    },

    initInputs() {
      this.items.firstname.input = this.items.firstname.value;
      this.items.lastname.input = this.items.lastname.value;
      this.items.gender.input = this.genderes.filter(
        (item) => item.name == this.items.gender.value
      )[0];
      this.items.birthday.input = this.items.birthday.value;
      this.items.email.input = this.items.email.value;
      // this.items.place.input = this.item.place.value;
    },

    activeEdit() {
      this.editMode = true;
      this.initInputs();
      if (this.roles == null) {
        this.usersService.getEdit(
          (data) => {
            this.roles = data.roles;
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
      }
    },

    cancelEdit() {
      this.initInputs();
      this.editMode = false;
    },
  },

  watch: {
    input: {
      handler(v) {
        if (v) {
          try {
            const roles = this.input.roles.join(" , ");
            const firstname = this.input.firstname;
            const lastname = this.input.lastname;
            // const place = this.input.place;
            const gender = this.genderes.filter(
              (item) => item.code == this.input.gender
            )[0];
            const birthday = this.input.birthday;
            const phone = this.input.phone;
            const email = this.input.email;

            this.items.roles.value = roles;
            this.items.firstname.value = firstname;
            this.items.lastname.value = lastname;

            // this.items.place.value = place;
            this.items.birthday.value = birthday;
            this.items.phone.value = phone;
            this.items.email.value = email;

            this.items.gender.value = gender.name;
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

    "items.email.input"(v) {
      if (this.editMode) {
        if (v) this.errors.email = null;
        else this.errors.email = "ایمیل نمیتواند خالی باشد";
        this.checkChange();
      }
    },
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
