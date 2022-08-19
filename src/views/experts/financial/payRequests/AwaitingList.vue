<template>
  <div class="reject flex flex-col gap-8">
    <DataTable
      ref="dt"
      :value="payRequests"
      dataKey="id"
      :rows="5"
      :paginator="payRequests.length > 5 && !fetching"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} در انتظار تسویه"
      responsiveLayout="stack"
    >
      <template #empty> اطلاعاتی موجود نیست </template>

      <Column header="درخواست دهنده">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>درخواست دهنده</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <Skeleton size="3rem" shape="circle" v-if="fetching" />
            <Avatar
              :image="data.user.avatar"
              shape="circle"
              size="large"
              v-else
            />

            <Skeleton v-if="fetching" />
            <p v-else>
              {{ data.user.firstname + " " + data.user.lastname }}
            </p>
          </div>
        </template>
      </Column>

      <Column header="مبلغ"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>مبلغ</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.amount }}</p>
        </template>
      </Column>

      <Column header="بانک"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>بانک</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.account.bank.title }}</p>
        </template>
      </Column>

      <Column header="شماره حساب"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>شماره حساب</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.account.number }}</p>
        </template>
      </Column>

      <Column header="تاریخ"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>تاریخ</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.date_created }}</p>
        </template>
      </Column>

      <Column class="w-1/5" header="عملیات"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>عملیات</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-4 items-center justify-center">
            <Skeleton v-if="fetching" />
            <Button
              icon="pi pi-credit-card"
              class="p-button-text p-button-success p-button-sm"
              label="تسویه حساب"
              :loading="loading"
              @click="$refs.payOfDialog.open(data)"
              v-else
            />
          </div>
        </template>
      </Column>
      <PayOfDialog ref="payOfDialog" @call="getPayRequests()" />
    </DataTable>
  </div>
</template>

<script>
import FinancialService from "../../../../service/financialExpert";
import PayOfDialog from "./PayOfDialog.vue";
export default {
  components: { PayOfDialog },
  data() {
    return {
      financialService: null,
      payRequests: [{}, {}, {}],
      fetching: true,
      loading: false,
    };
  },

  created() {
    this.financialService = new FinancialService();
  },

  mounted() {
    this.getPayRequests();
  },

  methods: {
    getPayRequests() {
      const status = "awaiting";
      this.financialService.getPayRequests(
        status,
        (data) => {
          this.payRequests = data.payRequests;
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

    payOf() {
      this.loading = true;
      const data = {};
      this.financialService.payOf(
        data,
        () => {
          this.loading = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "با موفقیت ثبت شد",
            life: 3000,
          });
        },
        (error) => {
          this.loading = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
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