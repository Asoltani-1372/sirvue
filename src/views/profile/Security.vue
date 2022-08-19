<template>
  <card class="details">
    <template #title>
      <div class="flex justify-between items-center">
        <p v-if="input">ورود و امنیت</p>
        <Skeleton v-else width="30%" height="1.2rem" />
        <Button
          v-if="!editMode && input"
          icon="pi pi-pencil"
          class="p-button-rounded p-button-outlined p-button-plain w-4 h-4 hidden"
          @click="editMode = true"
        />
        <Skeleton v-else-if="!editMode" shape="circle" size="3.2rem" />
        <!-- <p v-if="input" class="text-green-600 text-base">بزودی</p> -->
      </div>
    </template>
    <template #content>
      <div class="flex w-full flex-col gap-3 px-4">
        <div
          class="flex items-center gap-8 text-left text-sm lg:text-base"
          v-for="(item, index) in items"
          :key="index"
        >
          <p v-if="input" class="w-1/3 lg:w-1/5">{{ item.title }}</p>
          <Skeleton v-else width="15%" class="mr-10" />
          <div v-if="editMode" class="flex flex-grow">
            <InputMask
              mask="9999 999 9999"
              :placeholder="item.title"
              v-model="value"
              class="w-full"
              dir="ltr"
              :autoClear="false"
              :class="{ 'p-invalid': invalid }"
              v-if="item.type == 'phone'"
              slotChar="-"
              autofocus
              @keyup.enter="handleClick()"
            />
            <Button
              v-if="item.type == 'password'"
              label="تغییر رمز عبور"
              class="p-button-text"
              @click="$refs.changePassword.open()"
            />
          </div>
          <div v-else-if="input" class="font-bold">
            <div v-if="item.type == 'password'" class="flex gap-1">
              <i
                class="pi pi-circle-on"
                style="font-size: 0.5rem"
                v-for="i in 8"
                :key="i"
              ></i>
            </div>
            <p v-else>{{ item.value }}</p>
          </div>
          <Skeleton v-else width="30%" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end" v-if="editMode">
        <Button
          label="انصراف"
          class="p-button-text p-button-success"
          @click="editMode = false"
        />
        <Button
          label="ذخیره"
          class="p-button-success p-button-plain"
          @click="$refs.confirmPassword.open()"
        />
      </div>
      <ChangePasswordDialog ref="changePassword" />
      <ConfirmPasswordDialog ref="confirmPassword" />
    </template>
  </card>
</template>

<script>
import ChangePasswordDialog from "./ChangePasswordDialog.vue";
import ConfirmPasswordDialog from "./ConfirmPasswordDialog.vue";
export default {
  components: { ChangePasswordDialog, ConfirmPasswordDialog },
  props: ["input"],
  data() {
    return {
      editMode: false,
      items: {
        phone: { title: "تلفن همراه", type: "text" },
        password: { title: "رمزعبور", type: "password" },
      },
    };
  },
  methods: {
    save() {
      
    },
  },
  watch:{
    input:{
      handler(v){
        if (v) {
          this.items.phone.value = v.phone;
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.details {
  @apply w-full;
}
</style>
<style>
.details .p-cascadeselect-label {
  @apply p-2.5 !important;
}
</style>
