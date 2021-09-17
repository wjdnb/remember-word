<template>
  <!-- TODO -->
  <!-- curd list -->
  <!-- json 导入 -->

  <button @click="$router.push('/')">back to practice</button>

  <p>_</p>

  en: <input type="text" v-model="en" />
  <p>_</p>
  zh: <input type="text" v-model="zh" />
  <p>_</p>
  eg: <input type="text" v-model="eg" />
  <p>_</p>
  <button @click="saveWord">save in local</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
// import { Word } from "../type/type";
import { useStorage } from "../utils/function";

const zh = ref("");
const en = ref("");
const eg = ref("");

const saveWord = () => {
  console.log("here");
  let storage = useStorage("words") ?? [];
  storage.push({
    zh: zh.value,
    en: en.value,
    eg: eg.value,
  });

  useStorage("words", storage);
};
</script>
