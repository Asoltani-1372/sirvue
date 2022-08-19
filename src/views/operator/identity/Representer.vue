<template>
  <Card class="lg:w-2/3">
    <template #title>
      <div class="flex justify-between">
        <p>معرفی نامه</p>
        <Tag :value="status.value" :severity="status.severity"  />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col items-center gap-8">
        <Image :src="image" alt="تصویر معرفی نامه " class="w-96 h-64 overflow-hidden" preview />
        <div class="flex gap-3">
          <p>شرکت پشتیبان :</p>
          <p class="font-bold">{{ company }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-3">
        <Button
          label="قبلی"
          class="p-button-info p-button-sm p-button-text"
          icon="pi pi-angle-right"
          @click="prevPage()"
        />
        <div class="flex gap-3">
          <ToggleButton
            v-model="verification"
            onLabel="تایید"
            offLabel="تایید"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            class="p-button-sm"
            :disabled="loading"
             v-if="$route.path.split('/')[1] == 'allocator'"
          />
          <Button
            label="ثبت نهایی"
            v-if="$route.path.split('/')[1] == 'allocator'"
            class="p-button-sm p-button-success"
            icon="pi pi-angle-check"
            iconPos="left"
            @click="complete()"
            :loading="loading"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  props: ["input"],

  data() {
    return {
      fetching: true,
      status: {},
      company: null,
      image: null,
      verification: false,
      loading: false,
      statuses: {
        verified: { value: "احراز شده", severity: "success" },
        rejected: { value: "رد شده", severity: "danger" },
        checking: { value: "درانتظار بررسی", severity: "warning" },
      },
    };
  },

  methods: {
    prevPage() {
      this.$emit("prevPage", {
        pageIndex: 2,
      });
    },
    complete() {
      this.loading = true
      this.$emit("complete", {
        formData: {
          representer: this.verification,
        },
        pageIndex: 2,
      });
      const role = this.$route.path.split("/")[1];
      if (role == "allocator") {
        this.status = this.verification
          ? this.statuses.verified
          : this.statuses.rejected;
      }
    },
  },

  created() {
    const representer = this.input.representer;
    this.image = representer.image;
    this.company = representer.company;
    this.status = this.statuses[representer.status];
    if (representer.status != "checking")
      this.verification = representer.status == "verified";
    this.fetching = false;
  },

  watch: {
    verification(v) {
      const role = this.$route.path.split('/')[1];
      if (role == 'allocator') {
        this.status = v ? this.statuses.verified : this.statuses.rejected;
      }
    },
  },
};
</script>

<style>
</style>