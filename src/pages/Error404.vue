<template>
  <div class="fixed-center text-center">
    <p>
      <img src="~assets/sad.svg" style="width: 30vw; max-width: 150px;" />
    </p>
    <p class="text-faded">
      Looks like this is not available, yet... <strong>(404)</strong>
    </p>
    <base-btn color="accent" style="width: 200px;" to="/" label="Go back" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Error404',
}
</script>
