<template>
  <div class="servants-list">
    <Card>
      <template #title>
        <div class="flex justify-between items-center gap-3">
          <h5 class="p-mb-2 p-m-md-0 p-as-md-center ml-auto" v-if="input">زمانبندی خدمات</h5>
          <Skeleton width="30%" v-else />

          <span class="p-input-icon-right" v-if="input">
            <InputText placeholder="جسنجو ..." class="w-72 p-inputtext-sm hidden lg:block" />
            <i class="pi pi-search" />
          </span>
            <Skeleton width="18rem" height="2.68rem" v-else class="hidden lg:block"/>
        
        </div>
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="timings"
          dataKey="id"
          :paginator="input"
          :rows="10"
          stripedRows
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} منطقه"
          responsiveLayout="stack"
        >
          <Column field="service" header="خدمت" class="w-1/3 trow">
            <template #body="{ data }">
              <div v-if="data.service">
                {{ data.service.title }}
              </div>
              <Skeleton width="100%" v-else />
            </template>
          </Column>
          <Column field="place" header="منطقه" class="w-1/3 trow">
            <template #body="{ data }">
              <div v-if="data.place">
                {{ data.place }}
              </div>
              <Skeleton v-else />
            </template>
          </Column>
          <Column field="date" header="تاریخ" class="w-1/3 trow">
            <template #body="{ data }">
              <div v-if="data.date">
                {{ data.date }}
              </div>
              <Skeleton v-else />
            </template>
          </Column>

          <Column class="flex justify-end trow" header="عملیات">
            <template #body="{data}">
              <Button
                type="button"
                label="رزرو"
                class="p-button-success h-10"
                @click="showReserveDialog(data)"
                v-if="data.place"
              ></Button>
              <Skeleton v-else/>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <ReserveDialog ref="reserveDialog" :input="timing"/>
  </div>
</template>

<script> 
import ReserveDialog from "./ReserveDialog.vue";
export default {
  props: ["input"],
  components: { ReserveDialog },
  data() {
    return {
      timings: [{},{},{}],
      timing: null
    };
  },
  methods: {
    showReserveDialog(timing) {
      this.timing = timing
      this.$refs.reserveDialog.showDialog();
    },
  },

  watch: {
    input(v) {
      if (v) {
        this.timings = v;
      }
    },
  },
};
</script>

<style scoped>
.servants-list {
  @apply flex-grow w-full lg:w-2/3;
}

.trow .p-skeleton {
  @apply w-1/2 lg:w-full !important;
}
</style>