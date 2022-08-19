<template>
  <DataTable
    :value="users"
    :paginator="users.length > 5 && !fetching"
    class="p-datatable-customers"
    :rows="5"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 20]"
    currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} کاربر"
    responsiveLayout="stack"
  >
    <template #empty>
      <p>موردی جهت نمایش وجود ندارد.</p>
    </template>
    <Column header="نام" class="w-1/4 text-center"
      ><template #header>
        <Skeleton v-if="fetching" />
        <p v-else>نام</p>
      </template>
      <template #body="{ data }">
        <div class="flex gap-3 items-center justify-center">
          <Avatar
            :image="data.avatar"
            shape="circle"
            size="large"
            v-if="data.avatar"
          />
          <Skeleton shape="circle" size="3rem" v-else />
          <div v-if="data.firstname || data.phone">
            {{
              data.firstname ? data.firstname + " " + data.lastname : data.phone
            }}
          </div>
          <Skeleton v-else width="10rem" />
        </div>
      </template>
    </Column>

    <Column header="نقش" class="w-1/4 text-center"
      ><template #header>
        <Skeleton v-if="fetching" />
        <p v-else>نقش</p>
      </template>
      <template #body="{ data }">
        <div v-if="data.role">
          {{ data.role.join(", ") }}
        </div>
        <Skeleton v-else />
      </template>
    </Column>

    <Column header="تاریخ ثبت نام" class="w-1/4 skeleton-row">
      <template #header>
        <Skeleton v-if="fetching" />
        <p v-else>تاریخ ثبت نام</p>
      </template>
      <template #body="{ data }">
        <div v-if="data.registry">{{ data.registry }}</div>
        <Skeleton v-else />
      </template>
    </Column>
    <Column header="جزئیات" class="w-1/4 skeleton-row"
      ><template #header>
        <Skeleton v-if="fetching" />
        <p v-else>جزئیات</p>
      </template>
      <template #body="{ data }">
        <router-link :to="'/operator/others/' + data.id">
          <Button
            label="مشاهده"
            icon="pi pi-chevron-left"
            iconPos="right"
            class="p-button-text p-button-success p-button-sm"
            :loading="loading"
            v-if="data.id"
          />
          <Skeleton v-else />
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
      loading: false,
      fetching: true,
      users: [{}, {}, {}, {}, {}],
    };
  },

  methods: {
    getOther(id) {
      this.loading = true;
      this.usersService.getOther(
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
    this.usersService.getOthers(
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

<style>
</style>