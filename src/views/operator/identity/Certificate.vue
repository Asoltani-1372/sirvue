<template>
  <Card class="lg:w-2/3">
    <template #title>
      <div class="flex justify-between">
        <p>گواهی خلبانی</p>
        <Tag :value="status.value" :severity="status.severity" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-8 items-center">
         <Image :src="image" alt="تصویر گواهی خلبانی" class="w-96 h-64 overflow-hidden" preview />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Button
          label="قبلی"
          class="p-button-info p-button-sm p-button-text"
          icon="pi pi-angle-right"
          @click="prevPage()"
        />
        <div class="flex gap-3">
          <ToggleButton
            v-model="verification"
            onLabel="تایید "
            offLabel="تایید"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            class="p-button-sm"
          />
          <Button
            label="بعدی"
            class="p-button-info p-button-sm p-button-text"
            icon="pi pi-angle-left"
            iconPos="right"
            @click="nextPage()"
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
      status: {},
      image: null,
      plaque: null,
      verification: false,
      statuses: {
        verified: { value: "احراز شده", severity: "success" },
        rejected: { value: "رد شده", severity: "danger" },
        checking: { value: "درانتظار بررسی", severity: "warning" },
      },
    };
  },

  methods: {
    nextPage() {
      this.$emit("nextPage", {
        formData: {
          certificate: this.verification,
        },
        pageIndex: 2,
      });
      this.status = this.verification
        ? this.statuses.verified
        : this.statuses.rejected;
    },

    prevPage() {
      this.$emit("prevPage", {
        pageIndex: 2,
      });
    },
  },

  created() {
    const certificate = this.input.certificate;
    this.image = certificate.image;
    this.plaque = certificate.plaque;
    this.status = this.statuses[certificate.status];
     if (certificate.status != "checking")
          this.verification = certificate.status == "verified";
  },

  watch: {
    verification(v) {
      this.status = v ? this.statuses.verified : this.statuses.rejected;
    },
  },
};
</script>

<style>
</style>