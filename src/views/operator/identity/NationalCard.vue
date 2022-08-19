<template>
  <Card class="lg:w-2/3">
    <template #title>
      <div class="flex justify-between">
        <Skeleton width="10rem" height="2rem" v-if="fetching" />
        <p v-else>کارت ملی</p>
        <Skeleton width="5rem" height="2rem" v-if="fetching" />
        <Tag v-else :value="status.value" :severity="status.severity" />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col items-center gap-8">
        <Skeleton width="24rem" height="16rem" v-if="fetching" />
        <Image
          :src="image"
          alt="تصویر کارت ملی"
          class="w-96 h-64 overflow-hidden"
          v-else
          preview
        />
        <div class="flex gap-3">
          <Skeleton width="3rem" v-if="fetching" />
          <p v-else>کدملی :</p>
          <Skeleton width="10rem" v-if="fetching" />
          <p v-else class="font-bold">{{ code }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-3">
        <Skeleton width="5.6rem" height="2.75rem" v-if="fetching" />
        <Button
          label="بازگشت به فهرست احراز هویت"
          class="p-button-info p-button-sm p-button-text"
          icon="pi pi-angle-right"
          @click="$router.push('/' + $route.path.split('/')[1] + '/identities')"
          v-else
        />
        <div class="flex gap-3">
          <Skeleton width="5.6rem" height="2.75rem" v-if="fetching" />
          <ToggleButton
            v-else-if="$route.path.split('/')[1] == 'allocator'"
            v-model="verification"
            onLabel="تایید"
            offLabel="تایید"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            class="p-button-sm"
            :disabled="loading"
          />
          <Skeleton width="5.125rem" height="2.75rem" v-if="fetching" />
          <div v-else>
            <Button
              label="ثبت نهایی"
              class="p-button-info p-button-sm p-button-success"
              icon="pi pi-angle-check"
              iconPos="left"
              @click="complete()"
              v-if="role == 'applicant'"
              :loading="loading"
            />
            <Button
              label="بعدی"
              class="p-button-info p-button-sm p-button-text"
              icon="pi pi-angle-left"
              iconPos="right"
              @click="nextPage()"
              :disabled="loading"
              v-else
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
      code: null,
      image: null,
      role: null,
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
    nextPage() {
      this.$emit("nextPage", {
        formData: {
          nationalCard: this.verification,
        },
        pageIndex: 0,
      });
      this.status = this.verification
        ? this.statuses.verified
        : this.statuses.rejected;
    },
    complete() {
      this.loading = true;
      const role = this.$route.path.split("/")[1];
      if (role == "allocator") {
        this.status = this.verification
          ? this.statuses.verified
          : this.statuses.rejected;
      }
      this.$emit("complete", {
        formData: {
          nationalCard: this.verification,
        },
        pageIndex: 3,
      });
    },
  },

  watch: {
    input(v) {
      if (v) {
        const nationalCard = this.input.nationalCard;
        this.image = nationalCard.image;
        this.code = nationalCard.code;
        this.role = this.input.identity.profile.role;
        this.status = this.statuses[nationalCard.status];
        if (nationalCard.status != "checking")
          this.verification = nationalCard.status == "verified";
        this.fetching = false;
      }
    },
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