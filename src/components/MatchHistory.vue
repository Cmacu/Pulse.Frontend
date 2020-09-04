<template>
  <base-card
    :icon="historyButton.icon"
    :title="title"
    :subtitle="subtitle"
    :loading="loading"
  >
    <template slot="extra">
      <div class="q-gutter">
        <q-toggle v-model="inGameOrder" label="As seated" left-label />
        <base-btn flat round icon="o_launch" :to="historyButton.to" />
      </div>
    </template>
    <q-list class="stripped">
      <q-item v-for="match in matches" :key="match.name" clickable>
        <MatchRow
          :match="match"
          :game-order="inGameOrder"
          :playerId="playerId"
        />
      </q-item>
      <q-item v-if="noResults && !loading">
        <q-item-section class="q-pa-md text-center">
          No results found.
        </q-item-section>
      </q-item>
      <q-item v-else class="flex flex-center">
        <q-pagination
          :value="page"
          :max="totalPages"
          :input="true"
          @input="onPageChange"
        />
      </q-item>
    </q-list>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api'
import store from '../store'
import { MatchInterface } from '../store/modules/stats'
import api from '../utils/api'

export default defineComponent({
  name: 'MatchHistory',
  components: {
    MatchRow: () => import('components/MatchRow.vue'),
  },
  props: {
    title: {
      type: String,
      default: 'Match History',
    },
    subtitle: {
      type: String,
      default: '',
    },
    playerId: {
      type: String,
      required: true,
    },
    opponentId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const loading = ref<boolean>(true)
    const matches = ref<MatchInterface[]>([])
    const page = ref(1)
    const pageSize = computed<number>(
      () => store.state.config.historyConfig.pageSize,
    )
    const totalPages = ref(3)
    const inGameOrder = ref(false)

    const getHistory = async () => {
      loading.value = true
      const skip = (page.value - 1) * pageSize.value
      const response = await api.getMatches(
        props.playerId,
        skip,
        pageSize.value,
        props.opponentId,
      )
      totalPages.value = Math.ceil(
        +response.data.total / (+pageSize.value || 1),
      )
      matches.value = response.data.results
      loading.value = false
    }
    onMounted(getHistory)

    const onPageChange = (newPage: number) => {
      page.value = newPage
      getHistory()
    }

    return {
      loading,
      page,
      totalPages,
      onPageChange,
      inGameOrder,
      matches,
      noResults: computed(() => page.value == 1 && !matches.value.length),
      historyButton: computed(() => store.state.config.buttons.history),
    }
  },
})
</script>
