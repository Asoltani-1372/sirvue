<template>
  <Card>
    <template #title>
      <p>احراز هویت</p>
    </template>
    <template #content>
      <DataTable
        :value="identities"
        :rows="10"
        dataKey="id"
        :paginator="identities.length >= 10 && !fetching"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20]"
        currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} احراز هویت"
        responsiveLayout="stack"
      >
        <template #empty>
          <p class="text-xs py-2">درحال حاضر موردی موجود نیست.</p>
        </template>
        <Column v-for="col in columns" :key="col">
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>{{ col.title }}</p>
          </template>
          <template #body="{ data }">
            <div
              class="flex items-center justify-center gap-4"
              v-if="col.value == 'user'"
            >
              <Skeleton shape="circle" size="3rem" v-if="fetching" />
              <Avatar
                :image="data.user.avatar"
                shape="circle"
                size="large"
                v-else
              />
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.user.firstname }} {{ data.user.lastname }}</p>
            </div>
            <div v-if="col.value == 'date'">
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.date }}</p>
            </div>
            <div v-if="col.value == 'status'">
              <Skeleton v-if="fetching" />
              <Tag
                v-else
                :value="data.status.value"
                :severity="data.status.severity"
              />
            </div>
            <div class="flex justify-center" v-if="col.value == 'action'">
              <Skeleton height="2rem" width="4rem" v-if="fetching" />
              <Button
                v-else
                class="p-button-success p-button-text"
                icon="pi pi-angle-left"
                iconPos="right"
                label="مشاهده"
                @click="showDegrees(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script>
import IdentitiesService from "../../service/operator/identities.js";
export default {
  data() {
    return {
      identitiesService: null,
      columns: [
        { title: "کاربر", value: "user" },
        { title: "تاریخ درخواست", value: "date" },
        { title: "وضعیت", value: "status" },
        { title: "عملیات", value: "action" },
      ],
      identities: [{}, {}, {}],
      fetching: true,
      statuses: {
        checking: { value: "درانتظار بررسی", severity: "warning" },
        verified: { value: "احراز شده", severity: "success" },
        rejected: { value: "رد شد", severity: "danger" },
      },
    };
  },

  created() {
    this.identitiesService = new IdentitiesService();
  },
  methods: {
    showDegrees(id) {
      this.$router.push(
        this.$route.path.replace("identities", "") +
          "identity/" +
          id +
          "/national-card"
      );
    },
  },
  mounted() {
    this.identitiesService.getIdentities(
      (data) => {
        this.identities = data.identities;
        this.identities.forEach((element) => {
          element.status = this.statuses[element.status];
        });
        this.fetching = false;
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
};
</script>

<style>
</style>