<script lang="ts">
import { ref } from 'vue';
import { connectSql } from './mysql/SqlConnectInterface.js';
const isLogin = ref(false);


const isPopupShow = ref(false);
const errMsg = ref("");
const popupType = ref<"default" | "error" | "info" | "success" | "warning" | undefined>(undefined);
const createPopup = (type: "default" | "error" | "info" | "success" | "warning" | undefined, err: string) => {
  if (err != null) {
    errMsg.value = err;
    popupType.value = type;
    isPopupShow.value = true;
  }
};

const createErrPopup = createPopup.bind(undefined, "error");
const createAccPopup = createPopup.bind(undefined, "success");

const closePopup = function () {
  isPopupShow.value = false;
}
const postLogin = function () {
  isLogin.value = true;
}

connectSql(createErrPopup);



export { postLogin, createPopup, createErrPopup, createAccPopup, closePopup };
</script>


<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Login from './components/Login.vue';
import { NLoadingBarProvider, NMessageProvider, NNotificationProvider, NDialogProvider, NAlert } from 'naive-ui';
import Main from './components/Main.vue'

</script>


<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-alert v-if="isPopupShow" title="Message" :type="popupType" closable class="pop-up" @after-leave="closePopup">
            {{ errMsg }}
          </n-alert>
          <Login v-if="!isLogin" />
          <Main v-if="isLogin" />
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<style>
.pop-up {
  position: absolute;
  width: 40vw;
  left: 30vw;
  z-index: 1;
}

.hide {
  display: none;
}
</style>
