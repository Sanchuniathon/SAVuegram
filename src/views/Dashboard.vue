<template>
  <div id="dashboard">
    <Board></Board>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import Board from '@/components/Board'

export default {
  components: {
    Board
  },
}
</script>

<style lang="scss" scoped>

</style>
