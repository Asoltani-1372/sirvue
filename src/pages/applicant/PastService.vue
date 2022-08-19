<template>
  <div class="request flex flex-col gap-8">
    <Card>
      <template #title>
        <div class="flex items-center gap-3">
          <Skeleton width="10rem" height="1.5rem" v-if="fetching" />
          <p v-else>سابقه خدمات</p>
        </div>
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="serviceHistories"
          dataKey="id"
          :paginator="serviceHistories.length > 5 && !fetching"
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
          <Column
            field="service"
            :header="fetching ? '' : 'خدمت '"
            class="w-1/4"
          >
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
          <Column
            field="status"
            :header="fetching ? '' : 'وضعیت'"
            class="w-1/4"
          >
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>وضعیت</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <Tag
                :value="data.status.value"
                :severity="data.status.severity"
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
      </template>
    </Card>
    <DetailsDialog ref="detailsDialog" />
  </div>
</template>

<script>
import DetailsDialog from "../../views/applicant/serviceHistories/serviceHistoryDialog.vue";
import ServiceRequestService from "../../service/applicant/serviceRequestService.js";
export default {
  components: { DetailsDialog },
  data() {
    return {
      serviceRequestService: null,
      fetching: true,
      serviceHistories: [{}, {}, {}, {}, {}],
      statuses: {
        canceled: { value: "لغو شده", severity: "danger" },
        rejected: { value: "رد شده", severity: "danger" },
        expired: { value: "منقضی شده", severity: "danger" },
        completed: { value: "انجام شده", severity: "success" },
      },
    };
  },

  methods: {
    details(id, index) {
      this.serviceHistories[index].loading = true;
      this.$refs.detailsDialog.open(id, index);
    },
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },

  mounted() {
    this.serviceRequestService.getServiceHistories(
      (data) => {
        this.fetching = false;
        this.serviceHistories = data.serviceHistories;
        this.serviceHistories.forEach((element) => {
          element.status = this.statuses[element.status];
        });
      },
      (error) => {
        this.$toast.add({
          severity: "error",
          summery: "خطا",
          detail: error,
          life: 3000,
        });
      }
    );
  },
};
</script>

<style scoped>
</style>
