<template>
  <Card class="lg:w-2/3">
    <template #title>
      <div class="flex justify-between">
        <p>مدرک تحصیلی</p>
        <Tag :value="status.value" :severity="status.severity" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-8 items-center">
        <Image :src="image" alt="تصویر مدرک تحصیلی" class="w-96 h-64 overflow-hidden" preview />
        <div class="flex justify-center gap-3">
          <p>مقطع تحصیلی</p>
          <p class="font-bold">{{ grade }}</p>
        </div>
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
      grade: null,
      image: null,
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
          degreeEducation: this.verification,
        },
        pageIndex: 4,
      });
      this.status = this.verification
        ? this.statuses.verified
        : this.statuses.rejected;
    },

    prevPage() {
      this.$emit("prevPage", {
        pageIndex: 4,
      });
    },
  },
  created() {
    const degreeEducation = this.input.degreeEducation;
    this.image = degreeEducation.image;
    this.grade = degreeEducation.grade;
    this.status = this.statuses[degreeEducation.status];
    if (degreeEducation.status != "checking")
          this.verification = degreeEducation.status == "verified";
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