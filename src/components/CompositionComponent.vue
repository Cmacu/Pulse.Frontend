<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from '@vue/composition-api'

interface Todo {
  id: number
  content: string
}

interface Meta {
  totalCount: number
}

function useClickCount() {
  const clickCount = ref(0)
  function increment() {
    clickCount.value += 1
    return clickCount.value
  }

  return { clickCount, increment }
}

function useDisplayTodo(todos: Todo[]) {
  const todoCount = computed(() => todos.length)
  return { todoCount }
}

export default defineComponent({
  name: 'CompositionComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    todos: {
      type: (Array as unknown) as PropType<Todo[]>,
      default: () => [],
    },
    meta: {
      type: (Object as unknown) as PropType<Meta>,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  setup({ todos }) {
    return { ...useClickCount(), ...useDisplayTodo(todos) }
  },
})
</script>
