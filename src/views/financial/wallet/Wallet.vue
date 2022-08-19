<template>
  <Card class="w-full">
    <template #title>
      <div class="flex justify-between items-center">
        <Skeleton width="12rem" v-if="fetching" />
        <p v-else>کیف پول</p>
        <Skeleton width="7rem" height="2.68rem" v-if="fetching" />
        <Inplace v-else ref="inPlace">
          <template #display>
            <!-- <span class="p-button-success h-20">
              <i class="pi pi-plus align-middle mx-1"></i>
              افزایش موجودی آنلاین
            </span> -->
            <Button label="افزایش موجودی آنلاین" class="p-button-success" />
          </template>
          <template #content>
            <div class="flex justify-end w-full">
              <Button
                icon="pi pi-times"
                class="p-button-text p-button-sm"
                @click="
                  this.$refs.inPlace.d_active = false;
                  amount = 0;
                "
                :disabled="loading"
              />
              <div class="p-col-12 p-md-4 flex-grow" dir="ltr">
                <div class="p-inputgroup">
                  <span class="p-inputgroup-addon border-l border-r-0"
                    >تومان</span
                  >
                  <InputNumber
                    v-model="amount"
                    autoFocus
                    class="p-inputtext-sm w-1/2 ml-auto right-0 left-full"
                    placeholder="مبلغ را وارد نمایید"
                    :disabled="loading"
                    dir="rtl"
                  />
                </div>
              </div>
              <Button
                icon="pi pi-chevron-left"
                :label="loading ? '' : 'افزایش'"
                iconPos="right"
                class="p-button-success p-button-sm mr-2"
                @click="increaseBalance()"
                :loading="loading"
              />
            </div>
          </template>
        </Inplace>
      </div>
    </template>
    <template #content>
      <div class="border-t"></div>
      <div class="flex flex-col gap-8 mt-8 px-4">
        <Skeleton v-if="fetching" />
        <div class="flex justify-between items-center" v-else>
          <p class="font-bold">موجودی</p>
          <p class="flex items-center">{{ wallet.balance }} تومان</p>
        </div>

        <Skeleton v-if="fetching" />
        <div class="flex justify-between items-center" v-else>
          <p class="font-bold">بستانکار</p>
          <p class="flex items-center">{{ wallet.creditor }} تومان</p>
        </div>

        <Skeleton v-if="fetching" />
        <div class="flex justify-between items-center" v-else>
          <p class="font-bold">در انتظار تسویه</p>
          <p class="flex items-center">{{ wallet.clearing }} تومان</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import FinancialService from "../../../service/financial";
export default {
  data() {
    return {
      financialService: null,
      fetching: true,
      wallet: {
        balance: null,
        creditor: null,
        clearing: null,
      },
      amount: null,
    };
  },

  created() {
    this.financialService = new FinancialService();
  },

  mounted() {
    this.getWallet();
  },

  methods: {
    getWallet() {
      this.financialService.getWallet(
        (data) => {
          if (parseInt(this.wallet.balance) > 0)
            this.checkIncrease(data.wallet.balance);
          this.wallet = data.wallet;

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
    increaseBalance() {
      if (this.amount >= 100000) {
        const amount = {
          amount: this.amount,
        };
        this.amount = this.amount + "";
        this.loading = true;
        this.financialService.increaseBalance(
          amount,
          (data) => {
            this.$refs.inPlace.d_active = false;
            this.loading = false;
            const myWindow = window.open(data.link, "_blank");
            const timer = setInterval(() => {
              if (myWindow.closed) {
                this.getWallet();
                clearInterval(timer);
              }
            }, 500);
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
      } else {
        this.$toast.add({
          severity: "error",
          summary: "خطا",
          detail: "مبلغ حداقل باید 100,000 تومان باشد",
          life: 3000,
        });
      }
    },

    checkIncrease(balance) {
      if (this.wallet.balance != balance) {
        this.$toast.add({
          severity: "success",
          summary: "تراکنش موفق",
          detail: "افزایش موجودی انجام شد",
          life: 10000,
        });
      }
    },
  },

  watch: {
    "$parent.balance"(v) {
      this.wallet.balance = v;
    },
    "$parent.clearing"() {
      this.getWallet();
    },
  },
};
</script>

<style>
</style>