<template>
  <div class="flex flex-col lg:flex-row w-full gap-8 items-start justify-start">
    <Card class="lg:w-1/4 w-full max-w-md">
      <template #content>
        <div class="leading-8">
          <div v-if="fetching" class="flex flex-col gap-3">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>

          <div v-else class="">
            با توجه به عدم امکان پرداخت آنلاین در حال حاضر، از طریق پرداخت به
            شماره شبا <b>IR120160000000000928972789</b> یا شماره حساب
            <b>928972789</b> یا شماره کارت <b>6037707000209621</b> نزد بانک بانک
            کشاورزی به نام پرواز یاران سیرنگ اقدام و رسید پرداخت آن را بارگزاری
            و رقم رسید را در بخش مبلغ وارد کنید.
          </div>
        </div>
      </template>
    </Card>

    <Card class="lg:w-3/4 w-full">
      <template #title>
        <div class="flex items-center justify-between">
          <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
          <p v-else>افزایش موجودی آفلاین</p>
          <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
          <Button
            v-else-if="offlinePaymentList.length > 0"
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
          :value="offlinePaymentList"
          editMode="row"
          ref="table"
          dataKey="id"
          v-model:editingRows="editingRows"
          responsiveLayout="stack"
          :paginator="offlinePaymentList.length > 5"
          :rows="5"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          currentPageReportTemplate=""
        >
          <template #empty>
            <p class="text-xs py-2">اولین پرداخت آفلاین خود را ثبت نمایید</p>
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
            :header="col.header"
          >
            <template #header>
              <Skeleton v-if="fetching" />
              <p v-else>{{ col.header }}</p>
            </template>
            <template #editor="{ data, field, index }" v-if="col.editable">
              <div
                v-if="field == 'image'"
                class="flex justify-center items-center h-20"
              >
                <div class="flex justify-center" v-if="data.image">
                  <Button
                    icon="pi pi-times"
                    class="p-button-rounded p-button-danger p-button-text"
                    @click="
                      data.image = null;
                      removeImage(data.id);
                    "
                  />
                  <Image
                    :src="
                      data.image.indexOf('blob:') > -1
                        ? data.image
                        : rootUrl + '/uploads/' + data.image
                    "
                    class="h-20 w-32 overflow-hidden"
                    preview
                  />
                </div>
                <FileUpload
                  v-else
                  mode="basic"
                  name="file"
                  :url="rootUrl + '/api/upload?state=offlinePayment'"
                  chooseLabel="انتخاب تصویر"
                  class="p-button-sm p-button-success p-button-outlined"
                  :auto="true"
                  @before-send="beforeUpload"
                  @upload="onUpload(data.id, index, $event)"
                  @select="onSelect(index, $event)"
                />
              </div>
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
                    placeholder="مبلغ رسید را وارد کنید"
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
              <div
                v-if="data.id != null"
                class="flex items-center justify-center"
              >
                <Image
                  v-if="field == 'image'"
                  :src="
                    data.image.indexOf('blob:') > -1
                      ? data.image
                      : rootUrl + '/uploads/' + data.image
                  "
                  class="h-20 w-32 overflow-hidden"
                  preview
                />
                <p v-if="field == 'amount'">{{ data.amount }} تومان</p>
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
  </div>
</template>

<script>
import FinancialService from "../../../service/financial";
import ActionTable from "../../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  data() {
    return {
      columns: [
        {
          header: "تصویر رسید پرداخت",
          field: "image",
          width: "w-1/4",
          editable: true,
        },
        { header: "مبلغ", field: "amount", width: "w-1/6", editable: true },
        { header: "تاریخ", field: "date", width: "w-1/12" },
        { header: "وضعیت", field: "status", width: "w-1/6" },
      ],
      fetching: true,
      offlinePaymentList: [{}, {}, {}],
      flag: false,
      financialService: null,
      editingRows: {},
      errors: {},
      statues: {
        new: { value: "پرداخت جدید", severity: "info" },
        pending: { value: "درانتظار بررسی", severity: "warning" },
        verified: { value: "تایید شده", severity: "success" },
        rejected: { value: "رد شده", severity: "danger" },
      },
      bankAccounts: [],
      rootUrl: null,
    };
  },
  methods: {
    getOfflinePayments() {
      this.financialService.getOfflinePayments(
        (data) => {
          this.rootUrl = data.rootUrl;
          this.offlinePaymentList = data.offlinePayments;
          this.offlinePaymentList.forEach((element) => {
            element.status = this.statues[element.status];
          });
          this.fetching = false;
        },
        () => {}
      );
    },
    store(offlinePayment) {
      const data = {
        amount: offlinePayment.amount,
        image: offlinePayment.image,
      };
      this.offlinePaymentList[0] = {};
      this.financialService.storeOfflinePayments(
        data,
        (response) => {
          this.flag = false;
          this.cancelRow(offlinePayment);
          offlinePayment.id = response.id;
          offlinePayment.date = response.date;
          offlinePayment.status = this.statues.pending;
          offlinePayment.amount = offlinePayment.amount
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
            .replace(".000", "");
          this.offlinePaymentList[0] = offlinePayment;
        },
        (error) => {
          this.cancelRow(offlinePayment);
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
        date = date.toLocaleDateString("fa-IR");
        this.offlinePaymentList.unshift({});
        setTimeout(() => {
          this.offlinePaymentList[0] = {
            id: 0,
            status: this.statues.new,
            amount: "",
            image: "",
            date,
          };
          this.editRow(this.offlinePaymentList[0]);
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
    saveRow(offlinePayment, index) {
      if (this.flag) {
        if (
          offlinePayment.image &&
          offlinePayment.image.indexOf("blob:") === -1 &&
          offlinePayment.amount >= 100000
        )
          this.store(offlinePayment);
      } else {
        if (offlinePayment.id != null) {
          index = this.offlinePaymentList.findIndex(
            (e) => e.id == offlinePayment.id
          );
          let data = { id: offlinePayment.id };
          let update = false;
          const prePayRequests = this.offlinePaymentList[index];
          Object.entries(offlinePayment).forEach((key) => {
            if (key[0] == "amount" || key[0] == "banckAccount") {
              if (prePayRequests[key[0]] != key[1]) {
                data[key[0]] = key[1];
                this.offlinePaymentList[index][key[0]] = key[1];
                update = true;
              }
            }
          });
          if (update) {
            this.offlinePaymentList[index].id = null;
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
        this.offlinePaymentList.shift();
        this.flag = false;
      }
    },
    onUpload(id, index, event) {
      const xhr = event.xhr;
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (id > 1)
          Object.entries(this.$refs.table.d_editingMeta).forEach((meta) => {
            if (meta[1].data.id == id) {
              this.$refs.table.d_editingMeta[meta[0]].data.image = xhr.response;
            }
          });
        else this.offlinePaymentList[index].image = xhr.response;
      } else {
        this.offlinePaymentList[index].image = null;
      }
    },
    beforeUpload(event) {
      event.xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    onSelect(index, event) {
      this.offlinePaymentList[index].image = event.files[0].objectURL;
    },
    removeImage(id) {
      Object.entries(this.$refs.table.d_editingMeta).forEach((meta) => {
        if (meta[1].data.id == id) {
          this.$refs.table.d_editingMeta[meta[0]].data.image = null;
        }
      });
    },
  },
  created() {
    this.financialService = new FinancialService();
  },
  mounted() {
    this.getOfflinePayments();
  },
  watch: {
    offlinePaymentList(v) {
      if (v) this.$emit("offlinePayment", v);
    },
  },
};
</script>
