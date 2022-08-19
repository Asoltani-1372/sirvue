<template>
  <div>
    <Dialog
      :visible="displayModal"
      class="max-w-2xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <div class="font-bold text-lg">محاسبه کارمزد</div>
      </template>
      <div class="flex flex-col gap-3 text-sm">
        <div class="flex flex-col gap-3 py-px">
          <div class="p-inputgroup" dir="ltr">
            <span class="p-inputgroup-addon border-r-0 border-l">%</span>
            <InputText
              v-model="percent"
              placeholder="درصد کارمزد"
              :class="{ 'p-invalid': errors.percent }"
              @keyup="calculation($event)"
              :useGrouping="false"
              dir="rtl"
              type="number"
            />
          </div>
          <p class="text-xs text-red-600">{{ errors.percent }}</p>
        </div>

        <div class="flex justify-between">
          <p>مبلغ کل (تومان)</p>
          <p>
            {{
              total
                .toFixed(3)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                .replace(".000", "")
            }}
          </p>
        </div>
        <div class="flex justify-between">
          <p>ایاب و ذهاب (تومان)</p>
          <p>
            {{
              transport
                .toFixed(3)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                .replace(".000", "")
            }}
          </p>
        </div>
        <div class="flex justify-between">
          <p>سهم خدمت دهنده (تومان)</p>
          <p>
            {{
              share
                .toFixed(3)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                .replace(".000", "")
            }}
          </p>
        </div>
        <div class="flex justify-between">
          <p>کارمزد (تومان)</p>
          <p>
            {{
              wage
                .toFixed(3)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                .replace(".000", "")
            }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <div>
            <Button
              label="بازگشت"
              class="p-button-text p-button-info p-button-sm"
              @click="displayModal = false"
            />
          </div>
          <div class="flex gap-3 items-center">
            <span> تصفیه حساب </span>
            <Checkbox v-model="refined" :binary="true" />
            <Button
              label="تایید"
              class="p-button-raised p-button-success p-button-sm"
              @click="calculateService()"
              :loading="loading"
              :disabled="disableBtn"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import FinancialService from "../../../../service/financialExpert.js";
export default {
  data() {
    return {
      financialService: null,
      loading: false,
      percent: null,
      id: null,
      total: null,
      transport: null,
      wage: null,
      share: null,
      displayModal: false,
      errors: {},
      refined: false,
      disableBtn: true,
    };
  },

  created() {
    this.financialService = new FinancialService();
  },

  methods: {
    open(data) {
      this.displayModal = true;
      this.loading = false;
      this.id = data.id;
      this.total = parseInt(data.total.replaceAll(",", ""));
      this.transport = data.transport;
      this.share = this.total;
      this.percent = null;
      this.wage = 0;
    },

    calculation(event) {
      this.disableBtn = true;
      let percent = event.target.value;
      if (percent != "" && percent >= 0) {
        this.errors.percent = "";
        if (percent >= 0 && percent <= 100) {
          this.wage = (percent / 100) * this.total;
          this.share = this.total - this.wage;
        } else {
          this.percent = 100;
          percent = 100;
          this.wage = (percent / 100) * this.total;
          this.share = this.total - this.wage;
          this.errors.percent = " درصد کارمزد باید بین 0 تا 100 باشد";
        }
        this.disableBtn = false;
      } else {
        this.errors.percent = " درصد کارمزد نمی تواند خالی باشد";
      }
    },

    calculateService() {
      this.loading = true;
      const data = {
        id: this.id,
        percent: this.percent,
        refined: this.refined,
      };
      this.financialService.calculate(
        data,
        () => {
          this.$emit("call", "");
          this.loading = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "با موفقیت محاسبه شد.",
            life: 3000,
          });
          this.displayModal = false;
        },
        (error) => {
          this.loading = false;
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