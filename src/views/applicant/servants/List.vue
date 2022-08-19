<template>
  <div class="servants-list">
    <Card>
      <template #title>
        <div class="flex items-center gap-3">
          <h5 class="p-mb-2 p-m-md-0 p-as-md-center ml-auto" v-if="input">خدمات دهندگان</h5>
          <Skeleton width="12rem" height="2rem" v-else/>
        </div>
      </template>
      <template #content>
        <div >
          <DataTable
            v-if="!noItem"
            ref="dt"
            :value="servants"
            dataKey="id"
            responsiveLayout="stack"
            stripedRows
            :rowHover="input"
            :class="{'cursor': input}"
            @row-click="$router.push('/applicant/servant/'+ $event.data.id)"
          >
            <Column class="w-auto">
              <template #body="{ data }">
                <div class="flex gap-3 items-center">
                  <Avatar
                    :image="data.avatar"
                    size="xlarge"
                    v-if="data.place"
                  />
                  <Skeleton shape="circle" size="3.5rem" v-else/>
                  <div class="flex flex-col gap-2 justify-center">
                    <p v-if="data.fullname">{{ data.fullname }}</p>
                    <Skeleton width="7rem" v-else />
                    <p class="text-xs" v-if="data.place">
                      <i class="pi pi-map-marker mx-1"></i>
                      {{ data.place }}
                    </p>
                    <Skeleton width="10rem" height="0.7rem" v-else/>
                  </div>
                </div>
              </template>
            </Column>
            <Column class="w-auto">
              <template #body="{ data }">
                <Rating
                  :modelValue="data.rating"
                  :readonly="true"
                  :stars="5"
                  :cancel="false"
                  class="float-left"
                  v-if="data.rating"
                />
                <Skeleton width="7rem" class="float-left" v-else/>
              </template>
            </Column>
            <Column class="w-0">
              <template #body="{ data }">
                <i class="pi pi-chevron-left text-gray-400" v-if="data.rating"/>
                <Skeleton width="1.5rem" height="1.5rem"  v-else/>
              </template>
            </Column>
          </DataTable>
          <Message severity="warn" v-else>نتیجه‌ای یافت نشد!</Message>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  props: ["input" , "noItem"],
  data() {
    return {
      servants: [{},{},{}]
    };
  },
  methods: {},
  watch:{
    input(v){
      if (v) this.servants = v;
    }
  }
};
</script>

<style scoped>
.servants-list {
  @apply flex-grow w-full;
}
</style>

<style>
.servants-list .p-datatable-thead {
  @apply hidden;
}

.cursor .p-datatable-tbody > tr {
  @apply cursor-pointer;
}
</style>