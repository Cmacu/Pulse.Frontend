<template>
  <q-card-section class="text-center">
    <p>
      Enter the code we just sent to <strong>{{ email }}</strong>
    </p>
    <q-form class="row q-gutter-sm" @submit="submit">
      <q-input
        name="code"
        color="primary"
        v-model="model"
        placeholder="****"
        class="col"
        outlined
        autofocus
        required
      >
        <template v-slot:prepend>
          <q-icon name="lock" color="primary" />
        </template>
      </q-input>
      <q-btn
        type="submit"
        icon="play_arrow"
        color="primary"
        class="col-auto"
        :loading="loading"
      />
    </q-form>
    <div class="q-mt-md">
      <router-link :to="`/auth/email?email=${email}`" class="text-info"
        >Send new access code</router-link
      >
    </div>
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import auth from 'src/utils/auth'
import { Notify } from 'quasar'
import router from 'src/router'

export default defineComponent({
  name: 'LoginPage',
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
    const model = ref('')

    onMounted(() => authorize(props.email, props.code))

    const authorize = async (email: string, code: string) => {
      if (!email || !code) return
      loading.value = true
      const response = await auth.login(props.email, code)
      if (response.success) return router.push(auth.getRedirectUrl())
      loading.value = false
      Notify.create({
        message: response.message,
        color: 'negative',
        icon: 'o_warning',
      })
    }

    const submit = () => authorize(props.email, model.value)

    return {
      loading,
      model,
      submit,
    }
  },
})
</script>
