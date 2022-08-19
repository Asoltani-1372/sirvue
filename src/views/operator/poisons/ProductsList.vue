<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <p v-else>محصولات</p>
        <Skeleton v-if="fetching" width="6rem" height="1.8rem" />
        <Button
          v-else-if="productsList.length > 0"
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
        :value="productsList"
        editMode="row"
        ref="table"
        dataKey="id"
        v-model:editingRows="editingRows"
        responsiveLayout="scroll"
        :paginator="productsList.length > 10"
        :rows="10"
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
            <InputText
              v-if="field == 'title'"
              v-model="data[field]"
              :class="{ 'p-invalid': errors[field] }"
              class="p-inputtext-sm w-full"
              placeholder="عنوان محصول"
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
              <p v-if="field == 'terrain' && terrains.length > 0">
                {{ terrains.filter((e) => e.id == data.terrain)[0].title }}
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
import ProductService from "../../../service/operator/products.js";
import ActionTable from "../../../components/basic/ActionTable.vue";
export default {
  components: { ActionTable },
  props: ["terrains"],
  data() {
    return {
      columns: [
        { header: "عنوان", field: "title", width: "w-1/3", editable: true },
        { header: "زمین", field: "terrain", width: "w-1/12", editable: true },
        { header: "وضعیت", field: "status", width: "w-1/12" },
        { header: "عملیات", field: "action", width: "w-1/12" },
      ],
      fetching: true,
      productsList: [{}, {}, {}],
      flag: false,
      productService: null,
      editingRows: {},
      errors: {},
    };
  },
  methods: {
    getList() {
      this.productService.getList(
        (data) => {
          this.productsList = data.products;
          this.fetching = false;
        },
        () => {}
      );
    },
    store(product) {
      this.productsList[0] = {};
      this.productService.store(
        product,
        (reposnse) => {
          this.flag = false;
          this.cancelRow(product);
          product.id = reposnse.id;
          this.productsList[0] = product;
        },
        (error) => {
          this.cancelRow(product);
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
    update(product, index) {
      this.productService.update(
        product,
        () => {
          this.cancelRow(product);
          this.productsList[index].id = product.id;
        },
        (error) => {
          this.cancelRow(product);
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
            this.productsList.splice(index, 1);
            this.$refs.table.d_editingMeta = {};
          } else {
            this.productsList[index].id = null;
            this.productService.destroy(
              id,
              () => {
                this.productsList.splice(index, 1);
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
        this.productsList[0].status = event;
      } else if (this.productsList[index].status != null) {
        this.productsList[index].status = null;
        const status = event ? "enable" : "disable";
        const data = {
          status,
          id,
        };
        this.productService.changeStatus(
          data,
          () => {
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "باموفقیت " + (event ? "" : "غیر") + "فعال شد",
              life: 3000,
            });
            this.productsList[index].status = event;
          },
          () => {}
        );
      }
    },
    addRow() {
      this.$refs.table.resetPage();
      if (!this.flag) {
        this.flag = true;
        this.productsList.unshift({});
        setTimeout(() => {
          this.productsList[0] = {
            id: 1,
            status: true,
            title: "",
            terrain: {},
          };
          this.editRow(this.productsList[0]);
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
    saveRow(product, index) {
      if (this.flag) {
        if (product.title.length > 1 && product.terrain) this.store(product);
      } else {
        if (product.id) {
          index = this.productsList.findIndex((e) => e.id == product.id);
          let data = { id: product.id };
          let update = false;
          const preProduct = this.productsList[index];
          Object.entries(product).forEach((key) => {
            if (preProduct[key[0]] != key[1]) {
              data[key[0]] = key[1];
              this.productsList[index][key[0]] = key[1];
              update = true;
            }
          });
          if (update) {
            this.productsList[index].id = null;
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
        this.productsList.shift();
        this.flag = false;
      }
    },
  },
  created() {
    this.productService = new ProductService();
  },
  mounted() {
    this.getList();
  },
  watch: {
    productsList(v) {
      if (v) this.$emit("products", v);
    },
  },
};
</script>
