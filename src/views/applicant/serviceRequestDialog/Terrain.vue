<template>
  <div class="w-full flex flex-col gap-3 p-px">
    <p class="font-bold">نشانی زمین</p>
    <GetLocation @call="parent.address = $event" :place="parent.address" />
    <p class="font-bold mt-4">نوع زمین</p>
    <Dropdown
      v-model="parent.terrain"
      :options="parent.terrains"
      optionLabel="title"
      placeholder="نوع زمین را انتخاب نمایید"
      :loading="!parent.terrains"
    />
    <p class="font-bold mt-4">مساحت زمین</p>
    <div class="col-12 md:col-4" style="direction: ltr">
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon border-r-0 border-l"> هکتار </span>
        <InputText
          v-model="parent.area"
          type="number"
          placeholder="مساحت زمین را وارد نمایید"
          style="direction: rtl"
        />
      </div>
    </div>
    <p class="font-bold mt-4">نوع محصول</p>
    <Dropdown
      v-model="parent.product"
      :options="parent.products"
      optionLabel="title"
      placeholder="نوع محصول را انتخاب نمایید"
      :loading="parent.terrain && !parent.products"
      :disabled="!parent.terrain || !parent.products"
    />
  </div>
</template>

<script>
import GetLocation from "../../../components/basic/GetLocation.vue";

export default {
  components: { GetLocation },
  data() {
    return {
      parent: null,
      terrain: null,
    };
  },
  created() {
    this.parent = this.$parent.$parent.$parent;
  },
};
</script>

<style>
</style>