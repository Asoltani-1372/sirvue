import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker.js'
import router from './router'
import store from './store'
import ToastService from 'primevue/toastservice';
// primevue library
// import 'primevue/resources/themes/tailwind-light/theme.css'
import './assets/css/tail.css'

// import 'primevue/resources/primevue.min.css'
import './assets/css/prime.css'

import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';

// primevue components
import Button from 'primevue/button';
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Password from "primevue/password";
import Image from 'primevue/image';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import CascadeSelect from 'primevue/cascadeselect';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import TieredMenu from 'primevue/tieredmenu';
import PanelMenu from 'primevue/panelmenu';
import Calendar from 'primevue/calendar';
import Listbox from 'primevue/listbox';
import Tooltip from 'primevue/tooltip';
import PickList from 'primevue/picklist';
import Dropdown from 'primevue/dropdown';
import Toolbar from 'primevue/toolbar';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import InputSwitch from 'primevue/inputswitch';
import Rating from 'primevue/rating';
import ToggleButton from 'primevue/togglebutton';
import SelectButton from 'primevue/selectbutton';
import ProgressBar from 'primevue/progressbar';
import Paginator from 'primevue/paginator';
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import TabMenu from 'primevue/tabmenu';
import Tag from 'primevue/tag';
import OverlayPanel from 'primevue/overlaypanel';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import FileUpload from 'primevue/fileupload';
import Message from 'primevue/message';
import Carousel from 'primevue/carousel';
import Skeleton from 'primevue/skeleton';
import Sidebar from 'primevue/sidebar';
import Chip from 'primevue/chip';
import Steps from 'primevue/steps';
import Inplace from 'primevue/inplace';
import Checkbox from 'primevue/checkbox';
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'

import './index.css'


const app = createApp(App);
app.use(store)
app.use(router)
app.use(PrimeVue, {
    ripple: true,
    locale: {
        dayNames: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
        dayNamesShort: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
        dayNamesMin: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
        monthNames: ["فرودین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
        monthNamesShort: ["فرودین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
        dateFormat: 'yy/mm/dd',
        firstDayOfWeek: 0,
    }
});
app.use(ToastService);
app.use(VueAxios, axios);
app.use(ConfirmationService);
// primevue components
app.component('Button', Button);
app.component('InputNumber', InputNumber);
app.component('InputText', InputText);
app.component('InputMask', InputMask);
app.component('Password', Password);
app.component('Image', Image);
app.component('Card', Card);
app.component('Avatar', Avatar);
app.component('CascadeSelect', CascadeSelect);
app.component('Toast', Toast);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Badge', Badge);
app.component('TieredMenu', TieredMenu);
app.component('PanelMenu', PanelMenu);
app.component('Calendar', Calendar);
app.component('Listbox', Listbox);
app.component('PickList', PickList);
app.component('Dropdown', Dropdown);
app.component('Toolbar', Toolbar);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('DataTable', DataTable);
app.component('InputSwitch', InputSwitch);
app.component('Rating', Rating);
app.component('ToggleButton', ToggleButton);
app.component('SelectButton', SelectButton);
app.component('ProgressBar', ProgressBar);
app.component('Paginator', Paginator);
app.component('MultiSelect', MultiSelect);
app.component('Textarea', Textarea);
app.component('AutoComplete', AutoComplete);
app.component('TabMenu', TabMenu);
app.component('Tag', Tag);
app.component('OverlayPanel', OverlayPanel);
app.component('ConfirmDialog', ConfirmDialog);
app.component('FileUpload', FileUpload);
app.component('Message', Message);
app.component('Carousel', Carousel);
app.component('Skeleton', Skeleton);
app.component('Sidebar', Sidebar);
app.component('Chip', Chip);
app.component('Steps', Steps);
app.component('Inplace', Inplace);
app.component('Checkbox', Checkbox);


// primevue directive
app.directive('badge', BadgeDirective);
app.directive('tooltip', Tooltip);
app.mount('#app')