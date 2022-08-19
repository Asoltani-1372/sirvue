<template>
  <Card>
    <template #title>
      <Skeleton v-if="fetching" />
      <div v-else>تراکنش ها</div>
    </template>
    <template #content>
      <DataTable
        ref="dt"
        :value="transactions"
        dataKey="id"
        :rows="5"
        :paginator="transactions.length > 5 && !fetching"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} تراکنش"
        responsiveLayout="stack"
      >
        <template #empty>
          <p class="text-xs py-2">تراکنشی وجود ندارد</p>
        </template>
        <Column :header="fetching ? '' : 'شماره تراکنش'">
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>شماره تراکنش</p>
          </template>
          <template #body="{ data }">
            <Skeleton v-if="fetching" />
            <div v-else>{{ data.transaction || 0 }}</div>
          </template>
        </Column>

        <Column :header="fetching ? '' : 'مبلغ'">
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>مبلغ</p>
          </template>
          <template #body="{ data }">
            <Skeleton v-if="fetching" />
            <p
              v-else
              :class="
                data.amount.indexOf('-') > -1
                  ? 'text-red-500'
                  : 'text-green-500'
              "
              dir="ltr"
            >
              {{ data.amount.replace("-", "") }}
            </p>
          </template>
        </Column>

        <Column :header="fetching ? '' : 'تاریخ'">
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>تاریخ</p>
          </template>
          <template #body="{ data }">
            <Skeleton v-if="fetching" />
            <div v-else>{{ data.date }}</div>
          </template>
        </Column>

        <Column :header="fetching ? '' : 'نوع تراکنش'">
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>نوع تراکنش</p>
          </template>
          <template #body="{ data }">
            <Skeleton v-if="fetching" />
            <Tag
              :severity="data.status.severity"
              :value="data.status.value"
              v-else
            />
          </template>
        </Column>

        <Column :header="fetching ? '' : 'توضیحات '">
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>توضیحات </p>
          </template>
          <template #body="{ data }">
            <Skeleton v-if="fetching" />
            <p>{{data.desc}}</p>
          </template>
        </Column>

        <!-- <Column :header="fetching ? '' : 'جزئیات'" class="w-1/12 hidden">
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>جزئیات</p>
          </template>
          <template #body>
            <Skeleton v-if="fetching" />
            <Button
              class="p-button-primary p-button-sm p-button-text"
              icon="pi pi-chevron-left"
              iconPos="right"
              label="مشاهده"
              v-else
            />
          </template>
        </Column> -->
      </DataTable>
    </template>
  </Card>
</template>

<script>
import FinancialService from "../../service/financial.js";

export default {
  data() {
    return {
      financialService: null,
      fetching: true,
      loading: false,
      transactions: [{}, {}, {}],
      statuses: {
        getway: { value: "درحال پرداخت", severity: "info" },
        error: { value: "خطای تراکنش", severity: "warning" },
        canceled: { value: "لغو شده", severity: "danger" },
        deposited: { value: "شارژ کیف پول", severity: "success" },
        paid: { value: "هزینه خدمت", severity: "info" },
        refined: { value: "تصفیه شده", severity: "success" },
        cleared: { value: "تسویه شده", severity: "primary" },
        earnest: { value: "بیعانه خدمت", severity: "info" },
        cashed: { value: "پرداخت در محل", severity: "primary" },
        deducted: { value: " کسر از کیف پول", severity: "danger" },
      },
    };
  },

  created() {
    this.financialService = new FinancialService();
  },

  mounted() {
    this.financialService.getTransactions(
      (data) => {
        this.transactions = data.transactions;
        this.transactions.forEach((element) => {
          element.status = this.statuses[element.status];
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

  methods: {},
};
</script>

<style>
</style>