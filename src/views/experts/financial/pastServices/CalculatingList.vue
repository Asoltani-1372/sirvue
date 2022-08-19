<template>
  <div>
    <DataTable
      ref="dt"
      :value="serviceHistories"
      dataKey="id"
      :rows="5"
      :paginator="serviceHistories.length > 5 && !fetching"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} محاسبه جدید"
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
            <Avatar :image="data.servant.avatar" shape="circle" size="large" v-else />

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
            <Avatar :image="data.applicant.avatar" shape="circle" size="large" v-else />
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

      <Column class="w-1/5" header="عملیات"
        ><template #header>
          <Skeleton v-if="fetching" />
          <p v-else>عملیات</p>
        </template>
        <template #body="{ data }">
          <div class="flex gap-4 items-center justify-center">
            <Skeleton v-if="fetching" />
            <Button
              icon="pi pi-percentage"
              class="p-button-outlined p-button-success p-button-sm"
              label="محاسبه "
              :loading="loading"
              @click="$refs.calculateDialog.open(data)"
              v-else
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <CalculateDialog ref="calculateDialog" @call="getList()"/>
  </div>
</template>

<script>
import FinancialService from "../../../../service/financialExpert";
import CalculateDialog from "./CalculateDialog.vue";
export default {
  components: { CalculateDialog },
  data() {
    return {
      financialService: null,
      serviceHistories: [{}, {}, {}],
      fetching: true,
      loading: false,
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
        "calculating",
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
  },
};
</script>

<style scoped>
</style>

<style>
</style>