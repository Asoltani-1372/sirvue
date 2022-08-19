<template>
  <div class="reject flex flex-col gap-8">
    <DataTable
      ref="dt"
      :value="payRequests"
      dataKey="id"
      :rows="5"
      :paginator="payRequests.length > 5 && !fetching"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} درخواست تسویه"
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
          <p v-else>{{ data.amount }} تومان</p>
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
        <template #body="{ data, index }">
          <div class="flex gap-4 items-center justify-center">
            <Skeleton v-if="fetching" />
            <Button
              icon="pi pi-check"
              class="p-button-text p-button-success p-button-sm"
              label="تایید درخواست"
              :loading="data.loading"
              @click="confirmRequest(index, data.id)"
              v-else
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import FinancialService from "../../../../service/financialExpert";
export default {
  data() {
    return {
      financialService: null,
      payRequests: [{}, {}, {}],
      fetching: true,
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
      this.fetching = true;
      const status = "request";
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

    confirmRequest(index, id) {
      this.$confirm.require({
        header: "تایید درخواست",
        message: "آیا از تایید این درخواست اطمینان دارید?",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "تایید شود",
        acceptIcon: "pi pi-check",
        acceptClass: "p-button-success float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.payRequests[index].loading = true;
          this.financialService.confirmRequest(
            id,
            () => {
              this.payRequests[index].loading = false;

              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "با موفقیت تایید شد.",
                life: 3000,
              });
              this.getPayRequests();
            },
            (error) => {
              this.payRequests[index].loading = false;
              this.$toast.add({
                severity: "error",
                summary: "خطا",
                detail: error,
                life: 3000,
              });
            }
          );
        },
        reject: () => {},
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