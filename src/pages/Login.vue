<template>
  <q-page class="flex flex-center">
    <q-spinner-dots v-if="loading" size="10em" color="primary" />
    <div
      v-else
      class="row q-pa-sm q-gutter-sm"
      style="max-width: 800px; width: 100%;"
    >
      <base-card
        icon="o_lock"
        title="Welcome to the Pulse"
        subtitle="To get started:"
        :loading="loading"
      >
        <template slot="extra">
          <base-btn
            flat
            round
            icon="help_outline"
            to="https://pulsegames.io/faq.html#about-the-profile"
          />
        </template>
        <q-card-section>
          <ol>
            <li class="q-pa-sm">
              Click the button below to log in to your CGE account
            </li>
            <li class="q-pa-sm">
              Accept the prompt to link your account with TTA Pulse
            </li>
            <li class="q-pa-sm">
              Explore the Pulse App and find your first opponent
            </li>
            <li class="q-pa-sm">
              In case you have trouble logging in, please copy and paste this in
              your browser:<br />
              https://account.czechgames.com/oauth/login?client_id=APP-1465392902
            </li>
          </ol>
          <div>
            <a
              href="https://account.czechgames.com/oauth/login?client_id=APP-1465392902"
              style="text-decoration: none;"
            >
              <base-btn
                icon="lock_open"
                label="Login"
                color="primary"
                size="lg"
                class="full-width"
                :loading="loading"
              />
            </a>
          </div>
        </q-card-section>
      </base-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import auth from 'src/utils/auth'
import router from '../router'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'LoginPage',
  setup(props, { root }) {
    const loading = ref(true)

    const submit = async (token: string, refreshToken: string) => {
      loading.value = true
      const response = await auth.login(token, refreshToken)
      if (!response.success) {
        loading.value = false
        return Notify.create({
          message: response.message,
          color: 'negative',
          icon: 'o_warning',
        })
      }
      router.push(auth.getRedirectUrl() || '/')
    }

    const getToken = () => root.$route.query.token?.toString() || ''
    const getRefresh = () => root.$route.query.refresh_token?.toString() || ''

    onMounted(async () => {
      const token = getToken()
      const refresh = getRefresh()
      if (token && refresh) {
        await submit(token, refresh)
        return
      }
      const urlMessage = root.$route.query.message?.toString() || ''
      if (urlMessage) {
        Notify.create({
          message: urlMessage,
          color: 'negative',
          icon: 'o_warning',
        })
      }
      loading.value = false
    })

    return {
      loading,
    }
  },
})
</script>

<style lang="sass" scoped></style>
