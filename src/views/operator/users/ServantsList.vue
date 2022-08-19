<template>
  <DataTable
    :value="users"
    :paginator="users.length > 5 && !fetching"
    class="p-datatable-customers"
    :rows="5"
    
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 20]"
    currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} خدمت دهنده"
    responsiveLayout="stack"
  >
    <template #empty>
      <p>موردی جهت نمایش وجود ندارد.</p>
    </template>
    <Column :header="fetching ? '' : 'نام'" class="w-1/3 text-center"
      ><template #header>
        <Skeleton v-if="fetching" />
        <p v-else>نام</p>
      </template>
      <template #body="{ data }">
        <div class="flex gap-3 items-center justify-center" :class="{ 'w-full': fetching }">
          <Avatar
            :image="data.avatar"
            shape="circle"
            size="large"
            v-if="data.avatar"
            class="hidden lg:block"
          />
          <Skeleton shape="circle" size="3rem" v-else class="hidden lg:block" />

          <div v-if="data.firstname || data.phone">
            {{
              data.firstname ? data.firstname + " " + data.lastname : data.phone
            }}
          </div>
          <Skeleton class="min-w-full" v-else />
        </div>
      </template>
    </Column>
    <Column
      :header="fetching ? '' : 'تاریخ ثبت نام'"
      class="w-1/3 skeleton-row whitespace-nowrap"
      ><template #header>
        <Skeleton v-if="fetching" />
        <p v-else>تاریخ ثبت نام</p>
      </template>
      <template #body="{ data }">
        <div v-if="data.registry">{{ data.registry }}</div>
        <Skeleton v-else />
      </template>
    </Column>
    <Column :header="fetching ? '' : 'جزئیات'" class="w-1/3 skeleton-row"
      ><template #header>
        <Skeleton v-if="fetching" />
        <p v-else>جزئیات</p>
      </template>
      <template #body="{ data }">
        <router-link
          :to="'/' + $route.path.split('/')[1] + '/servants/' + data.id"
        >
          <Button
            label="مشاهده"
            icon="pi pi-chevron-left"
            iconPos="right"
            class="p-button-text p-button-success p-button-sm p-0"
            :loading="loading"
            v-if="data.id"
          />
          
            <div class="flex justify-center" v-else>
              <Skeleton  width="6rem" height="2.5rem" /> 
            </div>
          
        </router-link>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import UsersService from "../../../service/operator/users.js";
export default {
  data() {
    return {
      usersService: null,
      users: [{}, {}, {}],
      loading: false,
      fetching: true,
    };
  },

  methods: {
    getServant(id) {
      this.loading = true;
      this.usersService.getServant(
        id,
        (data) => {
          this.user = data.user;
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
  },

  created() {
    this.usersService = new UsersService();
  },

  mounted() {
    this.usersService.getServants(
      (data) => {
        this.users = data.users;
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
};
</script>


<style scoped>
@media screen and (max-width: 1024px) {
  .p-button.p-button-sm {
    font-size: 0.875rem;
    padding: 0 !important;
  }
}
</style>