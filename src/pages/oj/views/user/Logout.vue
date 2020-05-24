<template>
</template>

<script>
  import api from '../../api.js'

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
    }
  }
</script>
