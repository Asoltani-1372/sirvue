<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col lg:flex-row items-start gap-8 mt-8 lg:mt-0">
      <Account :input="account" />
      <Profile class="w-3/5" :input="profile" />
    </div>
    <div>
      <History :requests="requests" :histories="histories" />
    </div>
  </div>
</template>

<script>
import UsersService from "../../service/operator/users.js";
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
      requests: [],
      histories: [],
      prefix: {
        country: "کشور",
        province: "استان",
        township: "شهرستان",
        region: "بخش",
        city: "شهر",
        hamlet: "دهستان",
        village: "روستا",
      },
    };
  },

  methods: {},

  created() {
    this.usersService = new UsersService();
  },

  mounted() {
    this.loading = true;
    const id = this.$route.params.id;
    this.usersService.getApplicant(
      id,
      (data) => {
        this.loading = false;
        this.profile = data.profile;
        this.account = data.account;
        this.requests = data.serviceRequests;
        this.requests.forEach((element) => {
          Object.entries(element.address).forEach((element2) => {
            element.address =
              this.prefix[element2[0]] + " " + element2[1].title;
          });
        });
        this.histories = data.serviceHistories;
        this.histories.forEach((element) => {
          Object.entries(element.address).forEach((element2) => {
            element.address =
              this.prefix[element2[0]] + " " + element2[1].title;
          });
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
};
</script>

<style>
</style>