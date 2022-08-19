<template>
  <div class="flex gap-8">
    <Card class="w-full">
      <template #title>
        <div class="flex justify-between">
          <div>کاربران</div>
          <div>
            <Button
              label="افزودن کاربر"
              icon="pi pi-plus"
              class="p-button-raised p-button-success p-button-sm hidden lg:block"
              @click="$refs.addUserDialog.open()"
              v-if="$route.path.split('/')[1] == 'allocator' || $route.path.split('/')[1] == 'company'"
            />
            <Button
              label="افزودن "
              icon="pi pi-plus"
              class="p-button-text p-button-success p-button-sm lg:hidden"
              @click="$refs.addUserDialog.open()"
              v-if="$route.path.split('/')[1] == 'allocator' || $route.path.split('/')[1] == 'company'"
              
            />
          </div>
        </div>
      </template>
      <template #content>
        <TabMenu :model="items" />
        <router-view />
        <AddUserDialog ref="addUserDialog" />
      </template>
    </Card>
  </div>
</template>

<script>
import AddUserDialog from "../../views/operator/users/AddUserDialog.vue";
export default {
  components: { AddUserDialog },
  data() {
    return {
      items: [
        { label: "متقاضیان", to: "applicants" },
        { label: "خدمت دهندگان", to: "servants" },
        { label: "سایر کاربران", to: "others" },
      ],
    };
  },
  created() {
    const route = this.$route.path.split("/")[1];
    if (route == "company") {
      this.items.splice(2, 1);
    }
  },
};
</script>

<style>
@media screen and (max-width: 960px) {
  .p-card-title .p-button-icon ~ .p-button-label {
    display: block !important;

  }
}
</style>