import Vue from 'vue'
import CTooltip from '@/components/shared/CTooltip'
import AutoComplete from '@/components/shared/AutoComplete'
import BLabel from '@/components/shared/BLabel'
import AutoCompleteMulti from '@/components/shared/AutoCompleteMulti'
import BackBtn from '@/components/shared/BackBtn'
import BLoading from '@/components/shared/BLoading'
import cSwitch from '@/components/shared/Switch'
import CModal from '@/components/shared/CModal'
import CurrencyEditor from '@/components/shared/CurrencyEditor'
import DatePicker from '@/components/shared/DatePicker'
import MiddleInput from '@/components/shared/MiddleInput'
import NoItem from '@/components/shared/NoItem'
import TableFooter from '@/components/shared/TableFooter'
import NumericInput from '@/components/shared/NumericInput'
import MobileInput from '@/components/shared/MobileInput'
import PageFooter from '@/components/shared/PageFooter'
import SearchForm from '@/components/shared/SearchForm'
import Uploader from '@/components/shared/Uploader'
import {
  CurrencyDisplay,
  DateDisplay,
  NumericDisplay,
  TimeDisplay,
  ErrorsDisplay
} from '@/components/shared/display'
import SearchWrapper from '@/components/shared/search/SearchWrapper'
import activeDisplay from '@/components/shared/display/activeDisplay'
import MobileDisplay from '@/components/shared/display/MobileDisplay'
Vue.component('SearchForm', SearchForm)
Vue.component('SearchWrapper', SearchWrapper)
Vue.component('CTooltip', CTooltip)
Vue.component('BLabel', BLabel)
Vue.component('CModal', CModal)
Vue.component('TimeDisplay', TimeDisplay)
Vue.component('BLoading', BLoading)
Vue.component('ErrorsDisplay', ErrorsDisplay)
Vue.component('cSwitch', cSwitch)
Vue.component('Uploader', Uploader)
Vue.component('NumericDisplay', NumericDisplay)
Vue.component('DateDisplay', DateDisplay)
Vue.component('DatePicker', DatePicker)
Vue.component('AutoCompleteMulti', AutoCompleteMulti)
Vue.component('AutoComplete', AutoComplete)
Vue.component('NumericInput', NumericInput)
Vue.component('MobileInput', MobileInput)
Vue.component('MiddleInput', MiddleInput)
Vue.component('BackBtn', BackBtn)
Vue.component('TableFooter', TableFooter)
Vue.component('PageFooter', PageFooter)
Vue.component('NoItem', NoItem)
Vue.component('CurrencyEditor', CurrencyEditor)
Vue.component('CurrencyDisplay', CurrencyDisplay)
Vue.component('activeDisplay', activeDisplay)
Vue.component('mobileDisplay', MobileDisplay)
