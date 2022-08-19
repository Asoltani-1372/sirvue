<template>
  <div class="profile">
    <Account :input="account" @call="this.$emit('changeAvatar', $event)" />
    <section>
      <Message v-if="$route.path.split('/')[1] == 'servant'" severity="warn"
        >تایید عضویت منوط به ثبت پهپاد در سامانه
        <a class="text-blue-700" target="_blank" href="http://uas.cao.ir"
          >uas.cao.ir</a
        >
        و دریافت پلاک است.</Message
      >
      <Details :input="details" @call="fullname = $event" />
      <Place :input="place" />
      <Identities
        :input="identity"
        v-if="$route.path.indexOf('applicant') > -1"
      />
      <Security :input="security" />
      <Notificatins class="hidden" />
    </section>
  </div>
</template>

<script>
import Account from "../views/profile/Account.vue";
import Details from "../views/profile/Details.vue";
import Place from "../views/profile/Place.vue";
import Notificatins from "../views/profile/Notificatins.vue";
import Identities from "../views/profile/Identities.vue";
import Security from "../views/profile/Security.vue";
import ProfileService from "../service/profile.js";
export default {
  components: {
    Account,
    Details,
    Place,
    Notificatins,
    Identities,
    Security,
  },
  data() {
    return {
      profileService: null,
      account: null,
      details: null,
      place: null,
      identity: null,
      security: null,
      fullname: "",
    };
  },

  created() {
    this.profileService = new ProfileService();
  },
  mounted() {
    const id = this.$route.path.indexOf("servant") < 0 ? 1 : 2;
    this.profileService.getProfile(
      id,
      (data) => {
        this.rootUrl = data.rootUrl;
        this.account = data.account;
        this.details = data.details;
        this.place = {
          place: data.place,
          location: data.location,
        };
        this.identity = data.identity;
        this.security = data.security;
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

  watch: {
    fullname(v) {
      this.account.fullname = v;
    },
  },
};
</script>

<style scoped>
.profile {
  @apply flex flex-col lg:flex-row gap-8 pt-12 items-start;
}
.profile > section {
  @apply w-10/12 mx-auto mb-8 lg:w-5/12 lg:mx-0 lg:mb-0 flex flex-col gap-8;
}
</style>

