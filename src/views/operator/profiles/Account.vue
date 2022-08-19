<template>
  <card class="account">
    <template #header>
      <div class="flex flex-row justify-between">
        <div v-if="input" class="flex relative items-center max-w-max">
          <Avatar
            :image="input.avatar"
            class="-mt-12 mr-6"
            size="xlarge"
            shape="circle"
          />
          <FileUpload
            mode="basic"
            name="file"
            :url="input.rootUrl + '/api/upload?state=avatar'"
            :auto="true"
            @before-send="beforeUpload"
            @upload="onUpload"
            @select="onSelect"
            class="p-button-rounded p-button-success p-button-xs opacity-80"
            v-if="
              $route.path.split('/')[1] == 'allocator' &&
              $route.path.split('/')[1] == 'company'
            "
          />
        </div>
        <Skeleton v-else shape="circle" size="6rem" class="-mt-12 mr-6" />
        <div
          class="pl-5 pt-5"
          v-if="
            $route.path.split('/')[1] == 'allocator' &&
            $route.path.split('/')[1] == 'company'
          "
        >
          <Button
            v-if="input"
            icon="pi pi-trash"
            class="p-button-text p-button-danger p-button-rounded"
            @click="$refs.deleteConfirmDialog.open()"
          />
          <Skeleton size="3.2rem" shape="circle" v-else />
        </div>
      </div>
    </template>
    <template #title>
      <div class="flex flex-row justify-between">
        <p v-if="input" class="test">
          {{ input.firstname + " " + input.lastname }}
        </p>
        <Skeleton width="70%" height="1.4rem" v-else />

        <div
          v-if="
            $route.path.split('/')[1] == 'allocator' &&
            $route.path.split('/')[1] == 'company'
          "
        >
          <InputSwitch v-model="checked" v-if="input" @click="changeStatus()" />
          <Skeleton
            width="3.2rem"
            height="1.75rem"
            borderRadius="16px"
            v-else
          />
        </div>
      </div>
    </template>
    <template #subtitle>
      <div class="flex justify-between items-center">
        <p v-if="input" class="text-sm lg:text-base text-center lg:text-right">
          {{ input.role }}
        </p>
        <Skeleton v-else width="30%" height=".7rem" class="mx-auto lg:mx-0" />
        <div v-if="input">
          <Tag
            v-if="input && input.authorized == 'verified'"
            value="احراز شده"
            severity="success"
          />
          <Tag
            value="در حال بررسی"
            v-if="input && input.authorized == 'checking'"
            severity="warning"
          />
          <Tag
            value="رد شده"
            v-if="input && input.authorized == 'rejected'"
            severity="danger"
          />
          <Tag
            value="عدم ارسال مدارک"
            v-if="input && input.authorized == ''"
            severity="info"
          />
        </div>
        <Skeleton v-else width="30%" height=".7rem" class="mx-auto lg:mx-0" />
      </div>
      <DeleteConfirmDialog ref="deleteConfirmDialog" />
    </template>
  </card>
</template>

<script>
import UsersService from "../../../service/operator/users";
import DeleteConfirmDialog from "./DeleteConfirmDialog.vue";
export default {
  props: ["input"],
  components: { DeleteConfirmDialog },
  data() {
    return {
      usersServices: null,
      avatar: null,
      checked: null,
      status: null,
      toastMessage: "",
    };
  },

  created() {
    this.usersService = new UsersService();
  },

  methods: {
    onSelect(event) {
      this.avatar = event.files[0].objectURL;
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
        this.avatar = xhr.response;
        this.$emit("call", this.avatar);
      } else {
        this.$toast.add({
          severity: "error",
          summary: "خطا",
          detail: "خطا بارگذاری تصویر",
          life: 3000,
        });
        this.avatar = null;
      }
    },

    beforeUpload(e) {
      e.xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },

    destroyUser() {
      const id = this.$route.params.id;
      this.usersService.destroyUser(
        id,
        () => {
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "کاربر با موفقیت حذف شد.",
            life: 3000,
          });
          this.loading = false;
          setTimeout(() => {
            this.$router.push("operator/users/applicants");
          }, 100);
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

    changeStatus() {
      const id = this.$route.params.id;
      this.status = this.input.status ? "enable" : "disable";
      this.usersService.changeStatus(
        this.status,
        id,
        () => {
          //   this.toastMessage = this.status == "disable" ? "فعال " : "غیر فعال";
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "وضعیت کاربر تغییر کرد.",
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
  watch: {
    input(v) {
      this.avatar = v.avatar;
      this.checked = v.status;
    },
  },
};
</script>

<style scoped>
.account {
  @apply w-full  mt-8 mx-auto lg:w-2/5  lg:mt-8 lg:mx-0;
}
.p-avatar-xl {
  @apply w-28 h-28 shadow-sm !important;
}

.p-fileupload {
  @apply w-8 h-8 -mr-10 !important;
}
</style>
<style>
.account .p-card-content {
  @apply py-0 bg-blue-700 !important;
}
.account .p-fileupload > span > span {
  @apply m-0 !important;
}
</style>