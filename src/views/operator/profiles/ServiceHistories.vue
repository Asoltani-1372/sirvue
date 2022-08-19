<template>
  <div class="request flex flex-col gap-8">
    <DataTable
      ref="dt"
      :value="input"
      dataKey="id"
      :paginator="input.length > 5 && !fetching"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} زمانبندی"
      responsiveLayout="stack"
    >
      <template #empty>
        <p>موردی جهت نمایش وجود ندارد</p>
      </template>
      <Column :header="fetching ? '' : 'خدمت دهنده'" class="w-1/4">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت دهنده</p>
        </template>
        <template #body="{ data }">
          <div
            class="flex gap-3 items-center justify-start lg:w-auto"
            :class="{ 'w-full': fetching }"
          >
            <Skeleton
              shape="circle"
              size="3rem"
              v-if="fetching"
              class="hidden lg:block"
            />
            <Avatar
              :image="data.servant.avatar"
              shape="circle"
              size="large"
              v-else
              class="hidden lg:block"
            />
            <Skeleton v-if="fetching" />
            <div v-else>
              {{ data.servant.firstname }} {{ data.servant.lastname }}
            </div>
          </div>
        </template>
      </Column>
      <Column field="service" :header="fetching ? '' : 'خدمت '" class="w-1/4">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.service }}</p>
        </template>
      </Column>
      <Column field="date" :header="fetching ? '' : 'تاریخ'" class="w-1/4">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>تاریخ</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.date }}</p>
        </template>
      </Column>
      <Column field="status" :header="fetching ? '' : 'وضعیت'" class="w-1/4">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>وضعیت</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <Tag
            :value="statuses.value[data.status]"
            :severity="statuses.severity[data.status]"
            v-else
          />
        </template>
      </Column>
      <Column class="w-1/4" :header="fetching ? '' : 'جزئیات'">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>جزئیات</p>
        </template>
        <template #body="{ data, index }">
          <div class="flex gap-4 items-center justify-center">
            <Skeleton width="6rem" height="3rem" v-if="fetching" />
            <Button
              icon="pi pi-chevron-left"
              iconPos="right"
              class="p-button-text p-button-success p-button-sm"
              label="جزئیات"
              @click="details(data.id, index)"
              v-else
              :loading="data.loading"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <DetailsDialog ref="detailsDialog" />
  </div>
</template>

<script>
import DetailsDialog from "../../applicant/serviceHistories/serviceHistoryDialog.vue";
export default {
  props: ["input"],
  components: { DetailsDialog },
  data() {
    return {
      fetching: false,
      statuses: {
        value: {
          allocating: "در انتظار تخصیص",
          accepting: "در انتظار پذیرش",
          coordinating: "در انتظار هماهنگی",
          paying: "در انتظار پرداخت",
          doing: "در انتظار انجام",
          rating: "در انتظار امتیاز دهی ",
          calculating: "در انتظار محاسبه",
          refined: "تصفیه شده",
          canceled: "لغو شده",
          rejected: "رد شده",
          verifying: "در انتظار صدور مجوز",
        },
        severity: {
          allocating: "info",
          accepting: "info",
          paying: "info",
          coordinating: "warning",
          doing: "success",
          rating: "warning ",
          calculating: "warning",
          refined: "info",
          canceled: "danger",
          rejected: "danger",
          verifying: "info",
        },
      },
    };
  },

  methods: {
    details(id, index) {
      //this.input[index].loading = true;
      this.$refs.detailsDialog.open(id, index);
    },
  },
};
</script>

<style scoped>
</style>
