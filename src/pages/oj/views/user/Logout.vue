<script>
  export default {
    mounted () {
      this.$store.dispatch('user/logout')
        .then(res => {
          this.$router.replace({
            path: '/'
          })
        })
        .catch(res => {
        })
    },
    render: function (h) {
      return h() // avoid warning message
    }
  }
</script>
