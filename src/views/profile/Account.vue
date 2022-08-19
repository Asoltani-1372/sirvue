<template>
  <card class="accuont">
    <template #header>
      <div
        v-if="input"
        class="
          w-full
          lg:max-w-max
          flex flex-col
          lg:flex-row
          items-center
          justify-end -mt-12
          relative
        "
      >
        <Avatar :image="avatar" class="lg:mr-6" size="xlarge" shape="circle" />
        <FileUpload
          mode="basic"
          name="file"
          :url="$parent.rootUrl + '/api/upload?state=avatar'"
          :auto="true"
          @before-send="beforeUpload"
          @upload="onUpload"
          @select="onSelect"
          class="p-button-rounded p-button-success p-button-xs opacity-80"
        />
      </div>
      <Skeleton v-else shape="circle" size="8rem" class="mx-auto -mt-12 lg:mr-6" />
    </template>
    <template #title>
      <p v-if="input" class="text-center lg:text-right">{{ input.fullname }}</p>
      <Skeleton v-else width="70%" class="mx-auto lg:mx-0" />
    </template>
    <template #subtitle>
      <p v-if="input" class="text-sm lg:text-base text-center lg:text-right">
        {{ input.role }}
      </p>
      <Skeleton v-else width="30%" height=".7rem" class="mx-auto lg:mx-0"  />
    </template>
  </card>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      avatar: null,
    };
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
  },
  watch: {
    input(v) {
      this.avatar = v.avatar;
    },
  },
};
</script>

<style scoped>
.accuont {
  @apply w-10/12 mt-8 mx-auto lg:w-1/4 lg:mt-0 lg:mx-0;
}
.p-avatar-xl {
  @apply w-28 h-28 shadow-sm !important;
}

.p-fileupload {
  @apply w-12 h-auto -bottom-4 absolute !important;
}
</style>
<style>
.accuont .p-card-content {
  @apply py-0 bg-blue-700 !important;
}
.accuont .p-fileupload > span > span {
  @apply m-0 !important;
}
</style>