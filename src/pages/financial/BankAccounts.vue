<template>
  <Card class="w-full">
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>حساب بانکی</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="bankAccounts.length > 0"
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
        :value="bankAccounts"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="stack"
        :paginator="bankAccounts.length > 5"
        :rows="5"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
      >
        <template #empty>
          <p class="text-xs py-2">حساب بانکی خود را اضافه نمایید</p>
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
          class="text-right"
          :header="col.mheader"
        >
          <template #header>
            <Skeleton v-if="fetching" />
            <p v-else>{{ col.header }}</p>
          </template>
          <template #editor="{ data, field }" v-if="col.editable">
            <p v-if="field == 'fullname'">{{ data[field] }}</p>
            <Dropdown
              v-if="field == 'bank'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              :options="banks"
              class="p-inputtext-sm w-2/3 lg:w-full"
              optionLabel="title"
              optionValue="id"
              placeholder="بانک"
            />

            <div
              class="p-inputgroup w-2/3 lg:w-full"
              dir="ltr"
              v-if="field == 'identity'"
            >
              <span
                class="
                  p-inputgroup-addon p-inputtext-sm
                  border-r-0 border-l
                  hidden
                  lg:block
                "
              >
                IR
              </span>
              <InputMask
                v-if="field == 'identity'"
                mask="99 9999 9999 9999 9999 9999 99"
                placeholder="شماره شبا"
                v-model="data[field]"
                class="w-2/3 lg:w-full p-inputtext-sm"
                dir="ltr"
                :autoClear="false"
                :class="{ 'p-invalid': errors[field] }"
                slotChar="-"
              />
            </div>

            <InputMask
              v-if="field == 'number'"
              mask="99 9999 9999 999"
              placeholder="شماره حساب"
              v-model="data[field]"
              class="w-2/3 lg:w-full p-inputtext-sm"
              dir="ltr"
              :autoClear="false"
              :class="{ 'p-invalid': errors[field] }"
              slotChar="-"
            />
          </template>
          <template #body="{ data, field, index }">
            <div
              v-if="data.id"
              class="flex items-center justify-center text-sm lg:text-base"
            >
              <p v-if="field == 'fullname'">{{ data.fullname }}</p>
              <p v-if="field == 'bank' && banks.length > 0">
                {{ banks.filter((e) => e.id == data.bank)[0].title }}
              </p>
              <p v-if="field == 'number'">{{ data.number }}</p>
              <p v-if="field == 'identity'">{{ data.identity }}</p>
              <Tag
                v-if="field == 'status'"
                :value="statuses[data.status].title"
                :severity="statuses[data.status].severity"
              />

              <ActionTable
                v-if="field == 'action'"
                :editing="editingRows[data.id.toString()]"
                @edit="editRow(data)"
                @cancel="cancelRow(data)"
                @save="saveRow(data, index)"
                @destroy="destroy(data, index)"
              />
            </div>
            <div v-else class="w-2/3 lg:w-full">
              <Skeleton />
            </div>
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
import FinancialService from "../../service/financial";
import ActionTable from "../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  data() {
    return {
      columns: [
        {
          header: "صاحب حساب",
          field: "fullname",
          width: "w-1/6",
          editable: true,
        },
        { header: "نام بانک", field: "bank", width: "w-1/6", editable: true },
        {
          header: "شماره شبا",
          field: "identity",
          width: "w-2/6",
          editable: true,
        },
        {
          header: "شماره حساب",
          field: "number",
          width: "w-1/6",
          editable: true,
        },
        // { header: "وضعیت", field: "status", width: "w-1/6", editable: false },
        { header: "عملیات", field: "action", width: "w-1/6", editable: false },
      ],
      fetching: true,
      bankAccounts: [{}, {}, {}],
      banks: [],
      flag: false,
      financialService: null,
      editingRows: {},
      errors: {},
      statuses: {
        verified: { severity: "success", title: "تایید شده" },
        rejected: { severity: "danger", title: "رد شده" },
        checking: { severity: "info", title: "در انتظار" },
      },
      fullname: null,
    };
  },
  methods: {
    getBankAccounts() {
      this.financialService.getBankAccounts(
        (data) => {
          this.bankAccounts = data.accounts;
          this.banks = data.banks;
          this.units = data.units;
          this.fullname = data.fullname;
          this.fetching = false;
          this.columns.forEach((element) => {
            element.mheader = element.header;
          });
        },
        () => {}
      );
    },

    store(bankAccount) {
      this.bankAccounts[0] = {};
      this.financialService.storeBankAccount(
        bankAccount,
        (response) => {
          this.flag = false;
          this.cancelRow(bankAccount);
          bankAccount.id = response.id;
          this.bankAccounts[0] = bankAccount;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "باموفقیت ثبت شد",
            life: 3000,
          });
        },
        (error) => {
          this.cancelRow(bankAccount);
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

    update(bankAccount, index) {
      index -= (index % 5) * 5;
      this.financialService.updateBankAccount(
        bankAccount,
        () => {
          this.cancelRow(bankAccount);
          this.bankAccounts[index].id = bankAccount.id;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "باموفقیت ویرایش شد",
            life: 3000,
          });
        },
        (error) => {
          this.cancelRow(bankAccount);
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },

    destroy(data, index) {
      const id = data.id;
      this.$confirm.require({
        message: "آیا از حذف این حساب بانکی اطمینان دارید؟",
        icon: "pi pi-info-circle",
        acceptLabel: "حذف شود",
        rejectLabel: "بازگشت",
        acceptClass: "p-button-danger float-left",
        accept: () => {
          if (this.flag) {
            this.flag = false;
            this.bankAccounts.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.bankAccounts[index].id = null;
            this.financialService.destroyBankAccount(
              id,
              () => {
                this.bankAccounts.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              (error) => {
                this.bankAccounts[index].id = id;
                this.$toast.add({
                  severity: "warn",
                  summary: "خطا",
                  detail: error,
                  life: 5000,
                });
              }
            );
          }
        },
        reject: () => {},
      });
    },

    addRow() {
      this.$refs.table.resetPage();
      if (this.fullname) {
        if (!this.flag) {
          this.flag = true;
          this.bankAccounts.unshift({});
          setTimeout(() => {
            this.bankAccounts[0] = {
              id: 1,
              fullname: this.fullname,
              bank: "",
              number: "",
              identity: "",
              status: "checking",
            };
            this.editRow(this.bankAccounts[0]);
          }, 300);
        }
      } else {
        this.$toast.add({
          severity: "warn",
          summary: "هشدار",
          detail: "لطفا ابتدا نمایه خود را تکمیل نمایید",
          life: 3000,
        });
      }
    },

    editRow(data) {
      const id = data.id;
      this.editingRows[id.toString()] = true;
      if (!this.$refs.table.d_editingRowKeys)
        this.$refs.table.d_editingRowKeys = {};
      this.$refs.table.d_editingRowKeys[id.toString()] = 1;
    },

    saveRow(bankAccount, index) {
      bankAccount.identity = bankAccount.identity.replaceAll(" ", "");
      bankAccount.number = bankAccount.number.replaceAll(" ", "");
      if (this.flag) {
        if (
          bankAccount.bank != "" &&
          bankAccount.number != "" &&
          bankAccount.identity != ""
        )
          this.store(bankAccount);
      } else {
        if (bankAccount.id) {
          index = this.bankAccounts.findIndex((e) => e.id == bankAccount.id);
          let data = { id: bankAccount.id };
          let update = false;
          const preBankAccount = this.bankAccounts[index];
          Object.entries(bankAccount).forEach((key) => {
            if (preBankAccount[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.bankAccounts[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.bankAccounts[index].id = null;
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
      if (this.flag && id === 1) {
        this.bankAccounts.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.financialService = new FinancialService();
  },
  mounted() {
    this.getBankAccounts();
  },
};
</script>
