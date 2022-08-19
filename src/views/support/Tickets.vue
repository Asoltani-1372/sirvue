<template>
  <div class="support-tickets">
    <Card>
      <template #title>
        <div class="flex justify-between items-center">
          <Skeleton v-if="fetching" width="8rem" height="2.5rem" />
          <p v-else>تیکت‌ها</p>
          <Skeleton v-if="fetching" width="8rem" height="3.2rem" />
          <Button
            icon="pi pi-plus"
            label="تیکت جدید"
            class="p-button-success"
            @click="$refs.sendTicket.open()"
            v-else
          />
        </div>
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="tickets"
          dataKey="id"
          :paginator="tickets.length > 5 && !fetching"
          :rows="5"
          :rowHover="!fetching"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} تیکت"
          responsiveLayout="stack"
          @row-click="openTicket"
        >
          <template #empty>
            <p>اطلاعاتی وجود ندارد.</p>
          </template>
          <Column field="id" :header="fetching ? '' : 'شناسه'" class="w-1/12">
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>شناسه</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p v-else>{{ data.id }}</p>
            </template>
          </Column>
          <Column :header="fetching ? '' : 'عنوان'" class="w-1/2">
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>عنوان</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p
                class="cursor-pointer"
                v-else
              >
                {{ data.subject }}
              </p>
            </template>
          </Column>
          <Column
            field="date_update"
            :header="fetching ? '' : 'آخرین بروزرسانی'"
            class="w-1/5"
          >
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>آخرین بروزرسانی</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <p v-else>
                {{ data.date_update }}
              </p>
            </template>
          </Column>
          <Column :header="fetching ? '' : 'وضعیت'" class="w-1/6">
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>وضعیت</p>
            </template>
            <template #body="{ data }">
              <Skeleton v-if="fetching" />
              <Tag
                v-else
                :value="data.status.title"
                :severity="data.status.severity"
              />
            </template>
          </Column>
          <Column
            class="w-1/12"
            :header="fetching ? '' : 'بازخورد'"
            v-if="false"
          >
            <template #header>
              <Skeleton v-if="fetching" />
              <p>بازخورد</p>
            </template>
            <template #body>
              <div class="flex gap-4 items-center justify-center">
                <Button
                  icon="pi pi-times"
                  class="p-button-outlined p-button-rounded p-button-danger"
                />
                <Button
                  icon="pi pi-check"
                  class="p-button-outlined p-button-rounded p-button-success"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <SendTicket ref="sendTicket" :input="supportTypes" @call="getTickets()" />
  </div>
</template>

<script>
import SendTicket from "./SendTicket.vue";
import TicketService from "../../service/ticket.js";
export default {
  components: { SendTicket },
  data() {
    return {
      tickets: [],
      supportTypes: [],
      ticketService: null,
      statuses: {
        pendingSupport: {
          title: "در انتظار پاسخ پشتیبان",
          severity: "warning",
        },
        pendingUser: { title: "پاسخ داده شده", severity: "success" },
        closed: { title: "بسته شده", severity: "info" },
      },
      fetching: true,
    };
  },
  created() {
    this.ticketService = new TicketService();
  },
  mounted() {
    this.getTickets();
  },

  methods: {
    getTickets() {
      this.fetching = true;
      this.tickets = [{}, {}, {}];
      this.ticketService.getTickets(
        (data) => {
          this.tickets = data.tickets;
          this.tickets.forEach((element) => {
            element.status = this.statuses[element.status];
          });
          this.supportTypes = data.supportTypes;
          this.fetching = false;
        },
        () => {}
      );
    },
    openTicket(event){
      const route = this.$route.path.split('/');
      this.$router.push('/' + route[1]+'/support/ticket/' + event.data.id);
    }
  },
};
</script>

<style>
</style>