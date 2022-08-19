<template>
  <Card>
    <template #title>
      <div v-if="skeleton">لیست خدمات</div>
      <Skeleton width="7rem" v-else />
    </template>
    <template #content>
      <DataTable
        :value="input"
        dataKey="id"
        :paginator="skeleton"
        :rows="10"
        :rowHover="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} خدمت"
        responsiveLayout="stack"
      >
        <Column header="خدمت " class="w-1/6">
          <template #body="{ data }">
            <div v-if="data.title">
              {{ data.title }}
            </div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column field="description" header="توضیحات " class="w-1/6">
          <template #body="{ data }">
            <div v-if="data.desc">
              {{ data.desc }}
            </div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column field="price" header="قیمت" class="w-1/6">
          <template #body="{ data }">
            <div v-if="data.price">
              {{ data.price }}
            </div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column
          field="numberService"
          header="تعداد خدمات دهندگان"
          class="w-1/6"
        >
          <template #body="{ data }">
            <div v-if="data.count != null">
              {{ data.count }}
            </div>
            <Skeleton v-else />
          </template>
        </Column>
        <!-- <Column class="w-1/6" header="مناطق غیر مجاز">
          <template #body="{ data }">
            <div
              class="flex gap-4 items-center justify-center"
              v-if="data.price"
            >
              <Button
                label="مشاهده"
                icon="pi pi-eye"
                class="p-button-text p-button-info"
                @click="$refs.unauthDialog.open()"
              />
            </div>
            <Skeleton v-else />
          </template>
        </Column> -->
        <Column class="w-1/6" header="جزئیات">
          <template #body="{ data }">
            <div
              class="flex gap-4 items-center justify-center"
              v-if="data.price"
            >
              <InputSwitch v-model="data.active" @click="activeService(data)" />
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-warning"
                @click="$refs.detailsDialog.open(data)"
              />
            </div>
            <Skeleton v-else />
          </template>
        </Column>
      </DataTable>
      <UnauthDialog ref="unauthDialog" />
      <DetailsDialog ref="detailsDialog" @call="updateList()" />
    </template>
  </Card>
</template>

<script>
import DetailsDialog from "./DetailsDialog.vue";
import UnauthDialog from "./UnauthDialog.vue";
import ServicesService from "../../../service/admin/services";

export default {
  props: ["input", "skeleton"],
  components: { UnauthDialog, DetailsDialog },
  data() {
    return {
      servicesService: null,
    };
  },
  productService: null,
  created() {
    this.servicesService = new ServicesService();
  },

  methods: {
    activeService(service) {
      this.servicesService.activeService(
        service.id,
        (data) => {
         
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: data.active ? "فعال شد." : "غیرفعال شد",
            life: 3000,
          });
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
    },

    updateList() {
      this.$emit("call", "");
    },
  },
};
</script>

<style>
</style>