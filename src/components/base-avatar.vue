<template>
  <q-avatar
    v-bind="attributes"
    v-on="listeners"
    :class="`${glowClass} ${borderClass}`"
  >
    <q-img
      class="avatar-image"
      :class="{
        'rotate-tick': animate,
        'cgeAvatarFix': isCgeImage,
        'cog-border': !noCogBorder,
      }"
      :src="image"
    />
    <q-chip
      v-if="!hideRank && rank.rank"
      :color="rank.color"
      class="absolute-bottom-left text-dark cog-border-1 q-pa-none"
      :class="{ 'rotate-minutes': animate }"
      style="
        margin: 0 0 -15px 25px;
        width: 35px;
        height: 35px;
        font-family: serif;
        font-size: 1rem;
      "
    >
      <div
        class="full-width text-center"
        style="height: 1em; line-height: 1.2em;"
      >
        {{ rank.rank }}
      </div>
    </q-chip>
    <q-badge
      v-if="!hideBadge && rank.badge"
      color="transparent"
      class="absolute-bottom-left text-dark q-pa-none"
      :class="{ 'rotate-seconds': animate }"
      style="margin: 0 0 -15px -15px;"
    >
      <q-icon :name="`img:${rank.badge}`" size="50px" />
    </q-badge>
    <q-badge
      v-if="!hideCountry && country"
      color="transparent"
      class="absolute-top-right text-dark q-pa-none flag-background"
      style="margin: 0px -10px 0px 0px; width: 30px; height: 30px;"
      :style="flagBackground"
    />
    <!-- <q-badge floating color="secondary" class="text-dark">
      {{ division }}
    </q-badge>
    <q-badge color="secondary" class="text-dark">
      {{ level }}
    </q-badge> -->
    <slot></slot>
  </q-avatar>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import store from 'src/store'

export default defineComponent({
  name: 'BaseAvatar',
  props: {
    id: [Number, String],
    avatar: String,
    username: String,
    division: [Number, String],
    level: [Number, String],
    score: [Number, String],
    isWin: Boolean,
    country: String,
    hideRank: Boolean,
    hideBadge: Boolean,
    hideCountry: Boolean,
    addBorder: Boolean,
    noCogBorder: Boolean,
    size: {
      type: String,
      default: '80px',
    },
  },
  setup(props, { attrs, listeners }) {
    const image = computed(() =>
      store.getters.config.getAvatar(props.username || '', props.avatar || ''),
    )

    return {
      glowClass: computed<string>(() => {
        if (props.isWin) return 'glow-win'
        if (props.division == 3 && props.level == 1) return 'glow-1st'
        if (props.division == 3 && props.level == 2) return 'glow-2nd'
        if (props.division == 3 && props.level == 3) return 'glow-3rd'
        return ''
      }),
      borderClass: computed<string>(() =>
        props.addBorder ? 'avatar-border' : '',
      ),
      image,
      flagBackground: computed<string>(
        () =>
          `background-image: url("/flags/${props.country?.toLowerCase()}.svg") !important`,
      ),
      isCgeImage: computed<boolean>(() =>
        image.value.includes('https://account.czechgames.com/images'),
      ),
      rank: computed(() =>
        store.getters.config.getDivision(props.division, props.level),
      ),
      animate: computed(
        () =>
          store.state.settings.enableClock &&
          store.state.matchmaker.showSearching,
      ),
      attributes: computed(() => Object.assign(props, attrs)),
      listeners: computed(() => Object.assign({}, listeners)),
    }
  },
})
</script>

<style lang="sass">
.cgeAvatarFix .q-img__image
  margin-left: -15%;
  margin-top: -20%;
  width: 130%
  height: 130%

.avatar-border .q-avatar__content
  background: white
  border: 10px solid white
body.body--dark
  .avatar-border .q-avatar__content
    background: $dark
    border-color: $dark
.avatar-image
  // background: $grey-4

.flag-background
  background-position: center;
  background-size: fit;
</style>
