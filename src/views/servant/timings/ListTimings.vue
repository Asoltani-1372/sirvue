<template>
  <div class="list-timings">
    <Card>
      <template #title>
        <div class="flex items-center gap-3 justify-between">
          <h5 class="p-mb-2 p-m-md-0 p-as-md-center ml-auto" v-if="input">
            زمانبندی ها
          </h5>
          <Skeleton width="8rem" height="1.5rem" v-else />
          <Button
            label="حذف"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="deleteTimingsDialog = true"
            :disabled="!selectedTimings || !selectedTimings.length"
            v-if="input"
          />
          <Skeleton width="5rem" height="2.68rem" v-else />
        </div>
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="timings"
          v-model:selection="selectedTimings"
          dataKey="id"
          :paginator="input"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} زمانبندی"
          responsiveLayout="stack"
        >
          <Column :selectionMode="input ? 'multiple' : null" class="w-12">
            <template #header v-if="!input">
              <Skeleton width="1rem" />
            </template>
            <template #body v-if="!input">
              <Skeleton width="1rem" />
            </template>
          </Column>
          <Column field="service" header="نام خدمت" class="w-36">
            <template #body="{ data }">
              <p v-if="data.service">
                {{ data.service }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>
          <Column field="place" header="منطقه " class="w-36">
            <template #body="{ data }">
              <p v-if="data.place">
                {{ data.place }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>
          <Column field="date" header="تاریخ" class="w-36">
            <template #body="{ data }">
              <p v-if="data.date">
                {{ data.date }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>
          <Column class="w-20" header="حذف">
            <template #body="slotProps">
              <div class="flex gap-4 items-center justify-center">
                <Button
                  icon="pi pi-trash"
                  class="
                    p-button-rounded p-button-danger p-button-xs p-button-sm
                  "
                  @click="confirmDeleteTiming(slotProps.data)"
                  v-if="slotProps.data.date"
                />
                <Skeleton width="1rem" v-else />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="deleteTimingDialog"
      class="max-w-lg w-full"
      header="حذف منطقه"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>
          آیا مطمئنید که میخواهید زمانبندی خدمت <b>{{ timing.service }}</b> در
          <b>{{ timing.place }}</b> در تاریخ <b>{{ timing.date }}</b> را حذف
          نمایید ?
        </span>
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-sm"
            @click="deleteTimingDialog = false"
          />
          <Button
            label="حذف شود"
            icon="pi pi-times"
            class="p-button-danger p-button-sm"
            @click="deleteTimings([timing])"
          />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteTimingsDialog"
      class="max-w-lg w-full"
      header="حذف منطقه"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span
          >آیا مطمئن هستید که می خواهید زمانبندی های انتخاب شده را حذف
          نمایید؟</span
        >
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <Button
            label="بازگشت"
            icon="pi pi-times"
            class="p-button-text p-button-sm"
            @click="deleteTimingsDialog = false"
          />
          <Button
            label="حذف شود"
            icon="pi pi-check"
            class="p-button-danger p-button-sm"
            @click="deleteTimings(selectedTimings)"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      selectedTimings: null,
      deleteTimingDialog: false,
      deleteTimingsDialog: false,
      timing: null,
      timings: [{}, {}, {}],
    };
  },
  methods: {
    confirmDeleteTiming(timing) {
      this.timing = timing;
      this.deleteTimingDialog = true;
    },
    deleteTimings(timings) {
      this.deleteTimingDialog = false;
      this.deleteTimingsDialog = false;
      let temp = [];
      timings.forEach((element) => {
        temp.push(element.id);
      });
      this.$emit("delete", temp);
      this.selectedTimings = null;
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
.p-button-xs {
  @apply w-10 h-10 text-sm !important;
}
</style>

<style>
.list-timings {
  @apply flex-grow;
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