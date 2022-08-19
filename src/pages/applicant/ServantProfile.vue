<template>
  <div class="servant-profile">
    <div class="w-10/12 mx-auto mt-8 lg:w-1/3 lg:mt-0 flex flex-col gap-8">
      <Details :input="profile" />
      <Reviews :input="reviews" />
    </div>
    <Timings :input="timings"/>
  </div>
</template>

<script>
import Details from "../../views/applicant/servantProfile/Details.vue";
import Reviews from "../../views/applicant/servantProfile/Reviews.vue";
import Timings from "../../views/applicant/servantProfile/Timings.vue";
import ServantProfileService from "../../service/applicant/ServantProfile.js";
export default {
  components: { Details, Reviews, Timings },
  data() {
    return {
      servantProfileService: null,
      profile: null,
      timings: null,
      reviews: null,
    };
  },
  created() {
    this.servantProfileService = new ServantProfileService();
  },
  mounted() {
    const id = this.$route.params.id;
    this.servantProfileService.getServant(
      id,
      (data) => {
        this.profile = data.profile;
        this.timings = data.timings;
        this.reviews = data.reviews;
      },
      () => {}
    );
  },
};
</script>

<style scoped>
.servant-profile {
  @apply flex flex-col lg:flex-row gap-8 m-auto h-full items-start;
}
</style>