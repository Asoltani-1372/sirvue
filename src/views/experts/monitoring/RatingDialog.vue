<template>
  <Dialog
    :visible="displayModal"
    class="max-w-xl lg:w-full w-11/12"
    header="امتیاز دهی خدمت"
    :modal="true"
    :closable="false"
  >
    <div class="confirmation-content flex-col gap-8 items-center w-full">
      <Avatar :image="data.servant.avatar" class="w-28 h-28" shape="circle" />
      <p class="text-2xl font-bold">
        {{ data.servant.firstname + " " + data.servant.lastname }}
      </p>
      <Rating v-model="stars" :cancel="false" dir="ltr" class="mt-4" />
      <p class="text-xs text-red-600">{{ errors.stars }}</p>

      <TabMenu
        :model="items"
        @tab-change="tabChange($event)"
        v-if="stars"
        class="w-full"
      />

      <div
        class="grid grid-cols-2 justify-items-stretch gap-y-3 gap-x-8 w-full"
        v-if="index == 1"
      >
        <ToggleButton
          v-for="(weak, i) in weaks"
          :key="weak.id"
          v-model="weaksValue[i]"
          :onLabel="weak.title"
          :offLabel="weak.title"
          class="p-button-outlined"
          :class="[weaksValue[i] ? 'p-button-danger' : 'p-button-secondary']"
        />
      </div>
      <div
        class="grid grid-cols-2 justify-items-stretch gap-y-3 gap-x-8 w-full"
        v-if="index == 0"
      >
        <ToggleButton
          v-for="(strength, i) in strengths"
          :key="strength.id"
          v-model="strengthsValue[i]"
          :onLabel="strength.title"
          :offLabel="strength.title"
          class="p-button-outlined"
          :class="[
            strengthsValue[i] ? 'p-button-success' : ' p-button-secondary',
          ]"
        />
      </div>

      <Textarea
        :autoResize="true"
        v-model="comment"
        placeholder="نظرتان را در مورد خدمت ارائه شده بنویسید"
        rows="5"
        class="w-full"
        v-if="stars"
      />
    </div>
    <template #footer>
      <div class="flex justify-between w-full">
        <Button
          label="بازگشت"
          class="p-button-text p-button-info p-button-sm"
          @click="close()"
        />
        <Button
          label="ثبت"
          class="p-button-success p-button-sm"
          @click="setRate()"
          :disabled="!stars"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import ServiceRequestService from "../../../service/applicant/serviceRequestService";
export default {
  data() {
    return {
      displayModal: false,
      serviceRequestService: null,
      data: null,
      stars: null,
      rates: null,
      weaks: [],
      weaksValue: [],
      selectedWeaks: [],
      strengths: [],
      strengthsValue: [],
      selectedStrengths: [],
      comment: null,
      index: null,
      items: [{ label: "نقاط قوت" }, { label: "نقاط ضعف" }],
      flag: true,
      errors: {},
      loading: false,
    };
  },

  created() {
    this.serviceRequestService = new ServiceRequestService();
  },

  methods: {
    open(data, rates) {
      this.displayModal = true;
      this.index = null;
      this.flag = true;
      this.data = data;
      this.rates = rates;
      this.detectRateType(rates);
    },

    detectRateType(rates) {
      for (let i = 0; i < rates.length; i++) {
        if (rates[i].type == "weak") {
          this.weaks.push(rates[i]);
        } else {
          this.strengths.push(rates[i]);
        }
      }
    },

    tabChange(event) {
      this.index = event.index;
    },

    close() {
      this.displayModal = false;
      this.data = null;
      this.stars = null;
      this.rates = null;
      this.weaks = [];
      this.weaksValue = [];
      this.selectedWeaks = [];
      this.strengths = [];
      this.strengthsValue = [];
      this.selectedStrengths = [];
      this.comment = null;
      this.index = null;
      this.flag = true;
      this.closeFlag = true;
      this.loading = false;
    },

    setRate() {
      const data = {
        id: this.data.id,
        stars: this.stars,
        weaks: this.selectedWeaks,
        strengths: this.selectedStrengths,
        comment: this.comment,
      };
      if (!this.stars) {
        this.errors.stars = "امتیاز دهی را وارد نمایید.";
      } else {
        this.loading = true;
        this.serviceRequestService.setRate(
          data,
          () => {
            this.$emit("call", "");
            this.$toast.add({
              severity: "success",
              summery: "موفق",
              detail: "امتیاز شما با موفقیت ثبت شد.",
              life: "3000",
            });
            const i = this.$parent.requestsList.findIndex(
              (e) => e.id == data.id
            );
            this.$parent.requestsList.splice(i, 1);
            this.close();
            setTimeout(() => {
              this.$router.push("/applicant/histories");
            }, 500);
          },
          (error) => {
            this.$toast.add({
              severity: "error",
              summery: "خطا",
              detail: error,
              life: "3000",
            });
          }
        );
      }
    },
  },

  watch: {
    weaksValue: {
      handler(v) {
        this.selectedWeaks = [];
        v.forEach((element, index) => {
          if (element) {
            this.selectedWeaks.push(this.weaks[index].id);
          }
        });
      },
      deep: true,
    },

    strengthsValue: {
      handler(v) {
        this.selectedStrengths = [];
        v.forEach((element, index) => {
          if (element) {
            this.selectedStrengths.push(this.strengths[index].id);
          }
        });
      },
      deep: true,
    },

    stars(v) {
      if (v) {
        this.errors.stars = "";
      }
      if (v < 3) {
        this.index = 1;
      } else if (v >= 3) {
        this.index = 0;
      }
    },
  },
};
</script>

<style>
.p-rating .p-rating-icon {
  @apply text-2xl !important;
}

.p-rating .p-rating-icon:first-child {
  margin-right: 8px;
}

.p-rating:first-child {
  @apply mx-3 !important;
}

.p-datepicker {
  @apply border-0;
}
.p-timepicker {
  direction: ltr;
}

.confirmation-content .p-tabmenu-nav {
  @apply justify-around;
}
</style>