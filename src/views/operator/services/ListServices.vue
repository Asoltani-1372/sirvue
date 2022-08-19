<template>
  <Card>
    <template #title>
      <div class="flex flex-row justify-between items-center">
        <div v-if="!fetching">لیست خدمات</div>
        <Skeleton width="8rem" height="1.5rem" v-else />

        <div v-if="!fetching">
          <Button
            label="افزودن خدمت"
            icon="pi pi-plus"
            class="p-button-raised p-button-success p-button-sm"
            @click="$refs.addServiceDialog.open()"
          />
        </div>
        <Skeleton width="8.1rem" height="2.75rem" v-else />
      </div>
    </template>
    <template #content>
      <DataTable
        :value="services"
        :paginator="!fetching"
        :rows="10"
        :rowHover="!fetching"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} خدمت"
        responsiveLayout="stack"
      >
        <Column header="خدمت " class="w-1/5">
          <template #body="{ data }">
            <div class="flex flex-row justify-center items-center gap-8">
              <Avatar
                :image="data.image"
                shape="circle"
                size="large"
                v-if="data.image"
              />
              <Skeleton shape="circle" size="3rem" v-else />
              <div class="flex items-center" v-if="data.title">
                {{ data.title }}
              </div>
              <Skeleton width="10rem" v-else />
            </div>
          </template>
        </Column>
        <Column field="price" header="قیمت" class="w-1/5">
          <template #body="{ data }">
            <div v-if="data.price">
              {{ data.price }}
            </div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column header="توضیحات" class="w-1/5">
          <template #body="{ data }">
            <div v-if="data.desc">
              {{ data.desc }}
            </div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column header="وضعیت" class="w-1/5">
          <template #body="{ data }">
            <div v-if="data.status">
              <InputSwitch :value="data.status == 'enabled'" @change="changeStatus(data.id, $event)" v-model="data.switch"/>
            </div>
            <Skeleton v-else />
          </template>
        </Column>
        <Column class="w-1/5" header="جزئیات">
          <template #body="{ data }">
            <div v-if="data.id" class="flex gap-3 justify-center">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-warning p-button-sm"
                @click="$refs.updateServiceDialog.open(data)"
              />

              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-sm"
                @click="destroy(data.id)"
              />
              <UpdateServiceDialog ref="updateServiceDialog"/>
            </div>
            <Skeleton v-else />
          </template>
        </Column>
      </DataTable>
      <AddServiceDialog ref="addServiceDialog" @call="updateServiceList()" />
      <UpdateServiceDialog
        ref="updateServiceDialog"
        @call="updateServiceList()"
      />
    </template>
  </Card>
</template>

<script>
import AddServiceDialog from "../../../views/operator/services/AddServiceDialog.vue";
import UpdateServiceDialog from "../../../views/operator/services/UpdateServiceDialog.vue";
import ServicesService from "../../../service/operator/services";
export default {
  components: {
    AddServiceDialog,
    UpdateServiceDialog,
  },
  data() {
    return {
      servicesService: null,
      services: [{}, {}, {}],
      fetching: false,
      loading: false,
      checked: true,
    };
  },

  created() {
    this.servicesService = new ServicesService();
  },

  mounted() {
    this.fetching = true;
    this.servicesService.getServices(
      (data) => {
        this.services = data.services;
        this.fetching = false;
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

  methods: {
    updateServiceList() {
      this.servicesService.getServices(
        (data) => {
          this.services = data.services;
          this.fetching = false;
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

    changeStatus(id , event) {

      this.status = (event.target.value) ? "enable" : "disable";
      
      this.servicesService.changeStatus(
        this.status,
        id,
        () => {
        //   this.toastMessage = this.status == "disable" ? "فعال " : "غیر فعال";
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "وضعیت کاربر تغییر کرد.",
            life: 3000,
          });
          this.loading = false;
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

    destroy(id) {
      this.servicesService.destroy(
        id,
        () => {
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "خدمت با موفقیت حذف شد.",
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
  },
};
</script>

<style>
</style>