<template>
  <div>
    <Dialog
      v-model:visible="deleteProductDialog"
      class="max-w-2xl w-11/12 lg:w-full"
      :modal="true"
      :closable="false"
    >
      <template #header> </template>

      <div class="flex flex-col gap-8">
        <div class="flex justify-around items-center">
          <div class="flex gap-3 items-center">
            <Avatar
              :image="paired.applicant.avatar"
              shape="circle"
              size="xlarge"
              class="hidden md:flex"
            />
            <div>
              <div>متقاضی</div>
              <Tag :value="paired.applicant.fullname" />
            </div>
          </div>

          <div class="flex gap-3 items-center">
            <div>
              <div>خدمات دهنده</div>
              <Tag :value="paired.servant.fullname" severity="danger" />
            </div>
            <Avatar
              :image="paired.servant.avatar"
              shape="circle"
              size="xlarge"
              class="hidden md:flex"
            />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div>خدمت</div>
          <div>{{ paired.service }}</div>
        </div>
         <div class="flex justify-between items-center">
          <div>منطقه</div>
          <div>{{ paired.place }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>تاریخ</div>
          <div>{{ paired.date }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>ساعت</div>
          <div>{{ paired.time }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>مبلغ</div>
          <div>{{ paired.price }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>مساحت زمین</div>
          <div>{{ paired.landArea }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>نوع زمین</div>
          <div>{{ paired.landType }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>شماره تلفن خدمت دهنده</div>
          <div>{{paired.servant.phone}}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>شماره تلفن متقاضی</div>
          <div>{{paired.applicant.phone}}</div>
        </div>
        <Button
          label="نمایش موقعیت مکانی روی نقشه"
          class="p-button-outlined p-button-sm"
          @click="showLocation()"
        />

        <Map ref="myMap" :input="paired.location"/>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <div>
            <Button
              label="بازگشت"
              class="p-button-text p-button-info p-button-sm"
              @click="deleteProductDialog = false"
            />
          </div>
          <div v-if="paired.status == 'pendingExpert'">
            <Button
              label="رد کردن"
              class="p-button-text p-button-danger p-button-sm"
              @click="$refs.rejectDialog.open()"
            />
            <Button
              label="تایید درخواست"
              class="p-button-raised p-button-success p-button-sm"
              @click="pairedsConfirm()"
              :loading="loading"
            />
          </div>
          <div v-else-if="paired.status == 'pendingDone'">
            <Button
              label="لغو کردن"
              class="p-button-text p-button-danger p-button-sm"
              @click="$refs.rejectDialog.open()"
            />
          </div>
        </div>
      </template>
    </Dialog>
    <!-- <ConfirmDialog ref="confirmDialog" /> -->
    <RejectDialog ref="rejectDialog" />
  </div>
</template>

<script>
import RejectDialog from "./RejectDialog.vue";
import Map from "../../../components/basic/Map.vue";
import OperationService from "../../../service/operation";

export default {
  components: { RejectDialog, Map },
  data() {
    return {
      operationService: null,
      deleteProductDialog: false,
      avatar: null,
      id: null,
      paired: null,
      loading: false,
    };
  },
  methods: {
    open(paired) {
      this.paired = paired;
      this.deleteProductDialog = !this.deleteProductDialog;
    },
    showLocation() {
      this.$refs.myMap.displayDialog = true;
    },

    pairedsConfirm() {
      this.loading = true;
      // setTimeout(() => {
      //   this.loading = false;
      //   this.deleteProductDialog = false;
      //   this.$emit("call", "");
      // }, 1000);
      this.operationService.pairedsConfirm(
        this.paired.id,
        (data) => {
          this.loading = false;
          this.deleteProductDialog = false;
          this.$toast.add({
            severity: "success",
            summary: "موفق",
            detail: data,
            life: 3000,
          });
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
  },

  created() {
    this.operationService = new OperationService();
  },

  mounted() {},
};
</script>

<style>
</style>