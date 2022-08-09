<template>
  <!-- 放置一个svg的图标 -->
  <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  methods: {
    changeScreen() {
      if (ScreenFull.isEnabled) {
        ScreenFull.toggle()
      }
    }
  }

}
</script>

<style>

</style>
