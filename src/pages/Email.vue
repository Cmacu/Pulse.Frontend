<template>
  <q-card-section class="text-center">
    <p>
      Enter your email to get started
    </p>
    <q-form class="row q-gutter-sm" @submit="submit">
      <q-input
        name="email"
        color="primary"
        v-model="model"
        type="email"
        placeholder="email@domain.com"
        autocomplete="username"
        class="col"
        outlined
        autofocus
        required
      >
        <template v-slot:prepend>
          <q-icon name="email" color="primary" />
        </template>
      </q-input>
      <q-btn
        type="submit"
        icon="games"
        color="primary"
        class="col-auto"
        :loading="loading"
      />
    </q-form>
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import auth from 'src/utils/auth'
import router from '../router'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'EmailPage',
  props: {
    email: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const loading = ref(false)
    const model = ref('')

    onMounted(() => (model.value = props.email))

    const submit = async () => {
      loading.value = true
      const response = await auth.request(model.value)
      if (response.success) {
        return router.push(`/auth/${response.message}?email=${model.value}`)
      }
      loading.value = false
      Notify.create({
        message: response.message,
        color: 'negative',
        icon: 'o_warning',
      })
    }

    return {
      loading,
      model,
      submit,
    }
  },
})
</script>
