<template>
  <div class="get-location">
    <AutoComplete
      :multiple="true"
      v-model="placeSeleted"
      :suggestions="placesSuggest"
      @focus="searchPlace()"
      field="title"
      class="w-full"
      ref="chips"
      :class="{ 'opacity-0': hidden, 'p-invalid': invalid }"
      :placeholder="
        input && input.disabled
          ? 'در حال جستجو ...'
          : 'نام ' + divisions[placeSeleted.length] + ' را انتخاب نمایید'
      "
    />
  </div>
</template>

<script>
import PlaceService from "../../service/servant/Place.js";
export default {
  props: ["place", "invalid"],
  created() {
    this.placeService = new PlaceService();
  },
  mounted() {
    this.input = this.$refs.chips.$refs.input;
    this.placeSeleted = this.place || [
      { title: "ایران", id: 1, type: "country" },
    ];
    setTimeout(() => {
      this.hidden = false;
      this.managePlace();
    }, 100);
  },
  data() {
    return {
      placesSuggest: null,
      placeService: null,
      divisions: ["کشور", "استان", "شهرستان", "بخش", "شهر یا دهستان", "روستا"],
      prefix: {
        country: "کشور",
        province: "استان",
        township: "شهرستان",
        region: "بخش",
        city: "شهر",
        hamlet: "دهستان",
        village: "روستا",
      },
      modes: ["country", "province", "township", "region", "ch", "village"],
      placeSeleted: [],
      timer: null,
      input: null,
      hidden: true,
    };
  },
  methods: {
    managePlace() {
      try {
        const count = this.placeSeleted.length;
        if (count > 0) {
          let limit = 4;
          if (this.placeSeleted[count - 1].type == "hamlet") limit++;
          if (count > limit) {
            this.input.classList.add("hidden");
          } else {
            this.input.classList.remove("hidden");
          }
          for (let i = 0; i < count; i++) {
            this.$refs.chips.$el.children[0].children[i].classList.remove(
              "remove-hidden"
            );
          }

          for (let i = 0; i < count - 1; i++) {
            this.$refs.chips.$el.children[0].children[i].classList.add(
              "remove-hidden"
            );
          }
          this.placeSeleted.forEach((element) => {
            const prefix = this.prefix[element.type];
            if (element.title.search(prefix)) {
              element.title = prefix + " " + element.title;
            }
          });
          this.$emit("call", this.placeSeleted);
        }
      } catch (error) {
        //
      }
    },

    searchPlace() {
      this.placesSuggest = [];
      clearTimeout(this.timer);
      const mode = this.modes[this.placeSeleted.length];
      let parent = 1;
      if (mode != "country") {
        parent = this.placeSeleted[this.placeSeleted.length - 1].id;
      }
      this.input.disabled = true;
      this.timer = setTimeout(() => {
        const body = {
          parent,
          mode,
        };

        this.placeService.search(
          body,
          (data) => {
            this.placesSuggest = data.result;
            if (this.placesSuggest.length > 0) {
              this.$refs.chips.showOverlay();
              this.input.disabled = false;
            }
          },
          () => {}
        );
      }, 250);
    },

    reset() {
      this.placeSeleted = [];
    },
  },
  watch: {
    placeSeleted() {
      if (!this.hidden) this.searchPlace();
      this.managePlace();
    },
    place(v) {
      if (v) {
        this.placeSeleted = v;
        setTimeout(() => {
          this.managePlace();
        }, 100);
      }
    },
  },
};
</script>

<style scoped>
.get-location {
  @apply w-full;
}
</style>
<style>
.remove-hidden > span:last-child {
  @apply hidden !important;
}
.get-location > span > ul {
  @apply w-full overflow-auto text-xs lg:text-sm;
}
.get-location > span > ul > li {
  @apply ml-0 !important;
}
.get-location > span > ul > li > input {
  @apply text-sm !important;
}
</style>