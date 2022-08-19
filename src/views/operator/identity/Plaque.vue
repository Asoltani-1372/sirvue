<template>
  <Card class="lg:w-2/3">
    <template #title>
      <div class="flex justify-between">
        <p>پلاک پهپاد</p>
        <Tag :value="status.value" :severity="status.severity" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col items-center gap-8">
        <Image
          :src="image"
          alt="تصویر پلاک"
          class="w-96 h-64 overflow-hidden"
          preview
        />
        <div class="flex gap-3">
          <p>شماره پلاک :</p>
          <p class="font-bold">{{ number }}</p>
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
          <div>
            <Button
              label="بعدی"
              class="p-button-info p-button-sm p-button-text"
              icon="pi pi-angle-left"
              iconPos="right"
              @click="nextPage()"
              :disabled="loading"
            />
          </div>
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
      number: null,
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
        pageIndex: 1,
      });
    },
    nextPage() {
      this.$emit("nextPage", {
        formData: {
          plaque: this.verification,
        },
        pageIndex: 1,
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
    const plaque = this.input.plaque;
    this.image = plaque.image;
    this.number = plaque.number;
    this.status = this.statuses[plaque.status];
    if (plaque.status != "checking")
      this.verification = plaque.status == "verified";
    this.fetching = false;
  },

  watch: {
    verification(v) {
      const role = this.$route.path.split("/")[1];
      if (role == "allocator") {
        this.status = v ? this.statuses.verified : this.statuses.rejected;
      }
    },
  },
};
</script>

<style>
</style>