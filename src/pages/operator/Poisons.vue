<template>
  <div class="flex flex-col items-start gap-8">
    <div class="p-card w-full">
      <p class="p-6 text-2xl font-bold">سموم کشاورزی</p>
    </div>
    <div class="flex gap-8 w-full">
      <div class="flex flex-col gap-8 w-1/2">
        <TerrainsList @terrains="terrains = $event" />
        <PoisonTypeList @types="types = $event" />
      </div>
      <ProductsList
        class="w-1/2"
        :terrains="terrains"
        @products="products = $event"
      />
    </div>
    <PoisonsList :products="products" :types="types" />
  </div>
</template>

<script>
import PoisonsList from "../../views/operator/poisons/PoisonsList.vue";
import PoisonTypeList from "../../views/operator/poisons/PoisonTypeList.vue";
import ProductsList from "../../views/operator/poisons/ProductsList.vue";
import TerrainsList from "../../views/operator/poisons/TerrainsList.vue";
export default {
  components: { TerrainsList, PoisonsList, ProductsList, PoisonTypeList },
  data() {
    return {
      terrains: [],
      products: [],
      types: [],
    };
  },
};
</script>

<style>
</style>