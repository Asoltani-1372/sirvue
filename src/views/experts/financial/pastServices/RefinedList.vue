<template>
  <div>
    <DataTable
      ref="dt"
      :value="serviceHistories"
      dataKey="id"
      :rows="5"
      :paginator="serviceHistories.length > 5 && !fetching"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} تصفیه شده"
      responsiveLayout="stack"
    >
      <template #empty> اطلاعاتی موجود نیست </template>

      <Column header="خدمت دهنده">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>خدمت دهنده</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <Skeleton size="3rem" shape="circle" v-if="fetching" />
            <Avatar :image="data.servant.avatar" shape="circle" v-else />

            <Skeleton v-if="fetching" />
            <p v-else>
              {{ data.servant.firstname + " " + data.servant.lastname }}
            </p>
          </div>
        </template>
      </Column>

      <Column header="متقاضی">
        <template #header>
          <Skeleton v-if="fetching" />
          <p v-else>متقاضی</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <Skeleton v-if="fetching" size="3rem" shape="circle" />
            <Avatar :image="data.applicant.avatar" shape="circle" v-else />
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

      <Column header="مبلغ کل"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>مبلغ کل</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.price }}تومان</p>
        </template>
      </Column>

      <Column header="سهم خدمت دهنده"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>سهم خدمت دهنده</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.share }} تومان</p>
        </template>
      </Column>

      <Column header="تاریخ تصفیه"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>تاریخ تصفیه</p>
        </template>
        <template #body="{ data }">
          <Skeleton v-if="fetching" />
          <p v-else>{{ data.dates.refined }}</p>
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
    this.financialService.getList(
      "refined",
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
};
</script>

<style scoped>
</style>