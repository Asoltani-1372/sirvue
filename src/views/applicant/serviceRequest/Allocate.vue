<template>
  <Card class="w-full">
    <template #title>
      <p>تخصیص</p>
    </template>
    <template #content>
      <div class="flex justify-evenly">
        <div class="w-full">
          <div class="flex flex-col items-center gap-8">
            <p class="text-center">متقاضی</p>
            <SelectButton
              v-model="applicantOptionValue"
              :options="applicantOptions"
              optionLabel="name"
              optionValue="value"
              dir="ltr"
              class="flex items-center"
              :disabled="fetching || applicants.length < 1"
            />
            <Listbox
              v-show="applicantOptionValue == 2"
              v-model="selectedApplicant"
              :options="applicants"
              :filter="!fetching && applicants.length > 0"
              :disabled="fetching || applicants.length < 1"
              optionLabel="name"
              filterPlaceholder="جستجو"
              listStyle="max-height: 15rem"
              style="width: 20rem"
            >
              <template #empty>
                <p class="text-sm text-center">کشاورزی یافت نشد</p>
              </template>
              <template #option="slotProps">
                <div class="flex gap-3">
                  <Skeleton size="3rem" shape="circle" v-if="fetching" />
                  <Avatar
                    :image="slotProps.option.avatar"
                    shape="circle"
                    size="large"
                    v-else
                  />
                  <div class="flex flex-col justify-center gap-1">
                    <Skeleton width="10rem" v-if="fetching" />
                    <p v-else>
                      {{
                        slotProps.option.firstname +
                        " " +
                        slotProps.option.lastname
                      }}
                    </p>
                    <Skeleton width="10rem" v-if="fetching" />
                    <p class="text-xs text-left" v-else>
                      {{ slotProps.option.phone }}
                    </p>
                  </div>
                </div>
              </template>
            </Listbox>
          </div>
        </div>

        <div class="w-1/2 hidden">
          <div class="flex flex-col items-center gap-8">
            <p class="text-center">کاربر پهپاد</p>
            <SelectButton
              v-model="servantOptionValue"
              :options="servantOptions"
              optionLabel="name"
              optionValue="value"
              dir="ltr"
              class="flex items-center"
              :disabled="fetching || servants.length < 1"
            />
            <Listbox
              v-show="servantOptionValue == 1"
              v-model="selectedServant"
              :options="servants"
              :filter="!fetching && servants.length > 0"
              :disabled="fetching || servants.length < 1"
              optionLabel="name"
              filterPlaceholder="جستجو"
              listStyle="max-height: 15rem"
              style="width: 20rem"
            >
              <template #empty>
                <p class="text-sm text-center">خدمت دهنده ای یافت نشد</p>
              </template>
              <template #option="slotProps">
                <div class="flex gap-3">
                  <Skeleton size="3rem" shape="circle" v-if="fetching" />
                  <Avatar
                    :image="slotProps.option.avatar"
                    shape="circle"
                    size="large"
                    v-else
                  />
                  <div class="flex flex-col justify-center gap-1">
                    <Skeleton width="10rem" v-if="fetching" />
                    <p v-else>
                      {{
                        slotProps.option.firstname +
                        " " +
                        slotProps.option.lastname
                      }}
                    </p>
                    <Skeleton width="10rem" v-if="fetching" />
                    <p class="text-xs text-left" v-else>
                      {{ slotProps.option.phone }}
                    </p>
                  </div>
                </div>
              </template>
            </Listbox>
          </div>
        </div>
      </div>
    </template>
    <!-- set page index -->
    <template #footer>
      <div class="flex justify-between">
        <Button
          label="بازگشت"
          icon="pi pi-chevron-right"
          class="p-button-text p-button-sm"
          @click="$emit('prevPage', { pageIndex: 3 })"
        />
        <Button
          label="بعدی"
          icon="pi pi-chevron-left"
          class="p-button-sm p-button-success"
          iconPos="right"
          @click="nextPage()"
          :disabled="nextBtn || fetching"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import ServiceRequestService from "../../../service/applicant/serviceRequestService";
export default {
  data() {
    return {
      serviceRequestService: null,
      fetching: true,
      servantOptionValue: 2,
      servantOptions: [
        { name: "انتشار عمومی", value: 2 },
        { name: "انتخاب خدمت دهنده", value: 1 },
      ],
      selectedServant: null,
      servants: [{}, {}, {}],
      applicantOptionValue: 1,
      applicantOptions: [
        { name: "انتخاب کشاورز", value: 2 },
        { name: "برای خودم", value: 1 },
      ],
      selectedApplicant: null,
      applicants: [{}, {}, {}],
      nextBtn: false,
    };
  },
  created() {
    this.serviceRequestService = new ServiceRequestService();
  },
  mounted() {
    this.serviceRequestService.getCompanyUsers(
      (data) => {
        this.fetching = false;
        this.servants = data.servants;
        this.applicants = data.applicants;
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
  methods: {
    nextPage() {
      this.$emit("next-page", {
        formData: {
          servant: this.selectedServant,
          applicant: this.selectedApplicant,
        },
        pageIndex: 3,
      });
    },
    enableBtn() {
      this.nextBtn =
        (this.servantOptionValue == 1 && !this.selectedServant) ||
        (this.applicantOptionValue == 2 && !this.selectedApplicant);
    },
  },
  watch: {
    servantOptionValue() {
      this.selectedServant = null;
      this.enableBtn();
    },
    applicantOptionValue() {
      this.selectedApplicant = null;
      this.enableBtn();
    },
    selectedServant() {
      this.enableBtn();
    },
    selectedApplicant() {
      this.enableBtn();
    },
  },
};
</script>

<style>
.p-buttonset .p-button:not(:last-child) {
  border-left: 1px solid #d4d4d8;
  border-right: 0 none;
}
</style>