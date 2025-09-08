

<template>
  {{ resizing }}

  <div class="w-full h-full overflow-auto relative" :class="{ 'resizing': resizing }">
    <div
      v-for="item in items"
      :key="item.id"
      class="p-2 flex items-center justify-center"
      :class="{ 'absolute left-0 to-0': absolute, }"
      :style="{
        transform: absolute ? `translate(${item.x}px, ${item.y}px)` : undefined,
        width: `${item.w}px`,
        height: `${item.h}px`,
        backgroundColor: item.color,
        overflow: route.query.overflow as string,
      }">
      <template v-if="route.query.content === 'text'">
        {{ item.content }}
      </template>
      <template v-else-if="route.query.content === 'image'">
        <div class="w-full h-full">
          <img src="./assets/vue.svg" class="w-full h-full object-contain">
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toReactive, useEventListener, useWindowSize } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import { Random } from 'mockjs'
import { useRoute } from 'vue-router'

interface Item {
  id: string
  x: number
  y: number
  w: number
  h: number
  color: string
  content: string
}
const items = ref<Item[]>([])
const windowSize = toReactive(useWindowSize())
const route = useRoute()
const count = computed(() => Number(route.query.count) ?? 1000)
const absolute = computed(() => route.query.absolute === '1')
const resizing = ref(false);
let timer: number

useEventListener(window.visualViewport, 'resize', () => {
  resizing.value = true;
  clearTimeout(timer)
  timer = setTimeout(() => {
    resizing.value = false;
  }, 300)
})

function init() {
  let maxX: number = 0
  let maxY: number = 0

  for (let i = 0;i < count.value;i++) {
    const width = Random.integer(100, 300)
    const height = Random.integer(100, 300)

    let x: number = maxX, y: number = maxY
    if (x + width > windowSize.width) {
      x = 0
      maxX = 0
    }

    items.value.push({
      id: nanoid(10),
      x,
      y,
      w: width,
      h: height,
      content: Random.paragraph(10),
      color: Random.color(),
    })

    if (maxX === 0 && i > 0) {
      maxY = Math.max(maxY, maxY + height)
    }
    maxX += width

    
  }
}

watch(count, init)
</script>



<style scoped>
.resizing * {
  @apply !overflow-hidden;
}
</style>
