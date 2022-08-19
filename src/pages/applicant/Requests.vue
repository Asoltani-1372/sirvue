<template>
  <div class="request flex flex-col gap-8">
    <Card>
      <template #title>
        <div class="flex items-center justify-between gap-3">
          <Skeleton v-if="fetching" width="8rem" height="2rem" />
          <p v-else>درخواست های من</p>
          <Skeleton
            v-if="fetching"
            width="10rem"
            height="2.5rem"
            class="hidden lg:block"
          />
          <Button
            class="p-button-success p-button-sm hidden lg:block"
            icon="pi pi-plus"
            label="درخواست خدمت"
            @click="
              $router.push('/' + $route.path.split('/')[1] + '/serviceRequest/')
            "
            v-else
          />
        </div>
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="requestsList"
          dataKey="id"
          :paginator="requestsList.length > 5 && !fetching"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} درخواست"
          responsiveLayout="stack"
          stripped
        >
          <template #empty>
            <p>موردی جهت نمایش وجود ندارد.</p>
          </template>
          <Column class="w-1/5" :header="fetching ? '' : 'خدمت دهنده'">
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>خدمت دهنده</p>
            </template>
            <template #body="{ data }">
              <div
                class="flex gap-3 items-center lg:w-auto justify-center"
                :class="{ 'w-full': fetching }"
              >
                <Avatar
                  :image="data.servant.avatar"
                  shape="circle"
                  size="large"
                  class="hidden lg:block"
                  v-if="data.servant"
                />
                <Skeleton
                  size="3rem"
                  shape="circle"
                  v-else
                  class="hidden lg:block"
                />

                <Skeleton class="min-w-full" v-if="fetching" />
                <p v-else>
                  {{ data.servant.firstname }} {{ data.servant.lastname }}
                </p>
              </div>
            </template>
          </Column>
          <Column
            class="w-1/5 requests-table"
            :header="fetching ? '' : ' نوع خدمت'"
          >
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>نوع خدمت</p>
            </template>
            <template #body="{ data }">
              <div v-if="data.service">{{ data.service }}</div>
              <Skeleton v-else />
            </template>
          </Column>
          <Column
            class="w-1/5 requests-table"
            :header="fetching ? '' : 'تاریخ انجام'"
          >
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>تاریخ انجام</p>
            </template>
            <template #body="{ data }">
              <div v-if="data.date">{{ data.date }}</div>
              <Skeleton v-else />
            </template>
          </Column>
          <Column
            class="w-1/6 requests-table"
            :header="fetching ? '' : 'وضعیت'"
          >
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>وضعیت</p>
            </template>
            <template #body="{ data }">
              <Tag v-if="data.status" :severity="data.status.severity">
                {{ data.status.title }}
              </Tag>
              <Skeleton v-else />
            </template>
          </Column>
          <Column class="w-1/4 requests-table text-left">
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>عملیات</p>
            </template>
            <template #body="{ data }">
              <div
                class="
                  w-full
                  flex
                  gap-4
                  items-center
                  justify-end
                  lg:justify-end
                "
              >
                <Button
                  v-if="data.button && data.button.label"
                  :icon="'pi pi-' + data.button.icon"
                  class="p-button-outlined p-button-sm whitespace-nowrap"
                  :class="['p-button-' + data.button.class]"
                  :label="data.button.label"
                  :loading="data.button.loading"
                  @click="handleClick(data, reasons, rates)"
                />
                <Skeleton v-else-if="!data.id" width="6rem" height="2.5rem" />
                <ConfirmPopup></ConfirmPopup>
                <Button
                  v-if="data.id"
                  icon="pi pi-chevron-left"
                  iconPos="right"
                  class="p-button-text p-button-success p-button-sm"
                  label="جزئیات"
                  @click="$refs.detailsDialog.open(data)"
                />
                <Skeleton v-else width="6rem" height="2.5rem" />
              </div>
            </template>
          </Column>
        </DataTable>
        <div class="lg:w-1/2 w-full mx-auto pt-4" v-if="fetching">
          <Skeleton width="100%" height="3rem" />
        </div>
      </template>
    </Card>
    <DetailsDialog ref="detailsDialog" @call="getList()" />
    <CancelDialog ref="cancelDialog" @call="getList()" />
    <RatingDialog ref="ratingDialog" />
    <FactorDialog ref="factorDialog" @call="paying($event)" />
    <AllocateDialog ref="allocatDialog" @call="getList()" />
  </div>
</template>

<script>
import DetailsDialog from "../../views/applicant/requests/DetailsDialog.vue";
import CancelDialog from "../../views/applicant/requests/CancelDialog.vue";
import RatingDialog from "../../views/applicant/requests/RatingDialog.vue";
import FactorDialog from "../../views/applicant/requests/FactorDialog.vue";
import ServiceRequestService from "../../service/applicant/serviceRequestService.js";
import AllocateDialog from "../../views/experts/allocator/AllocateDialog.vue";
export default {
  components: {
    DetailsDialog,
    RatingDialog,
    CancelDialog,
    FactorDialog,
    AllocateDialog,
  },

  data() {
    return {
      requestsList: [{}, {}, {}, {}],
      reasons: null,
      rates: null,
      authorized: false,
      serviceRequestService: null,
      buttons: {
        depositing: {
          label: "پرداخت  بیعانه",
          icon: "credit-card",
          class: "info",
        },
        // allocating: {
        //   label: "لغو خدمت",
        //   icon: "times",
        //   class: "danger",
        //   dialog: "cancelDialog",
        // },
        // accepting: {
        //   label: "لغو خدمت",
        //   icon: "times",
        //   class: "danger",
        //   dialog: "cancelDialog",
        // },
        allocating: {
          label: "تخصیص",
          icon: "check",
          class: "success",
        },
        paying: {
          label: "پرداخت",
          icon: "credit-card",
          class: "info",
        },

        rating: {
          label: "ثبت امتیاز",
          icon: "star",
          class: "primary",
          dialog: "ratingDialog",
        },
        broadcast: {
          label: "لفو نمایش",
          icon: "ban",
          class: "danger",
        },
        unbroadcast: {
          label: "نمایش مجدد",
          icon: "bolt",
          class: "info",
        },
      },
      statuses: {
        depositing: { severity: "info", title: "در انتظار پرداخت بیعانه" },
        allocating: { severity: "warning", title: "در انتظار تخصیص " },
        publishing: { severity: "warning", title: "انتشار یافته" },
        transferring: { severity: "warning", title: "واگذار شده" },
        broadcast: { severity: "info", title: "درحال نمایش" },
        unbroadcast: { severity: "danger", title: "مخفی شده" },
        accepting: { severity: "info", title: "در انتظار تایید خدمت دهنده" },
        paying: { severity: "primary", title: "در انتظار پرداخت" },
        coordinating: { severity: "help", title: "در انتظار هماهنگی" },
        doing: { severity: "info", title: "در انتظار انجام" },
        rating: { severity: "success", title: "در انتظار تایید انجام" },
        done: { severity: "success", title: "تکمیل شده" },
        rejected: { severity: "danger", title: "رد شده" },
        canceled: { severity: "danger", title: "لغو شده" },
        expired: { severity: "danger", title: "منقضی شده" },
        completed: { severity: "primary", title: "تکمیل شده" },
        verifying: { severity: "primary", title: "در انتظار صدور مجوز" },
      },
      fetching: true,
      newRequest: false,
      loading: false,
    };
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  mounted() {
    const role = this.$route.path.split("/")[1];
    if (role != "allocator") {
      delete this.buttons.broadcast;
      delete this.buttons.unbroadcast;
    }
    if (role != "company") {
      delete this.buttons.allocating;
    }
    this.getList();
  },
  methods: {
    getList() {
      this.serviceRequestService.getList(
        (data) => {
          this.fetching = false;
          this.requestsList = data.serviceRequests;
          this.reasons = data.reasons;
          this.rates = data.rates;
          this.authorized = data.authorized;
          this.requestsList.forEach((element) => {
            const temp = element.status;
            try {
              element.button = JSON.parse(
                JSON.stringify(this.buttons[element.status])
              );
            } catch (error) {
              element.button = null;
            }
            element.status = this.statuses[temp];
            element.status.state = temp;
            let temp2 = "";
            delete element.address.country;
            Object.entries(element.address).forEach((element) => {
              if (element) {
                if (temp2) temp2 += " , ";
                temp2 += element[1].title;
              }
            });
            element.address = temp2;
          });
        },
        () => {}
      );
    },
    handleClick(data, reasons, rates) {
      switch (data.status.state) {
        case "allocating":
          this.setLoading(data.id, true);
          this.$refs.allocatDialog.open(data);
          setTimeout(() => {
            this.setLoading(data.id, false);
          }, 2000);
          break;
        case "accepting":
          this.$refs.cancelDialog.open(data.id, reasons);
          break;
        case "paying":
        case "depositing":
          this.$refs.factorDialog.open(data);
          break;
        case "rating":
          this.$refs.ratingDialog.open(data, rates);
          break;
        case "broadcast":
          this.unbroadcast(data.id);
          break;
        case "unbroadcast":
          this.broadcast(data.id);
          break;
      }
    },
    paying(request) {
      console.log(request);
      this.requestsList.forEach((element) => {
        if (request == element.id) {
          console.log(request);
          if (element.status.state == "depositing") {
            if (element.servant.lastname != "مشخص نشده") {
              element.status = this.statuses.accepting;
              element.status.state = "accepting"
            }
            try {
              element.button = JSON.parse(
                JSON.stringify(this.buttons.allocating)
              );
              element.status = this.statuses.allocating
              element.status.state = "allocating"
            } catch (error) {
              //
            }
          } else {
            element.status = this.statuses.verifying;
            element.button = null;
            element.status.state = "verifying"
          }
        }
      });
      this.$toast.add({
        severity: "success",
        summary: "موفق",
        detail: "پرداخت با موفقیت انجام شد",
        life: 3000,
      });
    },
    setRate(id) {
      this.setLoading(id, true);
      this.serviceRequestService.setRate(
        id,
        () => {
          this.setLoading(id, false);
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "خدمت مورد نظر شما به پایان رسید",
            life: 3000,
          });

          this.requestsList.forEach((element) => {
            if (element.id == id) {
              element.button = null;
              element.status = this.statuses.done;
              element.status.state = "done";
            }
          });
        },
        (error) => {
          this.setLoading(id, false);
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    broadcast(id) {
      this.$confirm.require({
        message: "آیا از انتشار این درخواست اطمینان دارید؟",
        header: "هشدار",
        icon: "pi pi-check",
        acceptLabel: "منتشر شود",
        acceptClass: "p-button-success p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.setLoading(id, true);
          this.serviceRequestService.broadcast(
            id,
            () => {
              this.setLoading(id, false);
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "باموفقیت منتشر شد",
                life: 3000,
              });

              this.requestsList.forEach((element) => {
                if (element.id == id) {
                  element.button = this.buttons.broadcast;
                  element.status = this.statuses.broadcast;
                  element.status.state = "broadcast";
                }
              });
            },
            (error) => {
              this.setLoading(id, false);
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
    unbroadcast(id) {
      this.$confirm.require({
        message: "آیا از لغو انتشار این درخواست اطمینان دارید؟",
        header: "هشدار",
        icon: "pi pi-check",
        acceptLabel: "لفو شود",
        acceptClass: "p-button-danger p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.setLoading(id, true);
          this.serviceRequestService.unbroadcast(
            id,
            () => {
              this.setLoading(id, false);
              this.$toast.add({
                severity: "warn",
                summary: "موفق",
                detail: "باموفقیت  لفو انتشار شد",
                life: 3000,
              });

              this.requestsList.forEach((element) => {
                if (element.id == id) {
                  element.button = this.buttons.unbroadcast;
                  element.status = this.statuses.unbroadcast;
                  element.status.state = "unbroadcast";
                }
              });
            },
            (error) => {
              this.setLoading(id, false);
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
    setLoading(id) {
      this.requestsList.forEach((element) => {
        if (element.id == id) {
          element.button.loading = !element.button.loading;
        }
      });
    },
  },
  watch: {
    "$route.hash"(v) {
      if (v == "#new") {
        this.requestsList = [{}, {}, {}, {}];
        this.fetching = true;
        this.getList();
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