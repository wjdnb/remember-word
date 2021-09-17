<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: inconsolata;
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

@font-face {
  font-family: "powerline";
  src: url("./assets/font/MonofurForPowerline.woff2"); /* IE9 Compat Modes */
  src: url("./assets/font/MonofurForPowerline.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("./assets/font/MonofurForPowerline.woff") format("woff"),
    /* Modern Browsers */ url("./assets/font/MonofurForPowerline.ttf")
      format("truetype"); /* Safari, Android, iOS */
}

@font-face {
  font-family: "inconsolata";
  src: url("./assets/font/Inconsolata-Regular.woff2"); /* IE9 Compat Modes */
  src: url("./assets/font/Inconsolata-Regular.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("./assets/font/Inconsolata-Regular.woff") format("woff"),
    /* Modern Browsers */ url("./assets/font/Inconsolata-Regular.ttf")
      format("truetype"); /* Safari, Android, iOS */
}
</style>
