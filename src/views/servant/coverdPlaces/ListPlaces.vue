<template>
  <div class="list-places">
    <Card>
      <template #title>
        <div class="flex items-center gap-3 justify-between">
          <h5 class="p-mb-2 p-m-md-0 p-as-md-center ml-auto" v-if="input">
            مناطق تحت پوشش شما
          </h5>
          <Skeleton width="30%" v-else />
          <Button
            label="حذف"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="deletePlacesDialog = true"
            :disabled="!selectedPlaces || !selectedPlaces.length"
            v-if="input"
          />
          <Skeleton width="5rem" height="2.68rem" v-else />
        </div>
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="places"
          v-model:selection="selectedPlaces"
          dataKey="id"
          :paginator="input"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="نمایش {first} تا {last} از {totalRecords} منطقه"
          responsiveLayout="stack"
          class="place-table"
        >
          <Column
            :selectionMode="input ? 'multiple' : null"
            class="w-12 check-column"
          >
            <template #header v-if="!input">
              <Skeleton width="1rem" />
            </template>
            <template #body v-if="!input">
              <Skeleton width="1rem" />
            </template>
          </Column>
          <Column field="country" header="کشور" class="w-36">
            <template #body="{ data }">
              <p v-if="data.country">
                {{ data.country.title }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>
          <Column field="province" header="استان" class="w-36">
            <template #body="{ data }">
              <p v-if="data.province">
                {{ data.province.title }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>
          <Column field="township" header="شهرستان" class="w-36">
            <template #body="{ data }">
              <p v-if="data.township">
                {{ data.township.title }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>
          <Column field="region" header="بخش" class="w-36">
            <template #body="{ data }">
              <p v-if="data.region">
                {{ data.region.title }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>
          <Column field="ch" header="شهر/دهستان">
            <template #body="{ data }">
              <p v-if="data.ch">
                {{ data.ch.title }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>

          <Column field="village" header="روستا">
            <template #body="{ data }">
              <p v-if="data.ch">
                {{ "village" in data ? data.village.title : "-" }}
              </p>
              <Skeleton v-else />
            </template>
          </Column>

          <Column class="w-20" header="عملیات">
            <template #body="slotProps">
              <div class="flex gap-4 items-center justify-center" v-if="slotProps.data.id">
                <InputSwitch
                  v-model="slotProps.data.active"
                  @input="$emit('activate', slotProps.index)"
                />

                <Button
                  icon="pi pi-trash"
                  class="
                    p-button-rounded p-button-danger p-button-xs p-button-sm
                  "
                  @click="confirmDeletePlace(slotProps.data)"
                />
              </div>
              <Skeleton v-else />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="deletePlaceDialog"
      class="max-w-lg w-full"
      header="حذف منطقه"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>
          آیا مطمئنید که میخواهید <b>{{ place.chv }}</b> را حذف نمایید ?
        </span>
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-sm"
            @click="deletePlaceDialog = false"
          />

          <Button
            label="حذف شود"
            icon="pi pi-times"
            class="p-button-danger p-button-sm"
            @click="deletePlaces([place])"
          />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deletePlacesDialog"
      class="max-w-lg w-full"
      header="حذف منطقه"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>آیا مطمئن هستید که می خواهید مناطق انتخاب شده را حذف نمایید؟</span>
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <Button
            label="بازگشت"
            icon="pi pi-times"
            class="p-button-text p-button-sm"
            @click="deletePlacesDialog = false"
          />
          <Button
            label="حذف شود"
            icon="pi pi-check"
            class="p-button-danger p-button-sm"
            @click="deletePlaces(selectedPlaces)"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
export default {
  props: ["input"],
  data() {
    return {
      selectedPlaces: null,
      deletePlaceDialog: false,
      deletePlacesDialog: false,
      place: null,
      places: [{}, {}, {}],
    };
  },

  methods: {
    confirmDeletePlace(place) {
      this.place = place;
      this.deletePlaceDialog = true;
    },
    deletePlaces(places) {
      this.deletePlaceDialog = false;
      this.deletePlacesDialog = false;
      let temp = [];
      places.forEach((element) => {
        temp.push(element.id);
      });
      this.$emit("delete", temp);
      this.selectedPlaces = null;
    },
  },
  watch: {
    input(v) {
      if (v) this.places = v;
    },
  },
};
</script>

<style scoped>
.place-table .check-column .p-skeleton {
  @apply w-4 !important;
}

.place-table .p-skeleton {
  @apply w-1/2 lg:w-full !important;
}

.vis {
  visibility: hidden !important;
}

.p-button-xs {
  @apply w-10 h-10 text-sm !important;
}
</style>

<style>
.list-places {
  @apply flex-grow;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>