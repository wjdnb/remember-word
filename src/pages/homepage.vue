<template>
  <div class="wrapper">
    <button @click="$router.push('/console')">to console</button>
    <header>
      <div class="name">Remember Words</div>
      <ul v-if="words">
        <li @click="isChineseVisible = !isChineseVisible">
          中文提示: {{ isChineseVisible ? "开" : "关" }}
        </li>
        <li @click="isEnglishVisible = !isEnglishVisible">
          英文提示: {{ isEnglishVisible ? "开" : "关" }}
        </li>
        <li @click="handleOrderModeChange">
          单词排序: {{ orderMode === "order" ? "顺序" : "乱序" }}
        </li>
        <li @click="handlePronunciationChange">
          发音: {{ pronunciationMode === "American" ? "美音" : "英音" }}
        </li>
      </ul>

      <ul v-else>
        <li><router-link to="/login-or-register">登录</router-link></li>
        <li><router-link to="/login-or-register">注册</router-link></li>
      </ul>
    </header>
    <section v-if="currentWord">
      <div class="word">
        <span
          v-for="(item, index) in currentWordSplit"
          :key="index"
          class="word-split"
        >
          <div
            :class="{
              'input-success': wordEntered[index],
              'input-error': wordEntered[index] === '!',
              'input-hide': !isEnglishVisible && !wordEntered[index],
            }"
          >
            {{ item }}
          </div>
          <div
            :class="[
              !isEnglishVisible && !wordEntered[index]
                ? 'input-border'
                : 'input-hide',
            ]"
          >
            _
          </div>
        </span>
      </div>
      <button @click="handleVoice">voice</button>
      <div v-if="isChineseVisible" class="zh-tips">
        {{ currentWord.zh }}
      </div>
      <div v-if="isEnglishVisible" class="en-tips">
        {{ currentWord.eg }}
      </div>
      <audio id="keydown">
        <source src="../assets/sound/keydown.wav" />
      </audio>
      <audio id="success">
        <source src="../assets/sound/success.wav" />
      </audio>
      <audio id="error">
        <source src="../assets/sound/error.wav" />
      </audio>
      <audio id="word" :key="currentWord.audioLink">
        <source :src="currentWord.audioLink" />
      </audio>
    </section>
    <section v-else>
      <button @click="$router.push('/console')">Add some words first</button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { unref, ref, computed, toRefs, onMounted, onUnmounted } from "vue";
import type { Word, WordWithAudio, UserSettings } from "../type/type";
import { useStorage } from "../utils/function";

const defaultSettings = ref<UserSettings>({
  orderMode: "order",
  isChineseVisible: true,
  isEnglishVisible: true,
  pronunciationMode: "American",
});

const userSettings = ref({});

const settings = computed(() =>
  Object.assign({}, defaultSettings.value, userSettings.value)
);

const { orderMode, isChineseVisible, isEnglishVisible, pronunciationMode } =
  toRefs(settings.value);

const words = ref<Word[] | null>(null);

onMounted(() => {
  console.log("enter");
  window.addEventListener("keyup", handleKeyup);

  getWords();
});

onUnmounted(() => {
  window.removeEventListener("keyup", handleKeyup);
  console.log("remove success");
});

const getWords = () => {
  words.value = useStorage("words");
};

// 当前单词
const currentWord = computed(() => {
  if (words.value) {
    const word = unref(words.value[currentIndex.value] as WordWithAudio);
    word.audioLink = generateAudioLink(word.en);
    return word;
  }

  return null;
});

// 当前单词索引
const currentIndex = ref(0);

// 当前单词 按字母拆分
const currentWordSplit = computed(() => {
  if (currentWord.value) {
    return currentWord.value.en.split("");
  }

  return null;
});

// 已经输入的单字
const wordEntered = ref<string[]>([]);

const timer = ref<unknown>(null);

const orderStrategy = {
  order: (list: Word[]) => {
    return unref(list);
  },
  random: (list: Word[]) => {
    let arr = unref(list);

    const swap = (i: number, j: number, arr: Word[]) => {
      let temp = null;
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    };
    // shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      swap(i, Math.floor(Math.random() * arr.length), arr);
    }
    return arr;
  },
};

const handleOrderStrategy = () => {
  switch (orderMode.value) {
    case "order":
      return orderStrategy.order(words.value as Word[]);
    case "random":
      return orderStrategy.random(words.value as Word[]);
  }
};

const handleOrderModeChange = () => {
  orderMode.value === "order"
    ? (orderMode.value = "random")
    : (orderMode.value = "order");

  currentIndex.value = 0;

  handleOrderStrategy();
};

const inputStrategy = {
  success: (val: string) => {
    handleAudioPlay("keydown");
    wordEntered.value.push(val);
  },
  error: () => {
    handleAudioPlay("error");
    wordEntered.value.push("!");
    if (timer.value) timer.value = null;
    timer.value = setTimeout(() => {
      wordEntered.value = [];
    }, 200);
  },
  // 单个单词完成
  wordCompleted: () => {
    handleAudioPlay("success");
    currentIndex.value++;
    wordEntered.value = [];
  },
  // 完成一轮
  missionCompleted: () => {
    handleAudioPlay("success");
    // 随机在一轮过后会重新roll
    // TODO 有可能单词会连续出现两次
    if (orderMode.value === "random") {
      handleOrderStrategy();
    }

    wordEntered.value = [];
    currentIndex.value = 0;
  },
};

const handleKeyup = (e) => {
  // TODO
  // 通过 code 值判断，因为功能键的 key 值为 string

  const reg = /[a-zA-Z]/g;
  if (!currentWordSplit.value || !currentWord.value || !words.value) return;
  console.log("keyup");
  const word = currentWord.value?.en;
  const currentInput = e.key;
  const alreadyEntered = wordEntered.value.join("");

  const validateWord = alreadyEntered + currentInput;

  if (!reg.test(validateWord)) {
    // 必须是字母
    return;
  } else if (
    currentWordSplit.value[validateWord.length - 1] === currentInput &&
    word.includes(validateWord) &&
    word === validateWord
  ) {
    if (currentIndex.value === words.value.length - 1) {
      inputStrategy.missionCompleted();
    } else {
      inputStrategy.wordCompleted();
    }
  } else if (
    currentWordSplit.value[validateWord.length - 1] === currentInput &&
    word.includes(validateWord)
  ) {
    inputStrategy.success(currentInput);
  } else {
    inputStrategy.error();
  }
};

const generateAudioLink = (word: string): string => {
  const audioLink = "http://dict.youdao.com/dictvoice?";
  if (pronunciationMode.value === "American") {
    return `${audioLink}type=0&audio=${word}`;
  } else {
    return `${audioLink}type=1&audio=${word}`;
  }
};

const handlePronunciationChange = () => {
  pronunciationMode.value === "American"
    ? (pronunciationMode.value = "British")
    : (pronunciationMode.value = "American");
};

const handleAudioPlay = (type: string) => {
  const audio = document.querySelector(`#${type}`) as HTMLAudioElement;

  audio.currentTime = 0;
  audio.play();
};

const handleVoice = () => {
  handleAudioPlay("word");
};
</script>

<style>
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.wrapper {
  width: 100vw;
  height: 100vh;
  background: #faf9ff;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 20px;
}

ul {
  display: flex;
}

li {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
}

section {
  text-align: center;
  margin-top: 255px;
}

.word {
  display: flex;
  justify-content: center;
}

.word span {
  margin: 2px;
  font-size: 56px;
  font-weight: 400;
}

.start,
.name {
  font-family: powerline;
  font-size: 24px;
  font-weight: 600;
}

.name {
  cursor: pointer;
}

.input-success {
  color: #8cc7b5;
}

.input-hide {
  display: none;
}

.input-border {
  border: red;
}

.input-error {
  color: #e6444c;
  animation: shake 0.3s ease-in-out;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.zh-tips {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 400;
}

.en-tips {
  margin-top: 10px;
  font-size: 18px;
  font-weight: 400;
}
</style>
