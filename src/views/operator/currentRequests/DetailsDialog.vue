<template>
  <Dialog
    :visible="displayModal"
    class="max-w-xl w-11/12 lg:w-full"
    :modal="true"
    :closable="false"
  >
    <template #header>
      <a :href="url" target="_blank">
        <i class="pi pi-print text-2xl"> </i>
      </a>
    </template>
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
        <div v-if="serviceRequest.status == 'verifying'" class="flex gap-4">
          <Button
            class="p-button-success p-button-sm"
            label="تاید پرواز"
            @click="verifying(serviceRequest.id)"
          />
          <Button
            class="p-button-text p-button-danger p-button-sm"
            label="پرواز ممنوع"
            @click="reject(serviceRequest.id)"
          />
        </div>
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
      token: null,
      url: null,
    };
  },

  created() {
    this.monitoringService = new MonitoringService();
  },

   mounted() {
    this.token = localStorage.getItem("token");
  },

  methods: {
    open(id, index) {
      this.serviceRequestDetails(id, index);
      this.url =
        window.location.origin +
        "/sirang/flightInfo/" +
        id +
        "?t=" +
        this.token;
      //this.$parent.serviceHistories[index].loading = true;
    },

    serviceRequestDetails(id, index) {
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
          index;
          //this.$parent.serviceHistories[index].loading = false;
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
      this.$refs.myMap.markerLatLng = this.serviceRequest.location;
      this.$refs.myMap.displayDialog = true;
    },

    verifying(id) {
      this.$confirm.require({
        message: "آیا از تایید پرواز این درخواست اطمینان دارید؟",
        header: "هشدار",
        icon: "pi pi-check",
        acceptLabel: "تایید شود",
        acceptClass: "p-button-danger p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.monitoringService.verifying(
            id,
            () => {
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "باموفقیت تایید شد",
                life: 3000,
              });
              this.displayModal = false;
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
        reject: () => {},
      });
    },

    ban(id) {
      this.$confirm.require({
        message: "آیا از منع پرواز این درخواست اطمینان دارید؟",
        header: "هشدار",
        icon: "pi pi-check",
        acceptLabel: "منع شود",
        acceptClass: "p-button-danger p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.monitoringService.ban(
            id,
            () => {
              this.$toast.add({
                severity: "warn",
                summary: "موفق",
                detail: "باموفقیت ممنوع شد",
                life: 3000,
              });
              this.displayModal = false;
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
        reject: () => {},
      });
    },
  },
};
</script>
<style>
</style>