

<template>
  <div class="w-full h-full overflow-auto relative">
    <div
      v-for="item in items"
      :key="item.id"
      class="absolute left-0 top-0 p-2 flex items-center justify-center overflow-auto"
      :style="{
        transform: `translate(${item.x}px, ${item.y}px)`,
        width: `${item.w}px`,
        height: `${item.h}px`,
        backgroundColor: item.color
      }">
      {{ item.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { toReactive, useWindowSize } from '@vueuse/core'
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

function init() {
  let maxX: number = 0
  let maxY: number = 0
  let lineMaxY: number = 0


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
      content: Random.paragraph(5, 15),
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


