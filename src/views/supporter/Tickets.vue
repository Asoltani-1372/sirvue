<template>
  <div class="support-tickets">
    <Card>
      <template #title>
        <div class="flex justify-between items-center">
          <p v-if="!skeleton">تیکت‌ها</p>
          <Skeleton v-else width="8rem" height="2rem" />
        </div>
      </template>
      <template #content>
        <DataTable
          :value="tickets"
          dataKey="id"
          :paginator="!skeleton"
          :rows="10"
          :rowHover="!skeleton"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} زمانبندی"
          responsiveLayout="scroll"
        >
          <Column header="شناسه" class="w-1/12">
            <template #body="{ data }">
              <p v-if="data.id">{{ data.id }}</p>
              <Skeleton v-else width="100%" />
            </template>
          </Column>
          <Column header="عنوان" class="w-1/3">
            <template #body="{ data }">
              <p v-if="data.subject">{{ data.subject }}</p>
              <Skeleton v-else width="100%" />
            </template>
          </Column>
          <Column header="آخرین بروزرسانی " class="w-1/6">
            <template #body="{ data }">
              <p v-if="data.date_update" dir="ltr">{{ data.date_update }}</p>
              <Skeleton v-else width="100%" />
            </template>
          </Column>
          <Column header="وضعیت" class="w-1/6">
            <template #body="{ data }">
              <Tag
                v-if="data.status"
                :value="data.status.title"
                :severity="data.status.severity"
              />
              <Skeleton v-else width="100%" />
            </template>
          </Column>
          <Column header="جزئیات" class="w-1/12">
            <template #body="{ data }">
              <Button
                label="مشاهده"
                icon="pi pi pi-eye"
                class="mx-auto p-button-success p-button-sm"
                v-if="data.id"
                @click="$router.push('ticket/' + data.id)"
              />
              <Skeleton v-else width="7rem" height="3rem" />
            </template>
          </Column>
        </DataTable>
        <div class="mt-4 flex justify-center">
          <Skeleton v-if="skeleton" width="28rem" height="3rem" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import SupporterService from "../../service/supporter.js";
export default {
  data() {
    return {
      tickets: [{}, {}, {}],
      supporterService: null,
      skeleton: true,
      statuses: {
        pendingSupport: { title: "درانتظار پاسخ", severity: "warning" },
        pendingUser: { title: "درانتظار کاربر", severity: "info" },
         closed: { title: "بسته شده", severity: "success" },
      },
    };
  },
  created() {
    this.supporterService = new SupporterService();
  },
  mounted() {
    this.supporterService.getTickets(
      (data) => {
        this.tickets = data.tickets;
        this.tickets.forEach((element) => {
          element.status = this.statuses[element.status];
        });
        this.skeleton = false;
      },
      () => {}
    );
  },
};
</script>

<style>
</style>