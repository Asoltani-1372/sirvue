<template>
  <div class="p-card p-5">
    <div class="flex justify-between">
      <div
        class="identity-column"
        v-for="(data, index) in columns"
        :key="index"
      >
        <div class="identity-profile" v-if="index == 'profile'">
          <Skeleton shape="circle" size="3rem" v-if="fetching" />
          <Avatar :image="data.avatar" shape="circle" sizw="large" v-else />
          <Skeleton width="15rem" v-if="fetching" />
          <p v-else>
            {{ data.firstname + " " + data.lastname }} ({{ data.role }})
          </p>
        </div>
        <div v-else>
          <Skeleton width="15rem" v-if="fetching" />
          <div v-else>
            <Tag
              :value="data.value"
              :severity="data.severity"
              v-if="index == 'status'"
            />
            <p v-else>{{ data }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      fetching: true,
      columns: {
        profile: null,
        phone: null,
        date: null,
        status: null,
      },
      statuses: {
        verified: { value: "احراز شده", severity: "success" },
        rejected: { value: "رد شده", severity: "danger" },
        checking: { value: "درانتظار بررسی", severity: "warning" },
      },
      roles: {
        applicant: "متقاضی",
        servant: "خدمت دهنده",
      },
    };
  },
  watch: {
    input(v) {
      if (v) {
        this.columns = v.identity;
        this.columns.status = this.statuses[this.columns.status];
        this.columns.profile.role = this.roles[this.columns.profile.role];
        this.fetching = false;
      }
    },
  },
};
</script>

<style scoped>
.identity-column {
  @apply flex flex-col gap-12 justify-center items-center px-4;
}

.identity-profile {
  @apply flex items-center justify-center gap-3;
}
</style>