<script>
export default {
  name: 'EditForm',
  data() {
    return {
      initializing: true,
      progressing: false,
      model: {
        user: {
          email: null,
          firstName: null,
          lastName: null,
          legal: false,
          legalName: null,
          mobile: null,
          nationalId: null,
          twoFactorEnabled: true
        },
        profile: {
          birthDay: null,
          birthMonth: null,
          birthYear: null,
          gender: null,
          image: null
        }
      }
    }
  },
  computed: {
    year() {
      const now = new Date()
      return String(now.getFullYear() - 621)
    },
    day() {
      return this.model.profile.birthMonth > 6 ? '30' : '31'
    }
  }
  
}
</script>
