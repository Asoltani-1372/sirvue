<template>
  <Card class="select-service">
    <template #title>
      <div class="select-service-footer">
        <p v-if="init">خدمات من</p>
        <Skeleton width="10%" v-else />
        <Button
          label="ذخیره"
          class="p-button-success p-button-plain mr-auto"
          @click="saveChange()"
          :disabled="btnDisable"
          :loading="btnLoading"
          v-if="init"
        />
        <Skeleton width="10%" height="3rem" v-else />
      </div>
    </template>
    <template #content>
      <PickList
        v-model="pickListServices"
        listStyle="height:342px"
        dataKey="id"
        class="p-button-success"
        :class="{ visible: !init }"
      >
        <template #sourceheader>
          <p v-if="init">دردسترس</p>
          <Skeleton width="20%" v-else />
        </template>
        <template #targetheader>
          <p v-if="init">انتخاب شده</p>
          <Skeleton width="20%" v-else />
        </template>
        <template #item="slotProps">
          <div class="product-item">
            <div class="image-container" v-if="init">
              <img :src="slotProps.item.image" />
            </div>
            <Skeleton width="5rem" height="3.5rem" class="ml-2" v-else />
            <div class="product-list-detail w-full h-auto">
              <h6 class="p-mb-2" v-if="init">{{ slotProps.item.title }}</h6>
              <Skeleton width="40%" v-else class="mb-2" />

              <!-- <div class="product-category hidden" v-if="init ">
                قیمت پایه: {{ slotProps.item.price }} تومان
              </div>
              <Skeleton width="25%" v-else class="hidden"/> -->
            </div>
          </div>
        </template>
      </PickList>
    </template>
    <template #footer> </template>
  </Card>
</template>

<script>
import ServantServices from "../../service/servant/Servant.js";
export default {
  created() {
    this.servicesService = new ServantServices();
  },
  mounted() {
    this.servicesService.getServices(
      (data) => {
        const remaining = data.remaining;
        this.selected = data.selected;
        this.pickListServices = [remaining, this.selected];
        this.init = true;
      },
      () => {}
    );
  },
  data() {
    return {
      init: false,
      servicesService: null,
      selected: null,
      pickListServices: [
        [{}, {}, {}],
        [{}, {}],
      ],
      btnDisable: true,
      btnLoading: false,
    };
  },
  methods: {
    saveChange() {
      this.btnLoading = true;
      let services = [];
      this.pickListServices[1].forEach((element) => {
        services.push(element.id);
      });
      this.servicesService.applyChange(
        { services },
        () => {
          this.btnLoading = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "باموفقیت ذخیره شد",
            life: 3000,
          });
          this.selected = this.pickListServices[1];
          this.btnDisable = true;
        },
        (error) => {
          this.btnLoading = false;
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
  watch: {
    pickListServices: {
      handler() {
        if (this.pickListServices[1].length != this.selected.length) {
          this.btnDisable = false;
        } else {
          this.btnDisable = true;
          this.pickListServices[1].forEach((element) => {
            console.log(element);
            console.log(this.selected);
            const result = this.selected.find((item) => item.id == element.id);
            if (result.length > 0) {
              this.btnDisable = false;
              return;
            } else {
              this.btnDisable = true;
            }
          });
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
.visible .p-picklist-transfer-buttons {
  visibility: hidden !important;
}

.select-service .p-picklist-source-controls {
  @apply hidden;
}
.select-service .p-picklist-target-controls {
  @apply hidden;
}

.select-service .p-picklist-buttons {
  @apply lg:transform lg:rotate-180;
}

.select-service .p-button {
  background-color: #22c55e;
  border: none !important;
}

.select-service .p-button:hover {
  background-color: #16a34a !important;
}

.select-service .p-picklist-list::-webkit-scrollbar {
  @apply w-2;
}

.select-service .p-picklist-list::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-500;
}

.select-service .product-item {
  @apply flex items-center py-2 px-4;
}

.select-service .image-container {
  @apply flex items-center;
}

.select-service .image-container > img {
  @apply rounded w-20 h-14 ml-4;
}

.select-service .product-list-detail > h6 {
  @apply font-bold;
}

.select-service .select-service-footer {
  @apply flex items-center w-full justify-between;
}

@media screen and (max-width: 960px) {
  .p-picklist-buttons .p-button:last-child {
    margin-right: 8px !important;
  }

  /* @media screen and (max-width: 960px) {
  .p-picklist[pv_id_4] .p-picklist-buttons .p-button:last-child {
    margin-right: 8px !important;
  } */
}
</style>