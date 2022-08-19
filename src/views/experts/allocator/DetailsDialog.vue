<template>
  <div>
    <Dialog
      v-model:visible="dialog"
      class="max-w-xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <a :href="url" target="_blank">
          <i class="pi pi-print text-2xl"> </i>
        </a>
      </template>

      <div class="flex flex-col gap-4 text-sm" v-if="request">
        <div class="flex justify-around items-center">
          <div class="flex flex-col gap-3 items-center justify-around">
            <Avatar
              :image="request.applicant.avatar"
              shape="circle"
              size="xlarge"
              class="hidden md:flex"
            />
            <p>
              {{ request.applicant.firstname }} {{ request.applicant.lastname }}
            </p>
            <p class="text-xs text-gray-400">متقاضی</p>
          </div>
          <div
            class="flex flex-col gap-3 items-center"
            v-if="request.status != 'allocating'"
          >
            <Avatar
              :image="request.servant.avatar"
              shape="circle"
              size="xlarge"
              class="hidden md:flex"
            />
            <p>
              {{ request.servant.firstname }} {{ request.servant.lastname }}
            </p>
            <p class="text-xs text-gray-400">خدمت دهنده</p>
          </div>
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
          <div>مبلغ</div>
          <div>{{ request.price }} تومان</div>
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
        <Button
          label="نمایش موقعیت مکانی روی نقشه"
          class="p-button-outlined p-button-sm mt-4"
          @click="showLocation()"
        />

        <Map ref="myMap" :input="request.location" />
      </div>

      <template #footer>
        <div class="flex justify-between">
          <Button
            label="بازگشت"
            class="p-button-text p-button-info p-button-sm"
            @click="close()"
          />

          <div
            v-if="
              (request.status == 'allocating' ||
                request.status == 'transferring' ||
                request.status == 'broadcast') &&
              ($route.path.split('/')[1] == 'allocator' ||
                $route.path.split('/')[1] == 'company')
            "
          >
            <Button
              label="رد کردن"
              class="p-button-text p-button-danger p-button-sm hidden"
              @click="$refs.rejectDialog.open()"
            />
            <Button
              label="تخصیص  به ..."
              class="p-button-raised p-button-success p-button-sm"
              @click="$refs.allocateDialog.open(request)"
              :loading="loading"
            />
            <Button
              label="انتشار عمومی"
              class="p-button-raised p-button-help p-button-sm"
              @click="publish(request.id)"
              :loading="publishing"
            />
          </div>
          <Button
            label="فرم اطلاعات پروازی"
            class="p-button-raised p-button-success p-button-sm"
            @click="openUrl()"
            v-if="$route.path.split('/')[1] == 'flight'"
          />
        </div>
      </template>
    </Dialog>
    <AllocateDialog ref="allocateDialog" @call="allocateServant()" />
    <RejectDialog ref="rejectDialog" />
  </div>
</template>

<script>
import AllocateDialog from "./AllocateDialog.vue";
import RejectDialog from "./RejectDialog.vue";
import Map from "../../../components/basic/Map.vue";
import AllocatorService from "../../../service/allocator";
export default {
  components: { AllocateDialog, RejectDialog, Map },
  data() {
    return {
      dialog: false,
      avatar: null,
      id: null,
      request: null,
      loading: false,
      allocatorService: null,
      publishing: false,
      transforring: false,
      token: null,
      url: null,
    };
  },
  mounted() {
    this.token = localStorage.getItem("token");
  },
  methods: {
    openUrl(){
      window.open(this.url, '_blank')
    },
    open(request) {
      this.request = request;
      this.dialog = true;
      this.url =
        window.location.origin +
        "/sirang/flightInfo/" +
        request.id +
        "?t=" +
        this.token;
    },
    close() {
      this.loading = false;
      this.dialog = false;
    },
    showLocation() {
      this.$refs.myMap.markerLatLng = this.request.location;
      this.$refs.myMap.displayDialog = true;
    },

    allocateServant() {
      this.dialog = false;
      this.$emit("call", this.request);
    },
    publish(id) {
      this.$confirm.require({
        message: "آیا از انتشار این درخواست اطمینان دارید؟",
        header: "هشدار",
        icon: "pi pi-check",
        acceptLabel: "منتشر شود",
        acceptClass: "p-button-success p-button-sm float-left",
        rejectLabel: "بازگشت",
        accept: () => {
          this.publishing = true;
          this.allocatorService.publish(
            id,
            () => {
              this.$toast.add({
                severity: "success",
                summary: "موفق",
                detail: "باموفقیت منتشر شد",
                life: 3000,
              });
              this.$emit("call", this.request);
              this.publishing = false;
              this.dialog = false;
            },
            (error) => {
              this.publishing = false;
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
  created() {
    this.allocatorService = new AllocatorService();
  },
};
</script>

<style>
</style>