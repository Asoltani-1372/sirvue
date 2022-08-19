<template>
  <Dialog
    :visible="displayModal"
    class="max-w-xl w-11/12 lg:w-full"
    :modal="true"
    :closable="false"
  >
    <div class="flex flex-col gap-4 text-sm" v-if="serviceHistory">
      <div class="flex justify-around items-center">
        <div class="flex flex-col gap-3 items-center justify-around">
          <Avatar
            :image="serviceHistory.applicant.avatar"
            shape="circle"
            size="xlarge"
            class="hidden md:flex"
          />
          <p>
            {{ serviceHistory.applicant.firstname }}
            {{ serviceHistory.applicant.lastname }}
          </p>
          <p class="text-xs text-gray-400">متقاضی</p>
        </div>
        <div
          class="flex flex-col gap-3 items-center"
          v-if="serviceHistory.status != 'allocating'"
        >
          <Avatar
            :image="serviceHistory.servant.avatar"
            shape="circle"
            size="xlarge"
            class="hidden md:flex"
          />
          <p>
            {{ serviceHistory.servant.firstname }}
            {{ serviceHistory.servant.lastname }}
          </p>
          <p class="text-xs text-gray-400">خدمت دهنده</p>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div>خدمت</div>
        <div>{{ serviceHistory.service }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>نشانی</div>
        <div>{{ serviceHistory.address }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>تاریخ</div>
        <div>{{ serviceHistory.date }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>مبلغ</div>
        <div>{{ serviceHistory.price }} تومان</div>
      </div>
      <div class="flex justify-between items-center">
        <div>ایاب و ذهاب</div>
        <div>{{ serviceHistory.transport }} تومان</div>
      </div>
      <div class="flex justify-between items-center">
        <div>مساحت زمین</div>
        <div>{{ serviceHistory.area }} هکتار</div>
      </div>
      <div class="flex justify-between items-center">
        <div>نوع زمین</div>
        <div>{{ serviceHistory.terrain }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>نوع محصول</div>
        <div>{{ serviceHistory.product }}</div>
      </div>
      <div class="flex justify-between" v-if="serviceHistory.poison">
        <p>نوع سم</p>
        <p>{{ serviceHistory.poison.type }}</p>
      </div>
      <div class="flex justify-between" v-if="serviceHistory.poison">
        <p>نام سم</p>
        <p>{{ serviceHistory.poison.title }}</p>
      </div>
      <div class="flex justify-between" v-if="serviceHistory.rate">
        <p>نقاط قوت</p>
        <p>{{ serviceHistory.rate.strengths.join(", ") }}</p>
      </div>
      <div class="flex justify-between" v-if="serviceHistory.rate">
        <p>نقاط صعف</p>
        <p>{{ serviceHistory.rate.weaks.join(", ") }}</p>
      </div>
      <div class="flex justify-between" v-if="serviceHistory.rate">
        <p>نظر متقاضی</p>
        <p>{{ serviceHistory.rate.comment }}</p>
      </div>
      <Button
        label="نمایش موقعیت مکانی روی نقشه"
        class="p-button-outlined p-button-sm mt-4"
        @click="showLocation()"
      />
      <Map ref="myMap" :input="serviceHistory.location" />
    </div>
    <template #footer>
      <div class="flex justify-between">
        <Button
          class="p-button-text p-button-sm"
          label="بازگشت"
          @click="displayModal = false"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import MonitoringService from "../../../service/monitoring";
import Map from "../../../components/basic/Map.vue";
export default {
  components: { Map },
  data() {
    return {
      fetching: null,
      monitoringService: null,
      serviceHistory: null,
      displayModal: false,
      titles: {
        id: "شناسه",
        applicant: "متقاضی",
        servant: "خدمت دهنده",
        address: "نشانی",
        location: "موقعیت مکانی",
        service: "خدمت",
        product: "محصول",
        poison_type: "نوع سم",
        poison: "سم",
        price: "مبلغ",
        status: "وضعیت",
        desc: "توضیحات",
        share: "سهم خدمت دهنده",
        terrain: "ویژگی زمین",
      },
      items: [],
      reasons: null,
      index: null,
    };
  },

  created() {
    this.monitoringService = new MonitoringService();
  },

  methods: {
    open(id, index) {
      this.serviceRequestDetails(id, index);
      this.$parent.serviceHistories[index].loading = true;
    },

    serviceRequestDetails(id, index) {
      this.monitoringService.pastServiceDetails(
        id,
        (data) => {
          this.serviceHistory = data.serviceHistory;
          let temp = "";
          delete this.serviceHistory.address.country;
          Object.entries(this.serviceHistory.address).forEach((element) => {
            if (element) {
              if (temp) temp += " , ";
              temp += element[1].title;
            }
          });
          this.serviceHistory.address = temp;
          this.$parent.serviceHistories[index].loading = false;
          this.displayModal = true;
        },
        (error) => {
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },

    showLocation() {
      this.$refs.myMap.markerLatLng = this.serviceHistory.location;
      this.$refs.myMap.displayDialog = true;
    },
  },
};
</script>
<style>
</style>