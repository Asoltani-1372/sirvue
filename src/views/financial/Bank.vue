<template>
  <card class="bank">
    <template #header> </template>
    <template #title>
      <div class="flex justify-between items-center">
        <p v-if="input">اطلاعات بانکی</p>
        <Skeleton width="30%" v-else/>
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-outlined p-button-plain"
          v-if="input"
        />
        <Skeleton width="3rem" height="3rem" shape="circle" v-else />
      </div>
    </template>
    <template #content>
      <div class="flex w-full flex-col gap-3 px-4">
        <div class="flex items-center gap-8 text-left">
          <p class="w-1/5" v-if="input">نام صاحب حساب</p>
          <Skeleton width="20%"/>
          <InputText
            type="text"
            v-model="fullname"
            placeholder="نام صاحب حساب"
            class="flex-grow p-inputtext-sm"
            v-if="input"
          />
          <Skeleton width="72%" height="2.68rem"/>
        </div>
        <div class="flex items-center gap-8 text-left">
          <p class="w-1/5" v-if="input">نام بانک</p>
          <Skeleton width="20%" v-else/>
          <CascadeSelect
            v-model="bank"
            :options="banks"
            class="flex-grow text-right"
            optionLabel="name"
            :optionGroupChildren="[]"
            placeholder="نام بانک"
            v-if="input"
          />
          <Skeleton width="72%" height="2.68rem"/>
        </div>
        <div class="flex items-center gap-8 text-left">
          <p class="w-1/5" v-if="input">شماره شبا</p>
          <Skeleton width="20%"/>
          <div class="p-col-12 p-md-4 flex-grow" dir="ltr">
            <div class="p-inputgroup" v-if="input">
              <span class="p-inputgroup-addon">IR</span>
              <InputNumber
                v-model="sheba"
                class="flex-grow text-right"
                optionLabel="name"
                :optionGroupChildren="[]"
              />
            </div>
            <Skeleton width="100%" height="2.68rem" v-else />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <Button
          label="انصراف"
          class="p-button-text p-button-success p-button-sm"
          v-if="input"
        />
        <Skeleton width="4.3rem" height="2.68rem" v-else/>
        <Button
          label="ذخیره"
          class="p-button-success p-button-plain p-button-sm"
          v-if="input"
        />
        <Skeleton width="4.3rem" height="2.68rem" v-else/>
      </div>
    </template>
  </card>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      fullname: "",
      banks: [
        {
          name: "ملی",
          code: "male",
        },
        {
          name: "کشاورزی",
          code: "female",
        },
        {
          name: "ملت",
          code: "female",
        },
        {
          name: "پاشارگاد",
          code: "female",
        },
      ],
      bank: null,
      sheba: null,
    };
  },
  created() {},
};
</script>

<style scoped>
.bank {
  @apply w-11/12 m-auto lg:w-full;
}
</style>
<style>
.bank .p-cascadeselect-label {
  @apply p-2.5 !important;
}
</style>
