<template>
  <div class="pending flex flex-col gap-8">
    <DataTable
      ref="dt"
      :value="serviceRequestsList"
      dataKey="id"
      :paginator="!fetching && serviceRequestsList.length > 5"
      :rows="10"
      responsiveLayout="stack"
    >
      <template #empty>
        <p class="text-xs py-4 text-center w-full">
          موردی جهت نمایش وجود ندارد
        </p>
      </template>
      <Column :header="fetch ? '' : 'متقاضی'" class="w-1/5">
        <template #header>
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
              class="hidden lg:block"
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
              <p v-if="data.applicant" class="text-right">
                {{ data.applicant.firstname }} {{ data.applicant.lastname }}
              </p>
              <Skeleton class="min-w-full" v-else />
            </div>
          </div>
        </template>
      </Column>
      <Column field="address" :header="fetch ? '' : 'نشانی'" class="w-1/6">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>نشانی</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.address">{{ data.address }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column :header="fetch ? '' : 'خدمت'" class="w-1/6">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.service">{{ data.service }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column :header="fetch ? '' : 'تاریخ'" class="w-1/6">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>تاریخ</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.date">{{ data.date }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column :header="fetch ? '' : 'قیمت'" class="w-1/6">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>قیمت</p>
        </template>
        <template #body="{ data }">
          <div v-if="data.total">{{ data.total }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column :header="fetch ? '' : 'وضعیت'" class="w-1/5">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>وضعیت</p>
        </template>
        <template #body="{ data }">
          <Tag
            v-if="data.tag"
            class="whitespace-nowrap"
            :severity="data.tag.severity"
            :value="data.tag.title"
          />
          <Skeleton v-else />
        </template>
      </Column>
      <Column class="w-1/6" :header="fetch ? '' : 'جزئیات'">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>جزئیات</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-4 items-center justify-center" v-if="data.id">
            <Button
              icon="pi pi-chevron-left"
              iconPos="right"
              class="p-button-text p-button-success p-button-sm"
              label="مشاهده"
              @click="$refs.detailsDialog.open(data)"
            />
          </div>
          <Skeleton width="12rem" height="2.5rem" v-else />
        </template>
      </Column>
    </DataTable>
    <DetailsDialog ref="detailsDialog" @call="changeStatus" :reasons="reasons"/>
  </div>
</template>

<script>
import DetailsDialog from "./DetailsDialog.vue";
import ServiceRequestService from "../../../service/servant/ServiceRequests.js";
export default {
  components: { DetailsDialog },
  data() {
    return {
      fetch: true,
      serviceRequestsList: [{}, {}, {}],
      reasons: null,
      serviceRequestService: null,
      statuses: {
        doing: { severity: "warning", title: "در انتظار انجام" },
        rating: { severity: "success", title: "در انتظار تایید کشاورز" },
        
      },
    };
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  mounted() {
    const status = ["doing", "rating"];
    this.serviceRequestService.getList(
      status,
      (data) => {
        this.serviceRequestsList = data.serviceRequests;
        this.reasons = data.reasons;
        this.serviceRequestsList.forEach((element) => {
          element.tag = this.statuses[element.status];
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
        this.fetch = false;
        this.$emit("call", data.message);
      },
      () => {
        this.serviceRequestsList = [];
      }
    );
  },
  methods: {
    changeStatus(id) {
      this.serviceRequestsList.forEach((element) => {
        if (element.id == id) {
          element.tag = this.statuses.rating;
        }
      });
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
.list-timings {
  @apply w-8/12;
}

.list-timings td {
  @apply text-right !important;
}
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