<template>
  <div class="list-timings ">
    <Card>
      <template #title>
        <div class="flex items-center gap-3">
          <h5 class="p-mb-2 p-m-md-0 p-as-md-center ml-auto">
            زمانبندی ها
          </h5>
          <Button
            label="حذف"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
          <span class="p-input-icon-right">
            <InputText
              v-model="filters['global'].value"
              placeholder="جسنجو ..."
              class="w-72 p-inputtext-sm"
            />
            <i class="pi pi-search" />
          </span>
        </div>
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="products"
          v-model:selection="selectedProducts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} زمانبندی"
          responsiveLayout="scroll"
        >
          <Column selectionMode="multiple" class="w-1/12"></Column>
          <Column field="name" header="نام" class="w-1/6" />
          <Column field="serviceName" header="نام خدمت" class="w-1/6" />
          <Column field="place" header="منطقه " class="w-1/6" />
          <Column field="date" header="تاریخ" class="w-1/6" />
          <Column field="status" header="وضعیت" class="w-1/6" />
          <Column class="w-1/12" header="حذف">
            <template #body="slotProps">
              <div class="flex gap-4 items-center justify-center">
                <!-- <InputSwitch v-model="slotProps.data.check" /> -->
                <Button
                  icon="pi pi-trash"
                  class="
                    p-button-rounded p-button-danger p-button-xs p-button-sm
                  "
                  @click="confirmDeleteProduct(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="حذف منطقه"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >آیا مطمئنید که میخواهید <b>{{ product.name }}</b
          > را حذف نمایید ?</span
        >
      </div>
      <template #footer>
        <Button
          label="بازگشت"
          class="p-button-text"
          @click="deleteProductDialog = false"
        />
        <Button
          label="حذف شود"
          icon="pi pi-times"
          class="p-button-text p-button-danger"
          @click="deleteProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="حذف زمانبندی"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >آیا مطمئن هستید که می خواهید زمانبندی انتخاب شده را حذف نمایید؟</span
        >
      </div>
      <template #footer>
        <Button
          label="بازگشت"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="حذف شود"
          icon="pi pi-check"
          class="p-button-text text-red-600"
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";

export default {
  data() {
    return {
      products: [
        {
          id: "1000",
          name: "سید سجاد",
          serviceName: "سمپاشی",
          place: "مرکزی",
          date: "1400/10/20",
          status: "فعال",
        },
        {
          id: "1001",
          name: "سید سجاد",
          serviceName: "سمپاشی",
          place: "مرکزی",
          date: "1400/10/20",
          status: "فعال",
        },

        {
          id: "1000",
          name: "سید سجاد",
          serviceName: "سمپاشی",
          place: "مرکزی",
          date: "1400/10/20",
          status: "فعال",
        },
        {
          id: "1001",
          serviceName: "سمپاشی",
          name: "سید سجاد",
          place: "مرکزی",
          date: "1400/10/20",
          status: "فعال",
        },
        {
          id: "1000",
          name: "سید سجاد",
          serviceName: "سمپاشی",
          place: "مرکزی",
          date: "1400/10/20",
          status: "فعال",
        },
        {
          id: "1001",
          name: "سید سجاد",
          serviceName: "سمپاشی",
          place: "مرکزی",
          date: "1400/10/20",
          status: "فعال",
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