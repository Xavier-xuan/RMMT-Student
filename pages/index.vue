<template>
  <Tutorial/>
</template>

<script>
export default {
  name: 'IndexPage',
  beforeRouteEnter(to, from, next) {
    next("/guide")
  }
}
</script>
