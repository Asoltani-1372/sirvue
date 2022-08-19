<template>
  <Card class="w-full">
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>تسویه حساب</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="payRequestList.length > 0"
          class="p-button-text p-button-success p-button-sm"
          label="افزودن"
          icon="pi pi-plus"
          @click="addRow()"
          :disabled="flag"
        />
      </div>
    </template>
    <template #content>
      <DataTable
        :value="payRequestList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="stack"
        :paginator="payRequestList.length > 5"
        :rows="5"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
      >
        <template #empty>
          <p class="text-xs py-2">اولین درخواست تسویه را اضافه نمایید</p>
          <Button
            class="p-button-text p-button-success p-button-sm"
            icon="pi pi-plus"
            label="افزودن"
            @click="addRow()"
          />
        </template>
        <Column
          v-for="col of columns"
          :field="col.field"
          :key="col.field"
          :class="[col.width]"
        >
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>{{ col.header }}</p>
          </template>
          <template #editor="{ data, field }" v-if="col.editable">
            <div
              class="p-col-12 p-md-4 flex-grow"
              dir="ltr"
              v-if="field == 'amount'"
            >
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon border-l border-r-0"
                  >تومان</span
                >
                <InputNumber
                  v-model="data[field]"
                  :class="{ 'p-invalid': errors[field] }"
                  class="p-inputtext-sm w-full"
                  placeholder="مبلغ"
                  autofocus
                  dir="rtl"
                />
              </div>
            </div>

            <Dropdown
              v-if="field == 'account'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              :options="bankAccounts"
              class="p-inputtext-sm w-full"
              optionLabel="title"
              optionValue="id"
              placeholder="حساب بانکی"
            />
          </template>
          <template #body="{ data, field, index }">
            <div v-if="data.id != null" class="flex items-center justify-center">
              <p v-if="field == 'amount'">{{ data.amount }}</p>
              <p v-if="field == 'account' && bankAccounts.length > 0">
                {{ bankAccounts.filter((e) => e.id == data.account)[0].title }}
              </p>
              <p v-if="field == 'date'">{{ data.date }}</p>
              <div v-if="field == 'status'" class="flex gap-4 items-center">
                <Tag
                  :value="data.status.value"
                  :severity="data.status.severity"
                />
                <ActionTable
                  v-if="data.status == statues.new"
                  :editing="editingRows[data.id.toString()]"
                  @edit="editRow(data)"
                  @cancel="cancelRow(data)"
                  @save="saveRow(data, index)"
                />
              </div>
            </div>
            <Skeleton v-else />
          </template>
        </Column>
      </DataTable>
      <div class="flex items-center justify-center pt-4" v-if="fetching">
        <Skeleton width="24rem" height="3rem" />
      </div>
    </template>
  </Card>
</template>

<script>
import FinancialService from "../../../service/financial";
import ActionTable from "../../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  data() {
    return {
      columns: [
        { header: "مبلغ", field: "amount", width: "w-1/6", editable: true },
        {
          header: "حساب بانکی",
          field: "account",
          width: "w-1/4",
          editable: true,
        },
        { header: "تاریخ", field: "date", width: "w-1/12" },
        { header: "وضعیت", field: "status", width: "w-1/6" },
      ],
      fetching: true,
      payRequestList: [{}, {}, {}],
      flag: false,
      financialService: null,
      editingRows: {},
      errors: {},
      statues: {
        new: { value: "درخواست جدید", severity: "info" },
        request: { value: "درانتظار بررسی", severity: "warning" },
        awaiting: { value: "درانتظار تسویه", severity: "info" },
        cleared: { value: "تسویه شده", severity: "success" },
        rejected: { value: "رد شده", severity: "danger" },
      },
      bankAccounts: [],
    };
  },
  methods: {
    getPayRequests() {
      this.financialService.getPayRequests(
        (data) => {
          this.bankAccounts = data.bankAccounts;
          this.payRequestList = data.payRequests;
          this.payRequestList.forEach((element) => {
            element.status = this.statues[element.status];
          });
          this.fetching = false;
        },
        () => {}
      );
    },
    store(payRequest) {
      const data = {
        amount: payRequest.amount,
        account: payRequest.account,
      };
      this.payRequestList[0] = {};
      this.financialService.storePayRequest(
        data,
        (response) => {
          this.flag = false;
          this.cancelRow(payRequest); 
          payRequest.id = response.id;
          payRequest.date = response.date;
          payRequest.status = this.statues.awaiting;
          payRequest.amount = payRequest.amount
                    .toFixed(3)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    .replace(".000", "")
          this.payRequestList[0] = payRequest;
          this.$parent.balance = response.balance;
          this.$parent.clearing = response.clearing;
        },
        (error) => {
          this.cancelRow(payRequest)
          this.flag = false;
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
         let date = new Date();
         date = date.toLocaleDateString('fa-IR');
        this.payRequestList.unshift({});
        setTimeout(() => {
          this.payRequestList[0] = {
            id: 0,
            status: this.statues.new,
            amount: "",
            account: "",
            date,
          };
          this.editRow(this.payRequestList[0]);
        }, 300);
      }
    },
    editRow(data) {
      const id = data.id;
      this.editingRows[id.toString()] = true;
      if (!this.$refs.table.d_editingRowKeys)
        this.$refs.table.d_editingRowKeys = {};
      this.$refs.table.d_editingRowKeys[id.toString()] = 1;
    },
    saveRow(payRequest, index) {
      if (this.flag) {
        if (payRequest.amount >= 100000 && payRequest.account != null)
          this.store(payRequest);
        else if (payRequest.title.length > 2 && !payRequest.terrain)
          this.cancelRow(payRequest);
      } else {
        if (payRequest.id != null) {
          index = this.payRequestList.findIndex((e) => e.id == payRequest.id);
          let data = { id: payRequest.id };
          let update = false;
          const prePayRequests = this.payRequestList[index];
          Object.entries(payRequest).forEach((key) => {
            if (key[0] == "amount" || key[0] == "banckAccount") {
              if (prePayRequests[key[0]] != key[1]) {
                data[key[0]] = key[1];
                this.payRequestList[index][key[0]] = key[1];
                update = true;
              }
            }
          });
          if (update) {
            this.payRequestList[index].id = null;
            this.update(data, index);
          } else this.cancelRow(data);
        }
      }
    },
    cancelRow(data) {
      const id = data.id;
      delete this.$refs.table.d_editingRowKeys[id.toString()];
      Object.entries(this.$refs.table.d_editingMeta).forEach((e) => {
        if (id == e[1].data.id) delete this.$refs.table.d_editingMeta[e[0]];
      });
      delete this.editingRows[id.toString()];
      if (this.flag && id === 0) {
        this.payRequestList.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.financialService = new FinancialService();
  },
  mounted() {
    this.getPayRequests();
  },
  watch: {
    payRequestList(v) {
      if (v) this.$emit("payRequest", v);
    },
  },
};
</script>
