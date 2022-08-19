<template>
  <Card class="w-full">
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>سموم</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="poisonsList.length > 0"
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
        :value="poisonsList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="poisonsList.length > 10"
        :rows="10"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
      >
        <template #empty>
          <p class="text-xs py-2">اولین سم را اضافه نمایید</p>
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
            <InputText
              v-if="field == 'title'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              class="p-inputtext-sm w-full"
              placeholder="عنوان سم"
              autofocus
            />
            <Dropdown
              v-if="field == 'type'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              :options="types"
              class="p-inputtext-sm w-full"
              optionLabel="title"
              optionValue="id"
              placeholder="نوع سم"
            />
            <Dropdown
              v-if="field == 'product'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              :options="products"
              class="p-inputtext-sm w-full"
              optionLabel="title"
              optionValue="id"
              placeholder="نوع محصول"
            />
            <InputText
              v-if="field == 'value'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              class="p-inputtext-sm w-full"
              placeholder="مقدار"
              autofocus
            />
            <Dropdown
              v-if="field == 'unit'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              :options="units"
              class="p-inputtext-sm w-full"
              optionLabel="title"
              optionValue="id"
              placeholder="واحد"
            />
          </template>
          <template #body="{ data, field, index }">
            <div v-if="data.id" class="flex items-center justify-center">
              <p v-if="field == 'title'">{{ data.title }}</p>
              <p v-if="field == 'type' && types.length > 0">
                {{ types.filter((e) => e.id == data.type)[0].title }}
              </p>
              <p v-if="field == 'product' && products.length > 0">
                {{ products.filter((e) => e.id == data.product)[0].title }}
              </p>
              <p v-if="field == 'value'">{{ data.value }}</p>
              <p v-if="field == 'unit' && units.length > 0">
                {{ units.filter((e) => e.id == data.unit)[0].title }}
              </p>
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
import PoisonService from "../../../service/operator/poisons.js";
import ActionTable from "../../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  props: ["types", "products"],
  data() {
    return {
      columns: [
        { header: "عنوان", field: "title", width: "w-1/12", editable: true },
        { header: "نوع", field: "type", width: "w-1/12", editable: true },
        { header: "محصول", field: "product", width: "w-1/12", editable: true },
        { header: "مقدار", field: "value", width: "w-1/12", editable: true },
        { header: "واحد", field: "unit", width: "w-1/12", editable: true },
        { header: "وضعیت", field: "status", width: "w-1/12" },
        { header: "عملیات", field: "action", width: "w-1/12" },
      ],
      fetching: true,
      poisonsList: [{}, {}, {}],
      units: [],
      flag: false,
      poisonService: null,
      editingRows: {},
      errors: {},
    };
  },
  methods: {
    getList() {
      this.poisonService.getList(
        (data) => {
          this.poisonsList = data.poisons;
          this.units = data.units;
          this.fetching = false;
        },
        () => {}
      );
    },
    store(poison) {
      this.poisonsList[0] = {};
      this.poisonService.store(
        poison,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(poison);
          poison.id = reposnse.id;
          this.poisonsList[0] = poison;
        },
        (error) => {
          this.cancelRow(poison);
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
    update(poison, index) {
      this.poisonService.update(
        poison,
        () => {
          this.cancelRow(poison);
          this.poisonsList[index].id = poison.id;
        },
        (error) => {
          this.cancelRow(poison);
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
        acceptClass: "p-button-danger float-left",
        accept: () => {
          if (this.flag) {
            this.flag = false;
            this.poisonsList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.poisonsList[index].id = null;
            this.poisonService.destroy(
              id,
              () => {
                this.poisonsList.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              (error) => {
                this.poisonsList[index].id = id;
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
        this.poisonsList[0].status = event;
      } else if (this.poisonsList[index].status != null) {
        this.poisonsList[index].status = null;
        const status = event ? "enable" : "disable";
        const data = {
          status,
          id,
        };
        this.poisonService.changeStatus(
          data,
          () => {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "باموفقیت " + (event ? "" : "غیر") + "فعال شد",
              life: 3000,
            });
            this.poisonsList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.poisonsList.unshift({});
        setTimeout(() => {
          this.poisonsList[0] = {
            id: 1,
            status: true,
            title: "",
            type: null,
            product: null,
            value: null,
            unit: null,
          };
          this.editRow(this.poisonsList[0]);
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
    saveRow(poison, index) {
      if (this.flag) {
        if (
          poison.title.length > 2 &&
          poison.type &&
          poison.product &&
          poison.value.length > 0 &&
          poison.unit
        )
          this.store(poison);
      } else {
        if (poison.id) {
          index = this.poisonsList.findIndex((e) => e.id == poison.id);
          let data = { id: poison.id };
          let update = false;
          const prepoison = this.poisonsList[index];
          Object.entries(poison).forEach((key) => {
            if (prepoison[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.poisonsList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.poisonsList[index].id = null;
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
        this.poisonsList.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.poisonService = new PoisonService();
  },
  mounted() {
    this.getList();
  },
};
</script>
