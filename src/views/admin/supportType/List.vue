<template>
  <Card>
    <template #title> پشتیبانی ها </template>
    <template #content>
      <DataTable
        ref="dt"
        :value="done"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :rowHover="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} زمانبندی"
        responsiveLayout="scroll"
      >
        <Column field="service" header="پشتیبان " class="w-1/5" />
        <Column field="numberService" header="تعداد پشتیبان" class="w-1/5" />
        <Column class="w-1/5" header="حذف">
          <template #body>
            <div class="flex gap-4 items-center justify-center">
              <!-- <InputSwitch v-model="slotProps.data.check" /> -->
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="$refs.serviceDelete.open()"
              />
            </div>
          </template>
        </Column>
      </DataTable>
      <DeleteServiceItemDialog ref="serviceDelete" />
    </template>
  </Card>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import DeleteServiceItemDialog from "./DeleteSupportItemDialog.vue";

export default {
  components: { DeleteServiceItemDialog },
  data() {
    return {
      done: [
        {
          service: "سمپاشی",
          numberService: "123",
        },
        {
          service: "کودپاشی",
          numberService: "123",
        },

        {
          service: "سمپاشی",
          numberService: "123",
        },
        {
          service: "سمپاشی",
          numberService: "123",
        },
        {
          service: "سمپاشی",
          numberService: "123",
        },
        {
          service: "سمپاشی",
          numberService: "123",
        },
      ],
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
     
    };
  },
  productService: null,
  created() {
    //this.productService = new ProductService();
    this.initFilters();
  },
  mounted() {
    //this.productService.getProducts().then(data => this.products = data);
  },
  methods: {
    formatCurrency(value) {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    },
    openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;

      if (this.product.name.trim()) {
        if (this.product.id) {
          this.product.inventoryStatus = this.product.inventoryStatus.value
            ? this.product.inventoryStatus.value
            : this.product.inventoryStatus;
          this.products[this.findIndexById(this.product.id)] = this.product;
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Updated",
            life: 3000,
          });
        } else {
          this.product.id = this.createId();
          this.product.code = this.createId();
          this.product.image = "product-placeholder.svg";
          this.product.inventoryStatus = this.product.inventoryStatus
            ? this.product.inventoryStatus.value
            : "INSTOCK";
          this.products.push(this.product);
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Created",
            life: 3000,
          });
        }

        this.productDialog = false;
        this.product = {};
      }
    },
    editProduct(product) {
      this.product = { ...product };
      this.productDialog = true;
    },
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductDialog = true;
    },
    deleteProduct() {
      this.products = this.products.filter((val) => val.id !== this.product.id);
      this.deleteProductDialog = false;
      this.product = {};
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }

      return index;
    },
    createId() {
      let id = "";
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteProductsDialog = true;
    },
    deleteSelectedProducts() {
      this.products = this.products.filter(
        (val) => !this.selectedProducts.includes(val)
      );
      this.deleteProductsDialog = false;
      this.selectedProducts = null;
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000,
      });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
};
</script>

<style>
</style>