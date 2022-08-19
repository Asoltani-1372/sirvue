<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>انواع سم</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="poisonTypesList.length > 0"
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
        :value="poisonTypesList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="poisonTypesList.length > 5"
        :rows="5"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate=""
      >
        <template #empty>
          <p class="text-xs py-2">اولین نوع سم را اضافه نمایید</p>
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
              placeholder="عنوان نوع سم"
              autofocus
            />
          </template>
          <template #body="{ data, field, index }">
            <div v-if="data.id" class="flex items-center justify-center">
              <p v-if="field == 'title'">{{ data.title }}</p>
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
import PoisonTypeService from "../../../service/operator/poisonTypes.js";
import ActionTable from "../../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  data() {
    return {
      columns: [
        { header: "عنوان", field: "title", width: "w-1/3", editable: true },
        { header: "وضعیت", field: "status", width: "w-1/12" },
        { header: "عملیات", field: "action", width: "w-1/12" },
      ],
      fetching: true,
      poisonTypesList: [{}, {}, {}],
      flag: false,
      poisonTypeService: null,
      editingRows: {},
      errors: {},
    };
  },
  methods: {
    getList() {
      this.poisonTypeService.getList(
        (data) => {
          this.poisonTypesList = data.poisonTypes;
          this.fetching = false;
        },
        () => {}
      );
    },
    store(poisonType) {
      this.poisonTypesList[0] = {};
      this.poisonTypeService.store(
        poisonType,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(poisonType);
          poisonType.id = reposnse.id;
          this.poisonTypesList[0] = poisonType;
        },
        (error) => {
          this.cancelRow(poisonType);
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
    update(poisonType, index) {
      index -= (index % 5) * 5;
      this.poisonTypeService.update(
        poisonType,
        () => {
          this.cancelRow(poisonType);
          this.poisonTypesList[index].id = poisonType.id;
        },
        (error) => {
          this.cancelRow(poisonType);
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
        message: "آیا از حذف این نوع سم اطمینان دارید؟",
        icon: "pi pi-info-circle",
        acceptLabel: "حذف شود",
        rejectLabel: "بازگشت",
        acceptClass: "p-button-danger",
        accept: () => {
          if (this.flag) {
            this.flag = false;
            this.poisonTypesList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.poisonTypesList[index].id = null;
            this.poisonTypeService.destroy(
              id,
              () => {
                this.poisonTypesList.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              () => {}
            );
          }
        },
        reject: () => {},
      });
    },
    changeStatus(id, event, index) {
      if (this.flag) {
        this.poisonTypesList[0].status = event;
      } else if (this.poisonTypesList[index].status != null) {
        this.poisonTypesList[index].status = null;
        const status = event ? "enable" : "disable";
        const data = {
          status,
          id,
        };
        this.poisonTypeService.changeStatus(
          data,
          () => {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "باموفقیت " + (event ? "" : "غیر") + "فعال شد",
              life: 3000,
            });
            this.poisonTypesList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.poisonTypesList.unshift({});
        setTimeout(() => {
          this.poisonTypesList[0] = {
            id: 1,
            status: true,
            title: "",
          };
          this.editRow(this.poisonTypesList[0]);
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
    saveRow(poisonType, index) {
      if (this.flag) {
        if (poisonType.title.length > 2) this.store(poisonType);
      } else {
        if (poisonType.id) {
          index = this.poisonTypesList.findIndex((e) => e.id == poisonType.id);
          let data = { id: poisonType.id };
          let update = false;
          const prepoisonType = this.poisonTypesList[index];
          Object.entries(poisonType).forEach((key) => {
            if (prepoisonType[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.poisonTypesList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.poisonTypesList[index].id = null;
            this.update(data, index);
          }
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
        this.poisonTypesList.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.poisonTypeService = new PoisonTypeService();
  },
  mounted() {
    this.getList();
  },
  watch: {
    poisonTypesList(v) {
      if (v) this.$emit("types", v);
    },
  },
};
</script>
