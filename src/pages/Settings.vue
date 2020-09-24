<template>
  <q-page class="flex flex-center">
    <div class="page-container row q-pa-sm q-gutter-sm">
      <base-card
        :icon="settingsButton.icon"
        :title="settingsButton.label"
        subtitle="Preferences"
        :loading="settings.loading"
      >
        <template slot="extra">
          <base-btn v-bind="settingsHelp" flat round />
        </template>
        <q-list padding>
          <q-item-label header>Interface</q-item-label>
          <!-- Dark Mode -->
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label class="text-accent">Enable Dark Mode</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                color="accent"
                :value="settings.isDark"
                :val="true"
                @input="updateDarkMode"
              />
            </q-item-section>
          </q-item>
          <!-- Floating Action Button -->
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label class="text-accent"
                >Enable FAB (Floating Action Button)</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle
                color="accent"
                :value="settings.showFab"
                :val="true"
                @input="updateShowFab"
              />
            </q-item-section>
          </q-item>
          <!-- Timeout Animation -->
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label class="text-accent"
                >Enable Timeout Animation</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle
                color="accent"
                :value="settings.enableClock"
                :val="true"
                @input="updateAnimateClock"
              />
            </q-item-section>
          </q-item>
          <q-item-label header>Matchmaker</q-item-label>
          <!-- Timeout Setting -->
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label class="text-accent">
                Find Match Timeout ({{ settings.matchmakerTimeout }} minutes)
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-slider
                :value="settings.matchmakerTimeout"
                :min="1"
                :max="60"
                label
                @change="updateTimeout"
                color="accent"
              />
            </q-item-section>
            <q-item-section side>
              <q-icon color="accent" name="hourglass_full" />
            </q-item-section>
          </q-item>
          <!-- Email notifications -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-accent"
                >Email Notifications</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle
                color="accent"
                :value="enableEmailNotifications"
                :val="true"
                @input="setEmailNotifications"
              />
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label class="text-accent"
                >Pour me a beer on Match Found</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-toggle
                color="accent"
                :value="settings.enableSound"
                :val="true"
                @input="updateSound"
              />
            </q-item-section>
          </q-item>
          <q-item-label header>Account</q-item-label>
          <!-- Country Flag -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-accent">Country</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-select
                :value="country"
                @input="updateCountryFlag"
                :options="countryOptions"
                option-value="code"
                option-label="name"
                behavior="dialog"
                color="accent"
                use-chips
                borderless
                style="width: 100%; min-width: 50px;"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <!-- Gravatar -->
          <q-item>
            <q-item-section side>
              <q-item-label class="text-accent">Update Gravatar</q-item-label>
            </q-item-section>
            <q-item-section>
              <a href="https://en.gravatar.com/support/" target="_blank">
                <q-icon name="help_outline" size="24px" />
              </a>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                color="accent"
                :value="settings.enableGravatar"
                :val="true"
                @input="updateGravatar"
              />
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple to="/logout">
            <q-item-section>
              <q-item-label class="text-negative">Logout</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn icon="exit_to_app" color="negative" to="/logout" flat />
            </q-item-section>
          </q-item>
          <!-- Version -->
          <q-item-label header class="text-right"
            >version: {{ version }}</q-item-label
          >
        </q-list>
      </base-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'
import store from '../store'
import { version } from '../../package.json'
import { getName, getData } from 'country-list'
import { CountryCode } from '../store/modules/settings'
import api from '../utils/api'

export default defineComponent({
  name: 'PlayerSettings',
  setup() {
    onMounted(async () => {
      enableEmailNotifications.value = (
        await api.getSettings()
      ).data.emailNotifications
    })

    const countryList: CountryCode[] = getData()
    const countryOptions = ref(countryList)
    const enableConfetti = ref(false)
    const enableEmailNotifications = ref(true)
    const setEmailNotifications = async (value: boolean) => {
      await api.setEmailNotifications(value)
      enableEmailNotifications.value = value
    }
    const countryFilterFn = (val: string, update: Function) => {
      update(() => {
        const needle = val.toLocaleLowerCase()
        const options = countryList.filter((country) =>
          country.name.toLocaleLowerCase().includes(needle),
        )
        countryOptions.value.splice(0, countryOptions.value.length, ...options)
      })
    }

    return {
      version,
      enableConfetti,
      country: computed(() => getName(store.state.player.country || '')),
      countryOptions,
      countryFilterFn,
      settings: computed(() => store.state.settings),
      settingsButton: computed(() => store.state.config.buttons.settings),
      settingsHelp: computed(() => store.state.config.buttons.settingsHelp),
      ...store.dispatch.settings,
      enableEmailNotifications,
      setEmailNotifications,
    }
  },
})
</script>
