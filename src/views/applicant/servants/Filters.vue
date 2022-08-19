<template>
  <Card>
    <template #title>
      <div v-if="input">صافی</div>
      <Skeleton width="30%" v-else />
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <MultiSelect
          v-model="selectedServices"
          :options="input"
          optionLabel="title"
          placeholder="نوع خدمت"
          v-if="input"
        />
        <Skeleton width="100%" height="3rem" v-else />
        <GetLocation
          @call="place = $event"
          :place="placeDefault"
          v-if="input"
        />
        <Skeleton width="100%" height="3rem" v-else  />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <SelectButton
          v-model="sirangServant"
          :options="servantType"
          dir="ltr"
          class="p-button-sm"
          v-if="input"
        />
        <Skeleton width="8.62rem" height="3.125rem" v-else/>

        <Button
          label="جستجو"
          class="p-button-success p-button-sm"
          @click="filterServant()"
          :loading="loading"
          v-if="input"
        />
        <Skeleton width="5rem"  height="3.125rem" v-else/>
      </div>
    </template>
  </Card>
</template>

<script>
import GetLocation from "../../../components/basic/GetLocation.vue";
export default {
  components: { GetLocation },
  props: ["input", "loading", "placeDefault"],
  data() {
    return {
      sirangServant: "همه",
      servantType: ["سیرنگ", "همه"],
      place: [],
      selectedServices: [],
    };
  },
  methods: {
    filterServant() {
      this.$emit("call", {
        place: this.orderingPlaces(this.place),
        services: this.orderingService(this.selectedServices),
        sirangServant: this.sirangServant == "سیرنگ",
      });
    },

    orderingService(item) {
      let temp = [];
      for (let i = 0; i < item.length; i++) {
        const element = item[i];
        temp.push(element.id);
      }
      return temp;
    },
    orderingPlaces(place) {
      let temp = {};
      for (let i = 0; i < place.length; i++) {
        const element = place[i];
        temp[element.type] = element.id;
      }
      return temp;
    },
  },
};
</script>

<style>
</style>