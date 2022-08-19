<template>
  <card class="profile-location">
    <template #header> </template>
    <template #title>
      <div class="flex justify-between items-center">
        <p v-if="input">موقعیت مکانی</p>
        <Skeleton v-else width="40%" height="1.2rem" />
        <Button
          v-if="!editMode && input"
          icon="pi pi-pencil"
          class="p-button-rounded p-button-outlined p-button-plain"
          @click="editMode = true"
        />
        <Skeleton v-else-if="!editMode" shape="circle" size="3.2rem" />
      </div>
    </template>
    <template #content>
      <Message
        severity="error"
        v-if="support != 1 && $route.path.split('/')[1] == 'applicant'"
      >
        استان مورد نظر شما تحت پوشش نیست لطفا با شماره 02144166975 تماس بگیرید.
      </Message>
      <div v-if="editMode" class="flex flex-col gap-3">
        <GetLocation :place="place" @call="newPlace = $event" />
      </div>
      <div class="flex w-full flex-col gap-3 px-4" v-else>
        <div
          class="flex items-center gap-8 text-left text-sm lg:text-base"
          v-for="(item, index) in items"
          :key="index"
        >
          <p v-if="input" class="w-1/3 lg:w-1/5">{{ item.title }}</p>
          <Skeleton v-else width="15%" class="mr-10" />
          <Button
            v-if="index == 'location' && item.map"
            class="p-button-text p-button-success"
            label="انتخاب شده"
            @click="displayMap(item.map)"
          />
          <p v-else-if="input" class="font-bold">{{ item.value }}</p>
          <Skeleton v-else width="30%" />
        </div>
      </div>
      <MapDialog
        ref="mapDialog"
        @call="setLocation($event)"
        :input="pickLocation"
      />
    </template>
    <template #footer>
      <div
        class="flex flex-col lg:flex-row justify-between gap-2"
        v-if="editMode"
      >
        <div class="-mt-8 lg:mt-0">
          <Button
            class="p-button-text p-button-primary"
            :label="!pickLocation ? 'موقعیت مکانی دقیق' : 'انتخاب شده'"
            icon="pi pi-map-marker"
            @click="selectMap()"
            :disabled="locationBtn"
          />
        </div>
        <div class="flex gap-3 mr-auto">
          <Button
            label="انصراف"
            class="p-button-text p-button-success"
            @click="cancel()"
          />
          <Button
            label="بروزرسانی"
            class="p-button-success p-button-plain"
            @click="updatePlace()"
            :disabled="updateBtnDisable"
            :loading="loading"
          />
        </div>
      </div>
    </template>
  </card>
</template>

<script>
import GetLocation from "../../components/basic/GetLocation.vue";
import MapDialog from "../../components/basic/Map.vue";
import ProfileService from "../../service/profile.js";
export default {
  components: { GetLocation, MapDialog },
  props: ["input"],
  data() {
    return {
      editMode: false,
      place: null,
      items: {
        country: { title: "کشور" },
        province: { title: "استان" },
        township: { title: "شهرستان" },
        region: { title: "بخش" },
        ch: { title: "شهر یا دهستان" },
        village: { title: "روستا" },
        location: { title: "موقعیت دقیق", value: "انتخاب نشده", map: null },
      },
      newPlace: [],
      profileService: null,
      loading: false,
      updateBtnDisable: true,
      pickLocation: null,
      locationBtn: true,
      support: 1,
    };
  },
  created() {
    this.profileService = new ProfileService();
  },
  methods: {
    cancel() {
      this.editMode = false;
      this.pickLocation = null;
    },

    displayMap(location) {
      this.pickLocation = location;
      this.$refs.mapDialog.displayDialog = true;
    },

    selectMap() {
      if (this.items.location.map) {
        this.pickLocation = this.items.location.map;
      } else if (this.newPlace.length > 1) {
        this.pickLocation = this.newPlace[1].location;
      }
      this.$refs.mapDialog.displayDialog = true;
      setTimeout(() => {
        this.pickLocation = null;
      }, 300);
    },

    updatePlace() {
      this.loading = true;
      const place = this.newPlace[this.newPlace.length - 1];
      const data = {
        id: place.id,
        type: place.type,
        location: this.pickLocation,
      };
      (place.user = this.$route.path.indexOf("servant") < 0 ? 1 : 2),
        this.profileService.updatePlace(
          data,
          (data) => {
            this.loading = false;
            this.editMode = false;
            this.initPlace(data.place);
            if (data.location) {
              this.items.location.map = data.location;
            }
            this.$toast.add({
              severity: "success",
              summary: "موفق",
              detail: "با موفقیت بروزرسانی شد",
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

    initPlace(place) {
      try {
        this.place = [];
        Object.entries(place).forEach((x) => {
          this.place.push({
            type: x[0],
            id: x[1].id,
            title: x[1].title,
          });
        });
        this.items.country.value = place.country.title;
        this.items.province.value = place.province.title;
        this.items.township.value = place.township.title;
        this.items.region.value = place.region.title;
        if (place.city) {
          this.items.ch.value = place.city.title;
          this.items.ch.title = "شهر";
          delete this.items.village;
        } else if (place.hamlet) {
          this.items.ch.value = place.hamlet.title;
          this.items.ch.title = "دهستان";
          this.items.village.value = place.village.title;
        }
      } catch (error) {
        //
      }
    },

    setLocation(event) {
      this.pickLocation = event;
    },
  },
  watch: {
    input: {
      handler(v) {
        if (v) {
          if (v.location) {
            this.items.location.map = v.location;
          }
          if ("country" in v.place) {
            this.initPlace(v.place);
          }
        }
      },
      deep: true,
    },
    newPlace(v) {
      const count = v.length;
      if (count > 1) {
        this.support = v[1].support;
      } else {
        this.support = 1;
      }
      if (v[count - 1].type == "village" || v[count - 1].type == "city") {
        this.locationBtn = false;
      } else this.locationBtn = true;

      let limit = 4;
      if (v[count - 1].type == "hamlet") limit++;
      this.updateBtnDisable = count <= limit || !this.pickLocation;
    },
    pickLocation(v) {
      if (this.newPlace && v) {
        const count = this.newPlace.length;
        let limit = 4;
        if (this.newPlace[count - 1].type == "hamlet") limit++;
        this.updateBtnDisable = count <= limit || !v;
      } else {
        this.updateBtnDisable = true;
      }
    },
  },
};
</script>

<style>
.p-chips,
.p-chips-multiple-container {
  @apply w-full;
}
.p-chips-token {
  direction: ltr;
  @apply m-0 ml-2 text-sm !important;
}
.p-chips-remove-hidden > span:last-child {
  @apply hidden;
}
</style>