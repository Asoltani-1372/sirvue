<template>
  <div>
    <Card>
      <template #title>درخواست های جاری</template>
      <template #content>
        <DataTable
          :value="serviceRequests"
          class="p-datatable-customers"
          :rows="10"
          dataKey="id"
          :paginator="serviceRequests.length >= 10 && !fetching"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} درخواست "
          responsiveLayout="stack"
        >
          <template #empty>
            <p>موردی جهت نمایش وجود ندارد.</p>
          </template>
          <Column header="متقاضی"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>متقاضی</p>
            </template>
            <template #body="{ data }">
              <div class="flex items-center justify-start gap-3">
                <Skeleton v-if="fetching" shape="circle" size="3rem" />
                <Avatar shape="circle" :image="data.applicant.avatar" v-else />
                <Skeleton v-if="fetching" />
                <p v-else>
                  {{ data.applicant.firstname + " " + data.applicant.lastname }}
                </p>
              </div>
            </template>
          </Column>

          <Column header="خدمت دهنده"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>خدمت دهنده</p>
            </template>
            <template #body="{ data }">
              <div class="flex items-center justify-start gap-3">
                <Skeleton v-if="fetching" shape="circle" size="3rem" />
                <Avatar shape="circle" :image="data.servant.avatar" v-else />
                <Skeleton v-if="fetching" />
                <p v-else>
                  {{ data.servant.firstname + " " + data.servant.lastname }}
                </p>
              </div>
            </template>
          </Column>

          <Column header="خدمت"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>خدمت</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.service }}</p>
            </template>
          </Column>

          <Column header="نشانی"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>نشانی</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.address }}</p>
            </template>
          </Column>

          <Column header="وضعیت"
            ><template #header>
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

          <Column header="جزئیات"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>جزئیات</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <Button
                class="p-button-text p-button-sm p-button-success"
                label="مشاهده"
                iconPos="right"
                icon="pi pi-chevron-left"
                v-else
                @click="$refs.detailsDialog.open(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <DetailsDialog ref="detailsDialog" />
  </div>
</template>
 
<script>
import ServiceRequestsService from "../../service/operator/serviceRequests.js";
import DetailsDialog from "../../views/operator/currentRequests/DetailsDialog.vue";
export default {
  components: { DetailsDialog },
  data() {
    return {
      serviceRequestsService: null,
      fetching: true,
      loading: false,
      serviceRequests: [{}, {}, {}],
      prefix: {
        country: "کشور",
        province: "استان",
        township: "شهرستان",
        region: "بخش",
        city: "شهر",
        hamlet: "دهستان",
        village: "روستا",
      },
      statuses: {
        value: {
          allocating: "در انتظار تخصیص",
          accepting: "در انتظار پذیرش",
          paying: "در انتظار پرداخت",
          doing: "در انتظار انجام",
          rating: "در انتظار امتیاز دهی ",
          calculating: "در انتظار محاسبه",
          refined: "تصفیه شده",
          canceled: "لغو شده",
          rejected: "رد شده",
        },
        severity: {
          allocating: "info",
          accepting: "info",
          paying: "info",
          doing: "success",
          rating: "warning ",
          calculating: "warning",
          refined: "info",
          canceled: "danger",
          rejected: "danger",
        },
      },
    };
  },

  created() {
    this.serviceRequestsService = new ServiceRequestsService();
  },

  mounted() {
    this.serviceRequestsService.getServiceRequests(
      (data) => {
        this.serviceRequests = data.serviceRequests;
        this.serviceRequests.forEach((element) => {
          Object.entries(element.address).forEach((element2) => {
            element.address =
              this.prefix[element2[0]] + " " + element2[1].title;
          });
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