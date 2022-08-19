<template>
  <div class="reject flex flex-col gap-8">
    <DataTable
      ref="dt"
      :value="paireds"
      dataKey="id"
      :paginator="showPagination"
      :rows="10"
      :filters="filters"
      :rowHover="true"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} درخواست"
      responsiveLayout="stack"
    >
      <Column header="متقاضی" class="w-1/4">
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <Avatar
              :image="data.applicant.avatar"
              shape="circle"
              class="hidden lg:flex"
              size="large"
              v-if="data.applicant"
            />
            <Skeleton
              shape="circle"
              size="2rem"
              class="hidden lg:flex"
              v-else
            />

            <div v-if="data.applicant">
              {{ data.applicant.fullname}}
            </div>
            <Skeleton width="8rem" v-else />
          </div>
        </template>
      </Column>
      <Column header="خدمات دهنده" class="w-1/4">
        <template #body="{ data }">
          <div class="flex gap-3 items-center">
            <Avatar
              :image="data.servant.avatar"
              shape="circle"
              class="hidden lg:flex"
              size="large"
              v-if="data.servant"
            />
            <Skeleton
              shape="circle"
              size="2rem"
              class="hidden lg:flex"
              v-else
            />
            <div v-if="data.servant">
              {{ data.servant.fullname }}
            </div>
            <Skeleton width="8rem" v-else />
          </div>
        </template>
      </Column>
      <Column header="خدمت" class="w-2/12 trow">
        <template #body="{ data }">
          <div v-if="data.service">{{ data.service }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column header="تاریخ" class="w-2/12 trow">
        <template #body="{ data }">
          <div v-if="data.date">{{ data.date }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column header="ساعت" class="w-2/12 trow">
        <template #body="{ data }">
          <div v-if="data.time">{{ data.time }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column header="مبلغ " class="w-2/12 trow">
        <template #body="{ data }">
          <div v-if="data.price">{{ data.price }}</div>
          <Skeleton v-else />
        </template>
      </Column>
      <Column class="w-2/12 trow" header="جزئیات">
        <template #body="{ data }">
          <div
            class="flex gap-4 items-center justify-center"
            v-if="data.price"
          >
            <Button
              icon="pi pi-eye"
              class="p-button-raised p-button-success p-button-sm"
              label="مشاهده "
              @click="$refs.detailsDialog.open(data)"
              
            />
          </div>
          <Skeleton v-else />
        </template>
      </Column>
    </DataTable>
    <DetailsDialog ref="detailsDialog" :mapShow="true" />
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import DetailsDialog from "./DetailsDialog.vue";
import OperationService from "../../../service/operation";

export default {
  components: { DetailsDialog },
  data() {
    return {
      operationService: null,
      showPagination: false,
      paireds: [{}, {}, {}],

      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
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
    this.operationService = new OperationService();
    this.initFilters();
  },
  mounted() {
    this.operationService.getPairedsPending(
      "PendingDone",
      (data) => {
        this.paireds = data.paireds;
        this.showPagination = true;
      },
    (error) => {
      this.$toast.add({
        severity: "error",
        summary: "خطا",
        detail: error,
        life: 3000,
      });
    }
    );

    // setTimeout(() => {
    //   this.paireds = [
    //     {
    //       applicantAvatar:
    //         "https://primefaces.org/primevue/showcase/demo/images/avatar/xuxuefeng.png",
    //       applicantName: "رسول موسوی",
    //       servantAvatar:
    //         "https://primefaces.org/primevue/showcase/demo/images/avatar/bernardodominic.png",
    //       servantName: "سجاد سلجوقی",
    //       service: "سمپاشی",
    //       date: "1400/11/20",
    //       hour: "11:00",
    //       amount: "20.000.000",
    //     },
    //   ];
    // }, 1000);
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

.trow .p-skeleton {
  @apply w-1/2 lg:w-full !important;
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