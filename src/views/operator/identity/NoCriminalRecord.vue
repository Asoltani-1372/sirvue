<template>
  <Card class="lg:w-2/3">
    <template #title>
      <div class="flex justify-between">
        <p>عدم سوء پیشینه</p>
        <Tag :value="status.value" :severity="status.severity" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col items-center gap-8">
        <Image :src="image" alt="تصویر گواهی عدم سوء پیشینه" class="w-96 h-64 overflow-hidden" preview />
        <div class="flex gap-3">
          <p>شماره گواهی :</p>
          <p class="font-bold">{{ number }}</p>
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
          :disabled="loading"
        />
        <div class="flex gap-3">
          <ToggleButton
            v-model="verification"
            onLabel="تایید "
            offLabel="تایید"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            class="p-button-sm"
             :disabled="loading"
          />
          <Button
            label="ثبت نهایی"
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
      status: {},
      image: null,
      number: null,
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
    complete() {
       this.loading = true;
      this.$emit("complete", {
        formData: {
          noCriminalRecord: this.verification,
        },
        pageIndex: 5,
      });
      this.status = this.verification
        ? this.statuses.verified
        : this.statuses.rejected;
    },

    prevPage() {
      this.$emit("prevPage", {
        pageIndex: 5,
      });
    },
  },
  created() {
    const noCriminalRecord = this.input.noCriminalRecord;
    this.image = noCriminalRecord.image;
    this.number = noCriminalRecord.number;
    this.status = this.statuses[noCriminalRecord.status];
    if (noCriminalRecord.status != "checking")
          this.verification = noCriminalRecord.status == "verified";
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