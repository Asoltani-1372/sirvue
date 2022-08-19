<template>
  <Card class="reject flex flex-col gap-8">
    <template #title>
      <div class="flex justify-between items-center">
        <div v-if="!skeleton">کاربران</div>
        <Skeleton width="10rem" height="1.2rem" v-else />
        <div>
          <Button
            label="افزودن کاربر"
            class="p-button-raised p-button-success p-button-sm"
            icon="pi pi-plus"
            @click="$refs.addUserDialog.open()"
            v-if="!skeleton"
          />
          <Skeleton v-else width="7.5rem" height="2.7rem" />
        </div>
      </div>
    </template>
    <template #content>
      <DataTable
        ref="dt"
        :value="input"
        dataKey="id"
        :paginator="input"
        :rows="10"
        :rowHover="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} کاربر"
        responsiveLayout="stack"
      >
        <Column field="name" header="نام" class="w-1/6">
          <template #body="{ data }">
            <div class="flex gap-3 items-center">
              <Avatar
                :image="data.profile.avatar"
                shape="circle"
                class="hidden lg:flex"
                v-if="data.profile"
              />
              <Skeleton
                v-else
                size="2rem"
                shape="circle"
                class="hidden lg:flex"
              />
              <div v-if="data.profile">
                {{ data.profile.fullname }}
              </div>
              <Skeleton v-else width="10rem" />
            </div>
          </template>
        </Column>

        <Column field="role" header="نقش" class="w-1/6">
          <template #body="{ data }">
            <Tag
              value="متقاضی"
              severity="success"
              v-if="data.role == 'applicant'"
            />
            <Tag
              value="خدمت دهنده"
              severity="info"
              v-if="data.role == 'servant'"
            />
            <Tag value="مدیر" severity="warning" v-if="data.role == 'admin'" />
            <Tag
              value="پشتیبان"
              severity="danger"
              v-if="data.role == 'supporter'"
            />
          </template>
        </Column>

        <Column field="try-time" header="تاریخ عضویت" class="w-1/6">
          <template #body="{ data }">
            <div v-if="data.register_time">{{ data.register_time }}</div>
            <Skeleton v-else />
          </template>
        </Column>

        <Column field="role" header="وضعیت" class="w-1/6">
          <template #body="{ data }">
            <div v-if="data.status">
              {{ data.status == "active" ? "" : "غیر" }}فعال
            </div>
            <Skeleton v-else />
          </template>
        </Column>

        <Column class="w-1/6" header="جزئیات">
          <template #body="{ data }">
            <div class="flex gap-4 items-center justify-center">
              <Button
                icon="pi pi-eye"
                class="p-button-raised p-button-success p-button-sm"
                label="مشاهده "
                @click="$refs.detailsDialog.open(data)"
                v-if="data.status"
              />
              <Skeleton v-else />
            </div>
          </template>
        </Column>
      </DataTable>
      <AddUserDialog ref="addUserDialog" :input="roles" @call="updateList()" />
      <DetailsDialog ref="detailsDialog" :roles1="roles" @call="updateList()" />
    </template>
  </Card>
</template>

<script>
import AddUserDialog from "../../../views/admin/users/AddUserDialog.vue";
import DetailsDialog from "../../../views/admin/users/DetailsDialog.vue";

export default {
  props: ["input", "roles"],
  components: { AddUserDialog, DetailsDialog },
  data() {
    return {
      skeleton: true,
    };
  },

  created() {},

  mounted() {},

  methods: {
    updateList() {
      this.$emit("call", "");
    },
  },

  watch: {
    input() {
      this.skeleton = false;
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