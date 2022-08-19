<template>
  <div>
    <DataTable
      ref="dt"
      :value="serviceHistories"
      dataKey="id"
      :rows="5"
      :paginator="serviceHistories.length > 5 && !fetching"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} محاسبه شده"
      responsiveLayout="stack"
    >
      <template #empty> اطلاعاتی موجود نیست </template>

      <Column header="خدمت دهنده"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت دهنده</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <Skeleton size="3rem" shape="circle" v-if="fetching" />
            <Avatar
              :image="data.servant.avatar"
              shape="circle"
              size="large"
              v-else
            />

            <Skeleton v-if="fetching" />
            <p v-else>
              {{ data.servant.firstname + " " + data.servant.lastname }}
            </p>
          </div>
        </template>
      </Column>

      <Column header="متقاضی"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>متقاضی</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <Skeleton v-if="fetching" size="3rem" shape="circle" />
            <Avatar
              :image="data.applicant.avatar"
              shape="circle"
              size="large"
              v-else
            />
            <Skeleton v-if="fetching" />
            <p v-else>
              {{ data.applicant.firstname + " " + data.applicant.lastname }}
            </p>
          </div>
        </template>
      </Column>

      <Column header="نوع خدمت"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>نوع خدمت</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.service }}</p>
        </template>
      </Column>

      <Column header="مبلغ"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>مبلغ</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.total }} تومان</p>
        </template>
      </Column>

      <Column header="تاریخ"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>تاریخ</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <div v-else>{{ data.dates.rated }}</div>
        </template>
      </Column>

      <Column class="w-1/5" header="عملیات">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>عملیات</p>
        </template>
        <template #body="{ data, index }">
          <div class="flex gap-4 items-center justify-center">
            <Skeleton v-if="fetching" />
            <Button
              icon="pi pi-check"
              class="p-button-outlined p-button-success p-button-sm"
              label="تصفیه"
              :loading="data.loading"
              @click="refine(index, data.id)"
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
      serviceHistories: [{}, {}, {}],
      fetching: true,
    };
  },

  created() {
    this.financialService = new FinancialService();
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.fetching = true;
      this.financialService.getList(
        "calculated",
        (data) => {
          this.serviceHistories = data.serviceHistories;
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

    refine(index, id) {
      this.$confirm.require({
        message: "آیا از تصفیه ابن خدمت اطمینان دارید؟",
        header: "تصفبه حساب",
        acceptLabel: "تصفیه شود",
        acceptIcon: "pi pi-check",
        acceptClass: "p-button-success p-button-sm float-left",
        rejectLabel: "بازگشت",
        icon: "pi pi-info-circle",
        accept: () => {
          this.serviceHistories[index].loading = true;
          this.financialService.refine(
            id,
            () => {
              this.serviceHistories[index].loading = false;
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "با موفقیت تصفیه شد",
                life: 3000,
              });
              this.getList();
            },
            (error) => {
              this.serviceHistories[index].loading = false;
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