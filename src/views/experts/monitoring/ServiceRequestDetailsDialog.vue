<template>
  <Dialog
    :visible="displayModal"
    class="max-w-xl w-11/12 lg:w-full"
    :modal="true"
    :closable="false"
  >
    <div class="flex flex-col gap-4 text-sm" v-if="serviceRequest">
      <div class="flex justify-around items-center">
        <div class="flex flex-col gap-3 items-center justify-around">
          <Avatar
            :image="serviceRequest.applicant.avatar"
            shape="circle"
            size="xlarge"
            class="hidden md:flex"
          />
          <p>
            {{ serviceRequest.applicant.firstname }}
            {{ serviceRequest.applicant.lastname }}
          </p>
          <p class="text-xs text-gray-400">متقاضی</p>
        </div>
        <div
          class="flex flex-col gap-3 items-center"
          v-if="serviceRequest.status != 'allocating'"
        >
          <Avatar
            :image="serviceRequest.servant.avatar"
            shape="circle"
            size="xlarge"
            class="hidden md:flex"
          />
          <p>
            {{ serviceRequest.servant.firstname }}
            {{ serviceRequest.servant.lastname }}
          </p>
          <p class="text-xs text-gray-400">خدمت دهنده</p>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div>خدمت</div>
        <div>{{ serviceRequest.service }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>نشانی</div>
        <div>{{ serviceRequest.address }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>تاریخ</div>
        <div>{{ serviceRequest.date }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>مبلغ</div>
        <div>{{ serviceRequest.price }} تومان</div>
      </div>
      <div class="flex justify-between items-center">
        <div>مساحت زمین</div>
        <div>{{ serviceRequest.area }} هکتار</div>
      </div>
      <div class="flex justify-between items-center">
        <div>نوع زمین</div>
        <div>{{ serviceRequest.terrain }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div>نوع محصول</div>
        <div>{{ serviceRequest.product }}</div>
      </div>
      <div class="flex justify-between" v-if="serviceRequest.poison">
        <p>نوع سم</p>
        <p>{{ serviceRequest.poison.type }}</p>
      </div>
      <div class="flex justify-between" v-if="serviceRequest.poison">
        <p>نام سم</p>
        <p>{{ serviceRequest.poison.title }}</p>
      </div>
      <Button
        label="نمایش موقعیت مکانی روی نقشه"
        class="p-button-outlined p-button-sm mt-4"
        @click="showLocation()"
      />
      <Map ref="myMap" :input="serviceRequest.location" />
    </div>
    <template #footer>
      <div class="flex justify-between">
        <Button
          class="p-button-text p-button-sm"
          label="بازگشت"
          @click="displayModal = false"
        />
        <div>
          <Button
            class="p-button-raised p-button-danger p-button-sm"
            label="لغو"
            @click="$refs.cancelDialog.open(serviceRequest.id, input)"
            v-if="serviceRequest.status == 'allocating'"
          />

          <Button
            class="p-button-raised p-button-info p-button-sm"
            label="امتیاز دهی"
            @click="$refs.ratingDialog.open(serviceRequest, rates)"
            v-if="serviceRequest.status == 'rating'"
          />
        </div>
      </div>
      <CancelDialog ref="cancelDialog" @call="closeModal()" />
      <RatingDialog ref="ratingDialog" @call="closeModal()" />
    </template>
  </Dialog>
</template>

<script>
import CancelDialog from "./CancelDialog.vue";
import RatingDialog from "./RatingDialog.vue";
import MonitoringService from "../../../service/monitoring";
import Map from "../../../components/basic/Map.vue";
export default {
  components: { Map, CancelDialog, RatingDialog },
  props: ["input", "rates"],
  data() {
    return {
      fetching: null,
      monitoringService: null,
      serviceRequest: null,
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
    open(id, index, reasons) {
      this.serviceRequestDetails(id, index);
      this.index = index;
      this.reasons = reasons;
      this.$parent.serviceRequests[index].loading = true;
    },

    closeModal() {
      this.$emit("call", "");
      this.displayModal = false;
    },

    serviceRequestDetails(id , index) {
      this.monitoringService.serviceRequestDetails(
        id,
        (data) => {
          this.serviceRequest = data.serviceRequest;
          let temp = "";
          delete this.serviceRequest.address.country;
          Object.entries(this.serviceRequest.address).forEach((element) => {
            if (element) {
              if (temp) temp += " , ";
              temp += element[1].title;
            }
          });
          this.serviceRequest.address = temp;
          this.displayModal = true;
          this.$parent.serviceRequests[index].loading = false;
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
      this.$refs.myMap.markerLatLng = this.serviceRequest.location;
      this.$refs.myMap.displayDialog = true;
    },
  },
};
</script>
<style>
</style>