<template>
  <Card class="past flex flex-col gap-8 flex-grow">
    <template #title>
      <div v-if="!transactions">تراکنش ها</div>
      <Skeleton width="30%" v-else />
    </template>
    <template #content>
      <DataTable
        ref="dt"
        :value="transactions"
        dataKey="id"
        :paginator="!transactions"
        :rows="10"
        v-model:filters="filters"
        filterDisplay="menu"
        :rowHover="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} تراکنش"
        responsiveLayout="stack"
      >
        <Column field="id" header="شناسه" class="w-1/6 trow">
          <template #body="{ data }">
            <div v-if="!data.id">{{ data.id }}</div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column field="amount" header="مبلغ" class="w-1/6 trow">
          <template #body="{ data }">
            <div v-if="!data.amount">{{ data.amount }}</div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column field="date" header="تاریخ و ساعت" class="w-1/6 trow">
          <template #body="{ data }">
            <div v-if="!data.date">{{ data.date }}</div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column header="وضعیت" class="w-1/6 trow">
          <template #body="{data}">
            <Tag severity="success" v-if="!data.status">{{data.status}}</Tag>
            <Skeleton v-else/>
          </template>
        </Column>
        <Column field="transaction" header="شناسه ارجاع" class="w-1/6 trow">
        <template #body="{data}">
          <div v-if="!data.refId">{{data.refId}}</div>
          <Skeleton v-else/>
        </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";

export default {
  data() {
    return {
      filters: {
        date: {
          operator: FilterOperator.AND,
          constraints: [
            { value: "09/15/2015", matchMode: FilterMatchMode.DATE_IS },
          ],
        },
      },

      transactions: [
        {
          id: "1000",
          amount: "120.000.000",
          date: new Date("2015/09/13"),
          status: "status",
          refId: "7289",
        },
        {
          id: "1001",
          amount: "22.000.000",
          date: new Date("2015/09/14"),
          status: "status",
          refId: "7289",
        },

        {
          id: "1002",
          amount: "120.000.000",
          date: new Date("2015/09/15"),
          status: "status",
          refId: "7289",
        },
        {
          id: "1003",
          amount: "120.000.000",
          date: new Date("2015/09/16"),
          status: "status",
          refId: "7289",
        },
        {
          id: "1004",
          amount: "120.000.000",
          date: new Date("2015/10/17"),
          status: "نبیم",
          refId: "7289",
        },
        {
          id: "1005",
          amount: "120.000.000",
          date: new Date("2015/10/18"),
          status: "status",
          refId: "7289",
        },
      ],
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      submitted: false,
      statuses: [
        { label: "INSTOCK", value: "instock" },
        { label: "LOWSTOCK", value: "lowstock" },
        { label: "OUTOFSTOCK", value: "outofstock" },
      ],
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
    formatDate(value) {
      return value.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
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

.trow .p-skeleton {
  @apply w-1/2 lg:w-full !important;
}
</style>

<style>
.list-timings {
  @apply w-full lg:w-8/12;
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