<template>
  <Card class="flex-grow">
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>مسافت</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="distances.length > 0"
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
        :value="distancesList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="distances.length > 5"
        :rows="5"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
      >
        <template #empty>
          <p class="text-xs py-2">اولین محصول را اضافه نمایید</p>
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
            <div v-if="field == 'breakpoint'" style="direction: ltr">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon border-r-0 border-l text-sm">
                  KM
                </span>
                <InputNumber
                  v-model="data[field]"
                  :class="{ 'p-invalid': errors[field] }"
                  class="p-inputtext-sm w-full"
                  placeholder="مسافت را وارد نمایید"
                  autofocus
                  style="direction: rtl"
                />
              </div>
            </div>
            <div v-if="field == 'value'" style="direction: ltr">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon border-r-0 border-l text-sm">
                  %
                </span>
                <InputNumber
                  v-model="data[field]"
                  :class="{ 'p-invalid': errors[field] }"
                  class="p-inputtext-sm w-full"
                  placeholder="درصد تخفیف را وارد نمایید"
                  style="direction: rtl"
                />
              </div>
            </div>
          </template>
          <template #body="{ data, field, index }">
            <div v-if="data.id" class="flex items-center justify-center">
              <p v-if="field == 'breakpoint'">{{ data.breakpoint }} کیلومتر</p>
              <p v-if="field == 'value'">{{ data.value }} درصد</p>
              <InputSwitch
                v-if="field == 'status'"
                class="h-6"
                @input="changeStatus(data.id, $event, index)"
                v-model="data.status"
                :disabled="data.status == null"
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
import ActionTable from "../../../components/basic/ActionTable.vue";
import DiscountsService from "../../../service/operator/discounts.js";
export default {
  components: { ActionTable },
  props: ["distances"],
  data() {
    return {
      columns: [
        {
          header: "اندازه",
          field: "breakpoint",
          width: "w-1/3",
          editable: true,
        },
        { header: "تخفیف", field: "value", width: "w-1/3", editable: true },
        { header: "عملیات", field: "action", width: "w-1/6" },
      ],
      distancesList: this.distances,
      fetching: true,
      flag: false,
      discountsService: null,
      editingRows: {},
      errors: {},
    };
  },
  methods: {
    store(distance) {
      this.distancesList[0] = {};
      this.discountsService.store(
        distance,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(distance);
          distance.id = reposnse.id;
          this.distancesList[0] = distance;
        },
        (error) => {
          this.cancelRow(distance);
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
    update(distance, index) {
      index -= (index % 5) * 5;
      this.discountsService.update(
        distance,
        () => {
          this.cancelRow(distance);
          this.distancesList[index].id = distance.id;
        },
        (error) => {
          this.cancelRow(distance);
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
        
        message: "آیا از حذف این زمین اطمینان دارید؟",
        icon: "pi pi-info-circle",
        acceptLabel: "حذف شود",
        rejectLabel: "بازگشت",
        acceptClass: "p-button-danger",
        accept: () => {
          if (this.flag) {
            this.flag = false;
            this.distancesList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.distancesList[index].id = null;
            this.discountsService.destroy(
              id,
              () => {
                this.distancesList.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              (error) => {
                this.distancesList[index].id = id;
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
    changeStatus(id, event, index) {
      if (this.flag) {
        this.distancesList[0].status = event;
      } else if (this.distancesList[index].status != null) {
        this.distancesList[index].status = null;
        const status = event ? "enable" : "disable";
        const data = {
          status,
          id,
        };
        this.discountsService.changeStatus(
          data,
          () => {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "باموفقیت " + (event ? "" : "غیر") + "فعال شد",
              life: 3000,
            });
            this.distancesList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.distancesList.unshift({});
        setTimeout(() => {
          this.distancesList[0] = {
            id: 1,
            type: "distance",
            breakpoint: null,
            value: null,
          };
          this.editRow(this.distancesList[0]);
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
    saveRow(distance, index) {
      if (this.flag) {
        if (distance.breakpoint > 0 && distance.value > 0) this.store(distance);
      } else {
        if (distance.id) {
          index = this.distancesList.findIndex((e) => e.id == distance.id);
          let data = { id: distance.id };
          let update = false;
          const predistance = this.distancesList[index];
          Object.entries(distance).forEach((key) => {
            if (predistance[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.distancesList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.distancesList[index].id = null;
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
        this.distancesList.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.discountsService = new DiscountsService();
  },
  watch: {
    distances(v) {
      this.distancesList = v;
      this.fetching = false;
    },
  },
};
</script>
