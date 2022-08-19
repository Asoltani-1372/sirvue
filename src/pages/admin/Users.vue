<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="w-11/12 lg:w-1/3 mt-8 lg:mt-0 mx-auto">
      <Details :input="roles" />
    </div>
    <List
      class="w-full lg:w-2/3"
      :input="users"
      :roles="roles"
      @call="updateList()"
    />
  </div>
</template>

<script>
import List from "../../views/admin/users/List.vue";
import Details from "../../views/admin/users/Details.vue";
import UsersService from "../../service/admin/users";
export default {
  components: { List, Details },
  data() {
    return {
      UsersService: null,
      users: [{}, {}, {}],
      roles: null,
    };
  },

  created() {
    this.usersService = new UsersService();
  },

  mounted() {
    this.usersService.getUsers(
      (data) => {
        this.users = data.users;
        this.roles = data.roles;
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

  // provide() {
  //   return {
  //     roles: this.roles,
  //   };
  // },
  methods: {
    updateList() {
      this.usersService.getUsers(
        (data) => {
          this.users = data.users;
          this.roles = data.roles;
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