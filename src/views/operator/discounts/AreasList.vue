<template>
  <Card class="flex-grow">
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>مساحت</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="areas.length > 0"
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
        :value="areasList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="areas.length > 5"
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
                  10KM<sup>2</sup>
                </span>
                <InputNumber
                  v-model="data[field]"
                  :class="{ 'p-invalid': errors[field] }"
                  class="p-inputtext-sm w-full"
                  placeholder="مساحت را وارد نمایید"
                  style="direction: rtl"
                  autofocus
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
              <p v-if="field == 'breakpoint'">{{ data.breakpoint }} هکتار</p>
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
  props: ["areas"],
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
      areasList: this.areas,
      fetching: true,
      flag: false,
      productService: null,
      editingRows: {},
      errors: {},
    };
  },
  methods: {
    store(area) {
      this.areasList[0] = {};
      this.discountsService.store(
        area,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(area);
          area.id = reposnse.id;
          this.areasList[0] = area;
        },
        () => {}
      );
    },
    update(area, index) {
      index -= (index % 5) * 5;
      this.discountsService.update(
        area,
        () => {
          this.cancelRow(area);
          this.areasList[index].id = area.id;
        },
        () => {}
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
            this.areasList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.areasList[index].id = null;
            this.discountsService.destroy(
              id,
              () => {
                this.areasList.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              (error) => {
                this.areasList[index].id = id;
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
        this.areasList[0].status = event;
      } else if (this.areasList[index].status != null) {
        this.areasList[index].status = null;
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
            this.areasList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.areasList.unshift({});
        setTimeout(() => {
          this.areasList[0] = {
            id: 1,
            type: "area",
            breakpoint: null,
            value: null,
          };
          this.editRow(this.areasList[0]);
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
    saveRow(area, index) {
      if (this.flag) {
        if (area.breakpoint > 0 && area.value > 0) this.store(area);
      } else {
        if (area.id) {
          index = this.areasList.findIndex((e) => e.id == area.id);

          let data = { id: area.id };
          let update = false;
          const prearea = this.areasList[index];
          Object.entries(area).forEach((key) => {
            if (prearea[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.areasList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.areasList[index].id = null;
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
        this.areasList.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.discountsService = new DiscountsService();
  },
  watch: {
    areas(v) {
      this.areasList = v;
      this.fetching = false;
    },
  },
};
</script>
