const sharedConfig = () => ({
  homeUrl: '/dashboard',
  defaultPageSize: 20,
  defaultCalendar: 'jalali',
  infinitiTime: '2999-01-01T00:00:00',
  infinitiAmount: 2147483647,
  calendars: ['jalali'],
  prefixType: 'Regymi',
  currency: {
    base: 'IRR',
    display: 'IRR',
    rates: {
      IRR: 1,
      IRT: 10
    }
  },
  geolocations: {
    timeZone: {
      text: 'Asia/Tehran',
      value: '+04:30'
    }
  },
  locales: [
    {text: 'faMessage', value: 'fa'},
    {text: 'enMessage', value: 'en'}
  ],
  store: {
    id: 1002,
    name: 'Regymi'
  }
})
export default config => {
  const scheme = config.ssl ? 'https://' : 'http://'
  config.apiServerUrl = scheme + config.apiServer
  config.files.staticServerUrl = scheme + config.files.staticServer
  config.files.thumbServerUrl = scheme + config.files.thumbServer
  config = {...config, ...sharedConfig(config)}

  return config
}
