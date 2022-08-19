<template>
  <Card class="w-full">
    <template #title>
      <div class="flex justify-between">
        <Skeleton width="10rem" v-if="fetching" />
        <div v-else>تصویر آخرین مدرک تحصیلی</div>
        <Skeleton width="4rem" v-if="fetching" />
        <Tag
          v-else-if="$parent.showStatus && status"
          :severity="status.severity"
          :value="status.value"
        />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-12 justify-between">
        <Skeleton height="16rem" v-if="fetching" />
        <div class="upload-div" v-else>
          <img :src="imageUrl" class="w-auto h-64 px-12" v-if="image" />
          <div v-else>
            <FileUpload
              mode="basic"
              name="file"
              :url="$parent.rootUrl + '/api/upload?state=identity'"
              accept="image/*"
              :maxFileSize="20000000"
              @before-send="beforeUpload($event)"
              @upload="onUpload($event)"
              @select="onSelect($event)"
              :auto="true"
              icon="pi pi-upload"
              chooseLabel="بارگذاری تصویر مدرک تحصیلی"
              class="p-button-outlined"
            />
          </div>
          <p class="text-xs text-red-600">{{ errors.image }}</p>
        </div>
        <div class="flex flex-col gap-2">
          <Skeleton height="3.125rem" v-if="fetching" />
          <div v-else-if="status" class="flex justify-center gap-8">
            <p>مقطع تحصیلی :</p>
            <p class="font-bold">{{ grade }}</p>
          </div>
          <Dropdown
            v-else
            v-model="grade"
            :options="grades"
            optionLabel="title"
            optionValue="title"
            placeholder="مقطع تحصیلی را وارد نمایید"
            class="w-full"
            :class="{ 'p-invalid': errors.grade }"
            :disabled="loading"
          />
          <p class="text-xs text-red-600">{{ errors.grade }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="پاک کردن"
          class="p-button-text p-button-danger  p-button-sm"
          icon="pi pi-trash"
          v-if="(!status && image) || (status && status.type == 'rejected')"
          @click="clearAll()"
        />
        <Skeleton height="3.125rem" width="3.87rem" v-if="fetching" />
        <Button
          class="p-button p-button-success p-button-sm"
          label="ثبت"
          @click="updateDegreeEducation()"
          :disabled="!image || !grade || image.indexOf('blob:') > -1 || status"
          :loading="loading"
          v-else-if="!status"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import IdentityService from "../../../service/servant/Identity";
export default {
  props: ["input"],
  data() {
    return {
      identityService: null,
      fetching: true,
      image: null,
      grade: null,
      errors: {},
      status: null,
      loading: false,
      statues: {
        checking: {
          value: "درحال بررسی",
          severity: "warning",
          type: "checking",
        },
        verified: { value: "احراز شده", severity: "success", type: "verified" },
        rejected: { value: "رد شده", severity: "danger", type: "rejected" },
      },
      grades: [
        { title: "دکترا" },
        { title: "کارشناسی ارشد" },
        { title: "کارشناسی" },
        { title: "فوق دیپلم" },
        { title: "دیپلم" },
        { title: "سیکل" },
        { title: "ابتدایی" },
      ],
      imageUrl: null,
    };
  },

  created() {
    this.identityService = new IdentityService();
  },

  methods: {
    updateDegreeEducation() {
      this.loading = true;
      const data = {
        image: this.image,
        grade: this.grade,
      };
      this.identityService.updateDegreeEducation(
        data,
        () => {
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "مدرک تحصیلی با موفقیت ثبت شد.",
            life: 3000,
          });
          this.status = this.statues.checking;
          this.loading = false;
          this.$emit("call", "");
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
    clearAll() {
      this.image = null;
      this.grade = null;
      this.status = null;
    },
    onUpload(event) {
      const xhr = event.xhr;
      if (xhr.readyState == 4 && xhr.status == 200) {
        this.image = xhr.response;
      } else {
        this.$toast.add({
          severity: "error",
          summary: "خطا",
          detail: "خطا بارگذاری تصویر",
          life: 3000,
        });
        this.image = null;
      }
    },
    beforeUpload(event) {
      event.xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    onSelect(event) {
      this.image = event.files[0].objectURL;
    },
  },

  watch: {
    "input.degreeEducation"(v) {
      if (v) {
        this.image = v.image;
        this.grade = v.grade;
        if (v.status) this.status = this.statues[v.status];
        this.fetching = false;
      }
    },
    image(v) {
      if (v) {
        if (v.indexOf("blob:") > -1) this.imageUrl = v;
        else this.imageUrl = this.$parent.rootUrl + "/uploads/" + v;
      }
    },
  },
};
</script>

<style scoped>
.upload-div {
  @apply flex justify-center rounded-lg items-center h-64;
}

.upload-div > div {
  @apply w-full h-full flex justify-center items-center border-dashed border-4 border-gray-200;
}
</style>