<template>
  <div>
    <DataTable
      :value="serviceHistories"
      class="p-datatable-customers"
      :rows="5"
      dataKey="id"
      :paginator="serviceHistories.length >= 5 && !fetching"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords}  خدمت گذشته"
      responsiveLayout="stack"
    >
      <template #empty> اطلاعاتی وجود ندارد. </template>

      <Column header="متقاضی">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>متقاضی</p>
        </template>
        <template #body="{ data }">
          <div class="flex items-center justify-center gap-3">
            <Skeleton v-if="fetching" shape="circle" size="3rem" />
            <Avatar shape="circle" :image="data.applicant.avatar" v-else />
            <Skeleton v-if="fetching" />
            <p v-else>
              {{ data.applicant.firstname + " " + data.applicant.lastname }}
            </p>
          </div>
        </template>
      </Column>

      <Column header="خدمت دهنده" v-if="servant">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت دهنده</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.servant">
            <Skeleton v-if="fetching" shape="circle" size="3rem" />
            <Avatar shape="circle" :image="data.servant.avatar" v-else />

            <Skeleton v-if="fetching" />
            <p v-else>
              {{ data.servant.firstname + " " + data.servant.lastname }}
            </p>
          </div>
        </template>
      </Column>

      <Column header="خدمت">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.service }}</p>
        </template>
      </Column>

      <Column header="نشانی">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>نشانی</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.address }}</p>
        </template>
      </Column>

      <Column header=" تاریخ">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>تاریخ</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.date }}</p>
        </template>
      </Column>

      <Column header="وضعیت">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>وضعیت</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <Tag
            :value="statuses[data.status].title"
            :severity="statuses[data.status].severity"
            v-else
          />
        </template>
      </Column>

      <Column header="جزئیات">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>جزئیات</p>
        </template>
        <template #body="{ data, index }">
          <Skeleton v-if="fetching" />
          <Button
            class="p-button-text p-button-sm p-button-success"
            label="مشاهده"
            icon="pi pi-chevron-left"
            iconPos="right"
            @click="$refs.detailsDialog.open(data.id, index)"
            :loading="data.loading"
            v-else
          />
        </template>
      </Column>
    </DataTable>
    <PastServiceDetailsDialog ref="detailsDialog" />
  </div>
</template>

<script>
import MonitoringService from "../../../service/monitoring";
import PastServiceDetailsDialog from "./PastServiceDetailsDialog.vue";
export default {
  components: { PastServiceDetailsDialog },
  data() {
    return {
      monitoringService: null,
      fetching: true,
      loading: false,
      serviceHistories: [{}, {}, {}],
      statuses: {
        allocating: { title: " در انتظار تخصیص", severity: "info" },
        accepting: { title: " در انتظار پذیرش", severity: "info" },
        paying: { title: " در انتظار پرداخت", severity: "info" },
        doing: { title: " در انتظار انجام", severity: "success" },
        rating: { title: " در انتظار امتیاز دهی", severity: "warning" },
        calculating: { title: " در انتظار محاسبه", severity: "warning" },
        refined: { title: "تصفیه شده", severity: "info" },
        canceled: { title: " لغو شده", severity: "danger" },
        rejected: { title: " رد شده", severity: "danger" },
        expired: { title: "منقضی شده", severity: "danger" },
      },
    };
  },

  created() {
    this.monitoringService = new MonitoringService();
  },

  mounted() {
    this.monitoringService.getPastServices(
      (data) => {
        this.serviceHistories = data.serviceHistories;
        this.serviceHistories.forEach((element) => {
          let temp = "";
          delete element.address.country;
          Object.entries(element.address).forEach((element) => {
            if (element) {
              if (temp) temp += " , ";
              temp += element[1].title;
            }
          });
          element.address = temp;
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