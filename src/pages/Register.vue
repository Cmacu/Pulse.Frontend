<template>
  <q-card-section class="text-center">
    <q-form class="q-gutter-md" @submit="submit">
      <p>
        Your username (what other players see)
      </p>
      <q-input
        name="username"
        color="primary"
        v-model="username"
        placeholder="username"
        autocomplete="username"
        :error="!!usernameError"
        :error-message="usernameError"
        outlined
        required
      >
        <template v-slot:prepend>
          <q-icon name="perm_identity" color="primary" />
        </template>
      </q-input>
      <p>
        Enter the code we just sent to <strong>{{ email }}</strong>
      </p>
      <q-input
        name="code"
        color="primary"
        v-model="accessCode"
        placeholder="****"
        autocomplete="password"
        :error="!!codeError"
        :error-message="codeError"
        autofocus
        outlined
        required
      >
        <template v-slot:prepend>
          <q-icon name="o_lock" color="primary" />
        </template>
      </q-input>
      <div>
        <q-btn
          type="submit"
          label="Play"
          icon="play_arrow"
          color="primary"
          class="full-width q-my-md"
          :loading="loading"
        />
      </div>
    </q-form>
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import auth from 'src/utils/auth'
import router from 'src/router'
import api from 'src/utils/api'

export default defineComponent({
  name: 'RegisterPage',
  props: {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const loading = ref(false)
    const username = ref('')
    const usernameError = ref<string>('')
    const accessCode = ref('')
    const codeError = ref<string>('')
    const pageLoading = ref(true)

    onMounted(() => {
      username.value = props.email.split('@')[0]
    })
    const submit = async () => {
      usernameError.value = ''
    codeError.value = ''

      loading.value = true
      const checkResponse = await api.checkUsername(username.value)
      console.error(checkResponse)
      if (checkResponse.data) {
        usernameError.value = 'Username is taken. Try a different one'
        loading.value = false
        return false
      }
      const response = await auth.register(
        props.email,
        accessCode.value,
        username.value,
      )
      if (response.success) return router.push(auth.getRedirectUrl())
      codeError.value = response.message ?? 'Invalid access code'
      loading.value = false
    }

    return {
      pageLoading,
      loading,
      accessCode,
      codeError,
      username,
      usernameError,
      submit,
    }
  },
})
</script>
