<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col lg:flex-row items-start gap-8 mt-8 lg:mt-0">
      <Account :input="account" />
      <Profile class="w-3/5" :input="profile" />
    </div>
    <div>
      <History />
    </div>
  </div>
</template>

<script>
import UsersService from "../../service/operator/users";
import Account from "../../views/operator/profiles/Account.vue";
import Profile from "../../views/operator/profiles/Profile.vue";
import History from "../../views/operator/profiles/History.vue";
export default {
  components: { Account, Profile, History },

  data() {
    return {
      usersService: null,
      loading: false,
      profile: null,
      account: null,
      user: null,
    };
  },

  methods: {},

  created() {
    this.usersService = new UsersService();
  },

  mounted() {
    this.loading = true;
    const id = this.$route.params.id;
    this.usersService.getOther(
      id,
      (data) => {
        this.loading = false;
        this.profile = data.profile;
        this.account = data.account;
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