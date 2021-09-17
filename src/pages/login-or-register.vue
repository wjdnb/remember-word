<template>
  <span>email</span><input type="text" v-model="email" />
  <p>__</p>
  <span>password</span><input type="password" v-model="password" />
  <button @click="register">register</button>
  <button @click="signIn">login</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getDoc, setDoc, doc } from "firebase/firestore/lite";
import { useRouter } from "vue-router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app, db } from "../firebase/init";

const email = ref("");
const password = ref("");
const router = useRouter();

const register = async () => {
  const auth = getAuth(app);
  try {
    const userInfo = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const userId = userInfo?.user?.uid;

    if (userId) {
      await setDoc(doc(db, "user", userId), {
        email: email.value,
        words: [
          { en: "cancel", zh: "取消, 撤销", example: "cancel here" },
          { en: "explosive", zh: "爆炸", example: "explosive here" },
          { en: "numerous", zh: "众多的", example: "numberous here" },
        ],
      });

      router.push("/");
    }
  } catch (err: unknown) {
    console.log(err?.message);
  }
};

const signIn = async () => {
  const auth = getAuth(app);
  try {
    const userInfo = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const userId = userInfo?.user?.uid;

    const data = await getDoc(doc(db, "user", userId));

    if (data.exists()) {
      console.log(data.data());
    }
  } catch (err: unknown) {
    console.log(err?.message);
  }
};
</script>
