<template>
  <div>
    <Dialog
      v-model:visible="detailsDialog"
      class="max-w-xl lg:w-full w-11/12"
      :modal="true"
      :closable="false"
    >
      <div class="flex flex-col gap-4" v-if="request">
        <div class="flex justify-around items-center">
          <div class="flex flex-col gap-3 items-center">
            <Avatar
              :image="request.applicant.avatar"
              shape="circle"
              size="xlarge"
              class="hidden md:flex"
            />
            <div>
              {{ request.applicant.firstname }} {{ request.applicant.lastname }}
            </div>
          </div>
        </div>
        <div class="flex justify-between" v-if="request.phone">
          <p>شماره تماس متقاضی</p>
          <p>{{ request.phone }}</p>
        </div>
        <div class="flex justify-between items-center">
          <div>خدمت</div>
          <div>{{ request.service }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>نشانی</div>
          <div>{{ request.address }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>تاریخ</div>
          <div>{{ request.date }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>هزینه خدمت</div>
          <div>{{ request.price }} تومان</div>
        </div>
        <div class="flex justify-between items-center">
          <div>ایاب و ذهاب</div>
          <div>{{ request.transport }} تومان</div>
        </div>
        <div class="flex justify-between items-center">
          <div>مساحت زمین</div>
          <div>{{ request.area }} هکتار</div>
        </div>
        <div class="flex justify-between items-center">
          <div>نوع زمین</div>
          <div>{{ request.terrain }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>نوع محصول</div>
          <div>{{ request.product }}</div>
        </div>
        <div class="flex justify-between" v-if="request.poison">
          <p>نوع سم</p>
          <p>{{ request.poison.type }}</p>
        </div>
        <div class="flex justify-between" v-if="request.poison">
          <p>نام سم</p>
          <p>{{ request.poison.title }}</p>
        </div>
        <div class="flex justify-between" v-if="request.rate">
          <p>نقاط قوت</p>
          <p class="whitespace-normal">
            {{ request.rate.strengths.join(", ") }}
          </p>
        </div>
        <div class="flex justify-between" v-if="request.rate">
          <p>نقاط صعف</p>
          <p class="whitespace-normal">{{ request.rate.weaks.join(", ") }}</p>
        </div>
        <div class="flex justify-between" v-if="request.rate">
          <p>نظر متقاضی</p>
          <p class="whitespace-normal">{{ request.rate.comment }}</p>
        </div>
        <Button
          label="نمایش موقعیت مکانی روی نقشه"
          class="p-button-outlined p-button-sm"
          @click="showLocation()"
        />

        <Map ref="myMap" :input="request.location" />
      </div>
      <template #footer>
        <div class="flex justify-between w-full">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="detailsDialog = false"
          />

          <div
            class="flex"
            v-if="
              request.status == 'accepting' ||
              request.status == 'publishing' ||
              request.status == 'broadcast'
            "
          >
            <Button
              label="رد کردن"
              class="p-button-text p-button-danger p-button-sm"
              @click="$refs.rejectDialog.open(request.id)"
            />
            <Button
              label="تایید درخواست"
              class="p-button-success p-button-sm"
              @click="$refs.timeDialog.open()"
            />
          </div>
          <div class="flex" v-else-if="request.status == 'coordinating'">
            <Button
              label="لغو کردن"
              class="p-button-text p-button-danger p-button-sm"
              @click="$refs.cancelDialog.open()"
            />
            <Button
              label="هماهنگ کردم"
              class="p-button p-button-success p-button-sm"
              :loading="loading"
              @click="coordinate()"
            />
          </div>
          <div class="flex" v-else-if="request.status == 'doing'">
            <Button
              label="لغو کردن"
              class="p-button-text p-button-danger p-button-sm"
              @click="$refs.cancelDialog.open()"
            />
            <Button
              label="اعلام انجام خدمت"
              class="p-button p-button-success p-button-sm"
              :loading="loading"
              @click="doit()"
            />
          </div>
          <div
            class="flex"
            v-else-if="
              request.status != 'rating' &&
              request.status != 'calculating' &&
              request.status != 'calculated' &&
              request.status != 'expired' &&
              request.status != 'refined'
            "
          >
            <Button
              label="لغو کردن"
              class="p-button p-button-danger p-button-sm"
              @click="$refs.cancelDialog.open(request.id)"
            />
          </div>
        </div>
      </template>
    </Dialog>

    <RejectDialog ref="rejectDialog" :reasons="reasons" />
    <CancelDialog ref="cancelDialog" :reasons="reasons" />

    <TimeDialog ref="timeDialog" @call="accept" />
  </div>
</template>

<script>
import RejectDialog from "./RejectDialog.vue";

import CancelDialog from "./CancelDialog.vue";
import TimeDialog from "./TimeDialog.vue";
import Map from "../../../components/basic/Map.vue";
import ServiceRequestsService from "../../../service/servant/ServiceRequests";
export default {
  components: { RejectDialog, TimeDialog, Map, CancelDialog },
  props: ["confirmBtn", "mapShow", "reasons"],

  data() {
    return {
      detailsDialog: false,
      request: null,
      id: null,
      serviceRequestsService: null,
      loading: false,
    };
  },
  methods: {
    open(data) {
      this.request = data;
      this.detailsDialog = true;
    },
    showLocation() {
      this.$refs.myMap.markerLatLng = this.request.location;
      this.$refs.myMap.displayDialog = true;
    },
    accept(data) {
      const body = {
        id: this.request.id,
        time: data.time,
      };
      this.serviceRequestsService.accept(
        body,
        () => {
          this.$refs.timeDialog.close();
          this.detailsDialog = false;
          this.$emit("call", this.request);
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: "با موفقیت تایید شد",
            life: 3000,
          });
        },
        (error) => {
          this.$refs.timeDialog.close();
          this.$toast.add({
            severity: "error",
            summary: "خطا",
            detail: error,
            life: 3000,
          });
        }
      );
    },

    doit() {
      if (this.request.cashed != "0") {
        const self = this;
        this.$confirm.require({
          message:
            " آیا مبلغ " +
            this.request.cashed +
            " تومان را به صورت نقدی دریافت کرده‌اید؟ ",
          header: "اطلاعیه",
          icon: "pi pi-check",
          acceptLabel: "بله دریافت کرده‌ام",
          acceptClass: "p-button-success p-button-sm float-left",
          rejectLabel: "بازگشت",
          accept: () => {
            self.doitConfirmation();
          },
          reject: () => {},
        });
      } else {
        this.doitConfirmation();
      }
    },

    doitConfirmation() {
      setTimeout(() => {
        this.$confirm.require({
          message: "آیا از اعلام انجام این خدمت اطمینان دارید؟",
          header: "اطلاعیه",
          icon: "pi pi-check",
          acceptLabel: "بله انجام شد",
          acceptClass: "p-button-success p-button-sm float-left",
          rejectLabel: "بازگشت",
          accept: () => {
            this.loading = true;
            this.serviceRequestsService.doit(
              this.request.id,
              () => {
                this.loading = false;
                this.detailsDialog = false;
                this.$emit("call", this.request.id);
                this.$toast.add({
                  severity: "success",
                  summary: "موفق",
                  detail: "با موفقیت اعلام شد",
                  life: 3000,
                });
              },
              (error) => {
                this.loading = false;
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
      }, 300);
    },

    coordinate() {
      this.$confirm.require({
        message: "آیا بدرستی با متقاضی خدمت هماهنگ کرده اید؟",
        header: "اطلاعیه",
        icon: "pi pi-check",
        acceptLabel: "بله هماهنگ شد",
        acceptClass: "p-button-success p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.loading = true;
          this.serviceRequestsService.coordinate(
            this.request.id,
            () => {
              this.loading = false;
              this.detailsDialog = false;
              this.$emit("call", this.request.id);
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "با موفقیت ثبت شد",
                life: 3000,
              });
            },
            () => {}
          );
        },
        reject: () => {},
      });
    },
  },
  created() {
    this.serviceRequestsService = new ServiceRequestsService();
  },
};
</script>

<style>
</style>