

<script>

import emptyDashboard from './empty'

export default {
  // name: 'Dashboard',
  // components: { emptyDashboard },
  // data () {
  //   return {
  //     // currentRole: 'emptyDashboard'
  //   }
  // },
  // computed: {

  // },
  created () {
    // let firstRoute = this.$store.state.permissions.addRouters[0]
    this.$router.replace({ path: '/user' })
  },
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
