<template>
  <div>
    <Card>
      <template #title>
        <Skeleton width="10rem" height="2rem" v-if="fetching" />
        <div v-else>سابقه خدمات</div>
      </template>
      <template #content>
        <DataTable
          :value="serviceHistories"
          class="p-datatable-customers"
          :rows="10"
          dataKey="id"
          :paginator="serviceHistories.length >= 10 && !fetching"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords}  سابقه خدمت"
          responsiveLayout="stack"
        >
          <template #empty>
            <p>موردی جهت نمایش وجود ندارد.</p>
          </template>

          <Column :header="fetching ? '' : 'متقاضی'"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>متقاضی</p>
            </template>
            <template #body="{ data }">
              <div
                class="flex items-center justify-start gap-3"
                :class="{ 'w-full': fetching }"
              >
                <Skeleton
                  v-if="fetching"
                  shape="circle"
                  size="3rem"
                  class="hidden lg:block"
                />
                <Avatar
                  shape="circle"
                  :image="data.applicant.avatar"
                  v-else
                  class="hidden lg:block"
                />
                <Skeleton v-if="fetching" class="min-w-full" />
                <p v-else>
                  {{ data.applicant.firstname + " " + data.applicant.lastname }}
                </p>
              </div>
            </template>
          </Column>

          <Column :header="fetching ? '' : 'خدمت دهنده'">
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>خدمت دهنده</p>
            </template>

            <template #body="{ data }">
              <div
                class="flex items-center justify-start gap-3"
                :class="{ 'w-full': fetching }"
              >
                <Skeleton
                  v-if="fetching"
                  shape="circle"
                  size="3rem"
                  class="hidden lg:block"
                />
                <Avatar
                  shape="circle"
                  :image="data.servant.avatar"
                  v-else
                  class="hidden lg:block"
                />

                <Skeleton v-if="fetching" class="min-w-full" />
                <p v-else>
                  {{ data.servant.firstname + " " + data.servant.lastname }}
                </p>
              </div>
            </template>
          </Column>

          <Column :header="fetching ? '' : 'خدمت '"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>خدمت</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.service }}</p>
            </template>
          </Column>

          <Column :header="fetching ? '' : 'نشانی'"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>نشانی</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.address }}</p>
            </template>
          </Column>

          <Column :header="fetching ? '' : 'تاریخ درخواست'"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>تاریخ انجام</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.dates.created }}</p>
            </template>
          </Column>

          <Column :header="fetching ? '' : 'وضعیت'"
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

          <Column :header="fetching ? '' : 'جزئیات'"
            ><template #header>
              <Skeleton v-if="fetching" />
              <p v-else>جزئیات</p>
            </template>
            <template #body="{ data, index }">
              <div class="flex justify-center" v-if="fetching">
                <Skeleton width="6rem" height="2.5rem" />
              </div>
              <Button
                class="p-button-text p-button-sm p-button-success"
                label="مشاهده"
                iconPos="right"
                icon="pi pi-chevron-left"
                :loading="data.loading"
                @click="$refs.detailsDialog.open(data.id, index)"
                v-else
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
import ServiceHistoryService from "../../service/operator/serviceHistories.js";
import DetailsDialog from "../../views/operator/serviceHistories/DetailsDialog.vue";
export default {
  components: { DetailsDialog },
  data() {
    return {
      serviceHistoryService: null,
      fetching: true,
      loading: false,
      serviceHistories: [{}, {}, {}],
      statuses: {
        value: {
          allocating: "در انتظار تخصیص",
          accepting: "در انتظار پذیرش",
          paying: "در انتظار پرداخت",
          doing: "در انتظار انجام",
          rating: "در انتظار امتیاز دهی ",
          calculating: "در انتظار محاسبه",
          expired: "منقضی شده",
          canceled: "لغو شده",
          rejected: "رد شده",
          refined: "تصفیه شده",
        },
        severity: {
          allocating: "info",
          accepting: "info",
          paying: "info",
          doing: "success",
          rating: "warning ",
          calculating: "warning",
          expired: "danger",
          canceled: "danger",
          rejected: "danger",
          refined: "info",
        },
      },
      prefix: {
        country: "کشور",
        province: "استان",
        township: "شهرستان",
        region: "بخش",
        city: "شهر",
        hamlet: "دهستان",
        village: "روستا",
      },
    };
  },

  created() {
    this.serviceHistoryService = new ServiceHistoryService();
  },

  mounted() {
    this.serviceHistoryService.getServiceHistories(
      (data) => {
        this.serviceHistories = data.serviceHistories;
        this.serviceHistories.forEach((element) => {
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