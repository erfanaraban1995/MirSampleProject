import i18n from '@/plugins/i18n'
export default {
  statusType: [
    {value: null, text: i18n.t('shared.choose')},
    {value: 'DRAFT', text: i18n.t('shared.draft')},
    {value: 'PENDING', text: i18n.t('shared.pending')},
    {value: 'CONFIRMED', text: i18n.t('shared.confirmed')},
    {value: 'REJECTED', text: i18n.t('shared.rejected')}
  ],
  booleanOptions: [
    {value: null, text: i18n.t('shared.choose')},
    {value: true, text: i18n.t('shared.yes')},
    {value: false, text: i18n.t('shared.no')}
  ],

  genderOptions: [
    {value: null, text: i18n.t('shared.choose')},
    {value: 'MALE', text: i18n.t('shared.male')},
    {value: 'FEMALE', text: i18n.t('shared.female')}
  ],

  locales: [
    {value: null, text: i18n.t('shared.choose')},
    {value: 'fa', text: i18n.t('shared.persian')},
    {value: 'en', text: i18n.t('shared.english')}
  ],
}
