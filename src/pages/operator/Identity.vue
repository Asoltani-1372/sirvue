<template>
  <div class="flex flex-col gap-8">
    <UserIdentity :input="identity" />
    <div class="flex flex-col lg:flex-row-reverse gap-8">
      <Card class="custom-steps lg:w-1/3">
        <template #title>
          <Skeleton
            v-if="fetching"
            width="8rem"
            height="2rem"
            class="mx-auto"
          />
          <p v-else class="text-center">مدارک</p>
        </template>
        <template #content>
          <div class="steps-skeleton" v-if="fetching">
            <div v-for="i in items.length" :key="i">
              <Skeleton shape="circle" size="2.2rem" />
              <Skeleton width="12rem" heigth="1.5rem" />
            </div>
          </div>
          <Steps :model="items" :readonly="false" v-else class="my-8" />
        </template>
      </Card>

      <router-view
        v-slot="{ Component }"
        @prevPage="prevPage($event)"
        @nextPage="nextPage($event)"
        @complete="complete($event)"
        :input="identity"
      >
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
import IdentitiesService from "../../service/operator/identities";
import UserIdentity from "../../views/operator/identity/UserIdentity.vue";
export default {
  components: { UserIdentity },
  data() {
    return {
      id: null,
      role: null,
      fetching: true,
      identitiesService: null,
      items: [
        {
          label: "کارت ملی",
          to: "national-card",
        },
        {
          label: "پلاک پهپاد",
          to: "plaque",
        },
        // {
        //   label: "گواهی خلبانی",
        //   to: "certificate",
        // },
         {
          label: "معرفی نامه",
          to: "repersenter",
        },
        // {
        //   label: "مدرک تحصیلی",
        //   to: "degree-education",
        // },
        // {
        //   label: "عدم سوء پیشینه",
        //   to: "no-criminal-record",
        // },
      ],
      identity: null,
      verifications: {},
    };
  },

  created() {
    this.identitiesService = new IdentitiesService();
    const route = this.$route.path.replace(this.items[0].to, "");
    this.items.forEach((element) => {
      element.to = route + element.to;
    });
  },
  mounted() {
    this.id = this.$route.params.id;
    this.identitiesService.getIdentity(
      this.id,
      (data) => {
        this.role = data.identity.identity.profile.role;
        this.identity = data.identity;
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
    nextPage(event) {
      for (let field in event.formData) {
        this.verifications[field] = event.formData[field];
      }
      this.$router.push(this.items[event.pageIndex + 1].to);
    },
    prevPage(event) {
      this.$router.push(this.items[event.pageIndex - 1].to);
    },
    complete(event) {
      for (let field in event.formData) {
        this.verifications[field] = event.formData[field];
      }
      const data = {
        id: this.id,
        verifications: this.verifications,
      };
      this.identitiesService.verification(
        data,
        () => {
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "با موفقیت ثبت شد.",
            life: 3000,
          });
          setTimeout(() => {
            this.$router.push("/allocator/identities");
          }, 300);
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

<style scoped>
.steps-skeleton {
  @apply flex flex-col items-center justify-center gap-14 my-8;
}
.steps-skeleton > div {
  @apply flex flex-col gap-3 items-center;
}
</style>

<style >
.custom-steps .p-steps ul {
  @apply flex lg:flex-col gap-12;
}
</style>