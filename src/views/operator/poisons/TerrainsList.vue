<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>انواع زمین</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="terrainsList.length > 0"
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
        :value="terrainsList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="terrainsList.length > 5"
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
              placeholder="عنوان محصول"
              autofocus
            />
            <InputNumber
              v-if="field == 'ratio'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              class="p-inputtext-sm w-full"
              placeholder="ضریب هزینه"
              autofocus
            />
            <Dropdown
              v-if="field == 'terrain'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              :options="terrains"
              class="p-inputtext-sm w-full"
              optionLabel="title"
              optionValue="id"
              placeholder="نوع زمین"
            />
          </template>
          <template #body="{ data, field, index }">
            <div v-if="data.id" class="flex items-center justify-center">
              <p v-if="field == 'title'">{{ data.title }}</p>
              <p v-if="field == 'ratio'">{{ data.ratio }}</p>
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
                @destroy="destroy(data, index, $event)"
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
import TerrainService from "../../../service/operator/terrains.js";
import ActionTable from "../../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  data() {
    return {
      columns: [
        { header: "عنوان", field: "title", width: "w-1/3", editable: true },
        {
          header: "ضریب هزینه",
          field: "ratio",
          width: "w-1/3",
          editable: true,
        },
        { header: "وضعیت", field: "status", width: "w-1/12" },
        { header: "عملیات", field: "action", width: "w-1/12" },
      ],
      fetching: true,
      terrainsList: [{}, {}, {}],
      flag: false,
      terrainService: null,
      editingRows: {},
      errors: {},
      change: true
    };
  },
  methods: {
    getList() {
      this.terrainService.getList(
        (data) => {
          this.terrainsList = data.terrains;
          this.fetching = false;
        },
        () => {}
      );
    },
    store(terrain) {
      this.terrainsList[0] = {};
      this.terrainService.store(
        terrain,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(terrain);
          terrain.id = reposnse.id;
          this.terrainsList[0] = terrain;
        },
        (error) => {
          this.cancelRow(terrain);
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
    update(terrain, index) {
      if(index > 5) index -= (index % 5) * 5;
      this.terrainService.update(
        terrain,
        () => {
          this.change = true;
          this.cancelRow(terrain);
          console.log(index);
          this.terrainsList[index].id = terrain.id;
        },
        (error) => {
          this.cancelRow(terrain);
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
    destroy(data, index) {
      const id = data.id;
      this.$confirm.require({
        message: "آیا از حذف این نوع زمین اطمینان دارید؟",
        icon: "pi pi-info-circle",
        acceptLabel: "حذف شود",
        rejectLabel: "بازگشت",
        acceptClass: "p-button-danger float-left",
        accept: () => {
          if (this.flag) {
            this.flag = false;
            this.terrainsList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.change = false;
            this.terrainsList[index].id = null;
            this.terrainService.destroy(
              id,
              () => {
                this.change = true;
                this.terrainsList.splice(index, 1);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "باموفقیت حذف شد",
                  life: 3000,
                });
              },
              (error) => {
                this.terrainsList[index].id = id;
                this.$toast.add({
                  severity: "error",
                  summary: "خطا",
                  detail: error,
                  life: 3000,
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
        this.terrainsList[0].status = event;
      } else if (this.terrainsList[index].status != null) {
        this.terrainsList[index].status = null;
        const status = event ? "enable" : "disable";
        const data = {
          status,
          id,
        };
        this.terrainService.changeStatus(
          data,
          () => {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "باموفقیت " + (event ? "" : "غیر") + "فعال شد",
              life: 3000,
            });
            this.terrainsList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.terrainsList.unshift({});
        setTimeout(() => {
          this.terrainsList[0] = {
            id: 1,
            status: true,
            ratio: 1,
            title: "",
            terrain: {},
          };
          this.editRow(this.terrainsList[0]);
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
    saveRow(terrain, index) {
      if (this.flag) {
        if (terrain.title.length > 2 && terrain.terrain) this.store(terrain);
      } else {
        if (terrain.id) {
          index = this.terrainsList.findIndex((e) => e.id == terrain.id);
          let data = { id: terrain.id };
          let update = false;
          const preterrain = this.terrainsList[index];
          Object.entries(terrain).forEach((key) => {
            if (preterrain[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.terrainsList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.change = false;
            this.terrainsList[index].id = null;
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
        this.terrainsList.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.terrainService = new TerrainService();
  },
  mounted() {
    this.getList();
  },
  watch: {
    terrainsList(v) {
      if (v && this.change) this.$emit("terrains", v);
    },
  },
};
</script>
