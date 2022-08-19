<template>
  <div class="past flex flex-col gap-8">
    <DataTable
      class="text-xs"
      :value="requestsList"
      dataKey="id"
      :paginator="requestsList.length > 10"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} درخواست"
      responsiveLayout="stack"
    >
      <template #empty>
        <p class="text-center w-full text-sm py-4">
          موردی جهت نمایش وجود ندارد
        </p>
      </template>
      <Column header="متقاضی" class="w-1/6"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>متقاضی</p>
        </template>
        <template #body="{ data }">
          <div
            class="flex gap-3 items-center justify-center lg:w-auto"
            :class="{ 'w-full': fetching }"
          >
            <Avatar
              :image="data.applicant.avatar"
              size="large"
              class="hidden lg:flex"
              v-if="data.id"
              shape="circle"
            />
            <Skeleton
              shape="circle"
              width="3rem"
              height="3rem"
              v-else
              class="hidden lg:flex"
            />
            <div class="flex flex-col gap-2 justify-center flex-grow">
              <p v-if="data.applicant" class="text-right">
                {{ data.applicant.firstname }} {{ data.applicant.lastname }}
              </p>
              <Skeleton class="min-w-full" v-else />
            </div>
          </div>
        </template>
      </Column>
      <Column header="خدمت دهنده" class="w-1/6"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت دهنده</p>
        </template>
        <template #body="{ data }">
          <div
            class="flex gap-3 items-center justify-center lg:w-auto"
            :class="{ 'w-full': fetching }"
          >
            <Avatar
              :image="data.servant.avatar"
              size="large"
              class="hidden lg:flex"
              v-if="data.id"
              shape="circle"
            />
            <Skeleton
              shape="circle"
              width="3rem"
              height="3rem"
              v-else
              class="hidden lg:block"
            />

            <div class="flex flex-col gap-2 justify-center flex-grow">
              <p v-if="data.servant" class="text-right">
                {{ data.servant.firstname }} {{ data.servant.lastname }}
              </p>
              <Skeleton class="min-w-full" v-else />
            </div>
          </div>
        </template>
      </Column>
      <Column header="نشانی" class="w-1/6"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>نشانی</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.address">{{ data.address }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column header="خدمت" class="w-1/6"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.service">{{ data.service }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column header="تاریخ" class="w-1/6"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>تاریخ</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.date">{{ data.date }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column
        header="فرم پروازی"
        class="w-1/5"
        v-if="$route.path.split('/')[1] == 'flight'"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>فرم پروازی</p>
        </template>
        <template #body="{ data }">
          <Button
            v-if="data.status"
            label="پرینت فرم پروازی"
            class="p-button-sm p-button-success whitespace-nowrap"
            @click="openUrl(data.id)"
          />
          <Skeleton v-else />
        </template>
      </Column>
      <Column header="وضعیت" class="w-1/6"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>وضعیت</p>
        </template>
        <template #body="{ data }">
          <Tag
            class="whitespace-nowrap"
            v-if="data.status"
            :value="data.status.title"
            :severity="data.status.severity"
          />
          <Skeleton v-else />
        </template>
      </Column>
      <Column class="w-1/6" header="جزئیات"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>جزئیات</p>
        </template>
        <template #body="{ data }">
          <div
            class="flex gap-4 items-center justify-center"
            v-if="data.status"
          >
            <Button
              icon="pi pi-chevron-left"
              iconPos="right"
              class="
                p-button-text p-button-success p-button-sm
                whitespace-nowrap
              "
              :label="
                $route.path.split('/')[1] == 'flight' ? 'نقشه پرواز' : 'مشاهده'
              "
              @click="$refs.detailsDialog.open(data)"
            />
          </div>
          <Skeleton v-else />
        </template>
      </Column>
    </DataTable>
    <DetailsDialog ref="detailsDialog" />
  </div>
</template>

<script>
import DetailsDialog from "./DetailsDialog.vue";
import AllocatorService from "../../../service/allocator";

export default {
  components: { DetailsDialog },
  data() {
    return {
      allocatorService: null,
      requestsList: [{}, {}, {}],
      statuses: {
        canceled: { title: "لغو شده", severity: "warning" },
        rejected: { title: "رد شده", severity: "danger" },
        completed: { title: "تکمیل شده", severity: "info" },
        expired: { title: "منقضی شده", severity: "danger" },
      },
      fetching: true,
    };
  },

  created() {
    this.allocatorService = new AllocatorService();
  },

  mounted() {
    this.allocatorService.getHistories(
      (data) => {
        this.requestsList = data.serviceHistories;
        this.requestsList.forEach((element) => {
          element.status = this.statuses[element.status];
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
        this.showPagination = true;
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
  methods: {
    openUrl(id) {
      const token = localStorage.getItem("token");
      const url =
        window.location.origin + "/sirang/flightInfo/" + id + "?t=" + token;
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
.p-button-xs {
  @apply w-10 h-10 text-sm !important;
}
</style>

<style>
th:last-child > div {
  @apply justify-center !important;
}
.p-datatable .p-datatable-thead > tr > th {
  @apply text-gray-800 !important;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-paginator {
  direction: ltr;
  @apply flex-row-reverse gap-px;
}
.p-paginator > button {
  @apply transform rotate-180;
}
</style>