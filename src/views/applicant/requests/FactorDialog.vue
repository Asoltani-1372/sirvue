<template>
  <div>
    <Dialog
      :visible="displayModal"
      class="max-w-xl lg:w-full w-11/12"
      :modal="true"
      :closable="false"
      :header="
        data && data.status.state == 'paying' ? 'هزینه خدمت' : 'پرداخت بیعانه'
      "
    >
      <div class="flex flex-col gap-3" v-if="data.status.state == 'paying'">
        <div class="flex justify-between">
          <p>هزینه خدمت</p>
          <p>{{ data.price }} تومان</p>
        </div>
        <div class="flex justify-between">
          <p>پیش پرداخت</p>
          <p>{{ data.deposite }} تومان</p>
        </div>
        <div class="flex justify-between">
          <p>هزینه ایاب و ذهاب</p>
          <p>{{ data.transport }} تومان</p>
        </div>
        <div class="flex justify-between">
          <p>باقی مانده</p>
          <p>{{ data.remain }} تومان</p>
        </div>
        <div class="flex justify-between">
          <p>مبلغ کل</p>
          <p>{{ data.total }} تومان</p>
        </div>
      </div>
      <div class="flex flex-col gap-3" v-if="data.status.state == 'depositing'">
        <div class="flex justify-between">
          <p>هزینه خدمت</p>
          <p>{{ data.price }} تومان</p>
        </div>
        <div class="flex justify-between">
          <p>بیعانه</p>
          <p>{{ data.deposite }} تومان</p>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-row justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="displayModal = false"
          />
          <div class="flex">
            <Button
              label="پرداخت در محل"
              class="p-button-help p-button-sm whitespace-nowrap"
              @click="payRequest(data.id, 'cash')"
              v-if="showCashBtn"
              :loading="loading.cash"
            />
            <!-- v-if=" ( $route.path.split('/')[1] != 'applicant' && data.status == 'paying' ) || ( data.status == 'paying') && authority ) " -->

            <Button
              label="پرداخت آنلاین"
              class="p-button-success p-button-sm whitespace-nowrap"
              @click="payRequest(data.id, 'wallet')"
              :loading="loading.wallet"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import ServiceRequestService from "../../../service/applicant/serviceRequestService";
export default {
  data() {
    return {
      displayModal: false,
      data: null,
      serviceRequestService: null,
      loading: {},
      authorized: false,
      role: null,
      showCashBtn: false,
    };
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
    this.role = this.$route.path.split("/")[1];
  },
  methods: {
    open(data) {
      this.data = data;
      this.authorized = this.$parent.authorized;
      try {
        this.showCashBtn = !(
          this.data.status.state == "depositing" &&
          this.role == "applicant" &&
          !this.authorized
        );
      } catch (error) {
        console.log(error);
      }
      this.displayModal = true;
    },

    payRequest(request, type) {
      this.loading[type] = true;
      this.serviceRequestService.payRequest(
        request,
        type,
        (data) => {
          this.loading = false;
          if (data.status == "doing" || data.status == "allocating") {
            this.displayModal = false;
            this.$emit("call", request);
          } else {
            this.$confirm.require({
              message: "موجودی کیف پول شما کافی نیست",
              header: "کیف پول",
              icon: "pi pi-wallet",
              acceptLabel: "شارژ کیف پول",
              acceptClass: "p-button-success float-left",
              rejectLabel: "بازگشت",
              accept: () => {
                this.$router.push("/applicant/wallet");
              },
              reject: () => {},
            });
          }
        },
        (error) => {
          this.loading[type] = false;
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

<style>
</style>