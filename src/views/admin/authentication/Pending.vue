<template>
  <div class="done flex flex-col gap-8">
    <DataTable
      ref="dt"
      :value="pending"
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
      <Column field="name" header="نام" class="w-1/6" />
      <Column field="dateBirth" header="تاریخ درخواست" class="w-1/6" />
      <Column field="role" header="نقش" class="w-1/6" />
      <Column class="w-1/3" header="جزئیات">
        <template #body>
          <div class="flex gap-4 items-center justify-center">
            <Button
              icon="pi pi-eye"
              class="p-button-raised p-button-success p-button-sm"
              label="مشاهده "
              @click="$refs.pendingDialog.open()"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <PendingDialog ref="pendingDialog"/>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import PendingDialog from './PendingDialog.vue'

export default {
    components: {PendingDialog},
  data() {
    return {
      pending: [
        {
          id: "1000",
          name: "سید رسول موسوی",
          dateBirth: "1400/08/12",
          gender: "مرد",
          nationalCode: "33243243243",
          nationalCodeImage: "https://picsum.photos/200/300?grayscale",
          role: "نقش",
        },
        {
          id: "1001",
          name: "سید رسول موسوی",
          dateBirth: "کودپاشی",
          gender: "مرد",
          nationalCode: "33243243243",
          nationalCodeImage: "https://picsum.photos/200/300",
          role: "نقش",
        },

        {
          id: "1000",
          name: "سید رسول موسوی",
          dateBirth: "1400/08/12",
          gender: "مرد",
          nationalCode: "33243243243",
          nationalCodeImage: "https://picsum.photos/200/300",
          role: "نقش",
        },
        {
          id: "1001",
          name: "سید رسول موسوی",
          dateBirth: "1400/08/12",
          gender: "مرد",
          nationalCode: "33243243243",
          nationalCodeImage: "https://picsum.photos/200/300",
          role: "نقش",
        },
        {
          id: "1000",
          name: "سید رسول موسوی",
          dateBirth: "1400/08/12",
          gender: "مرد",
          nationalCode: "33243243243",
          nationalCodeImage: "https://picsum.photos/200/300",
          role: "نقش",
        },
        {
          id: "1001",
          name: "سید رسول موسوی",
          dateBirth: "1400/08/12",
          gender: "مرد",
          nationalCode: "33243243243",
          nationalCodeImage: "https://picsum.photos/200/300",
          role: "نقش",
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

<style scoped>
.p-button-xs {
  @apply w-10 h-10 text-sm !important;
}
</style>

<style>
.list-timings {
  @apply w-8/12;
}

.list-timings td {
  @apply text-right !important;
}
th:last-child > div {
  @apply justify-center !important;
}
.p-datatable .p-datatable-thead > tr > th {
  @apply text-gray-800 !important;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-paginator {
  direction: ltr;
  @apply flex-row-reverse gap-px;
}
.p-paginator > button {
  @apply transform rotate-180;
}
</style>