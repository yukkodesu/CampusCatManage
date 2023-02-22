<script lang="ts">
import { FormValidationStatus } from 'naive-ui/es/form/src/interface';
import { postLogin, createErrPopup, createAccPopup, closePopup } from '../App.vue'
import { userLogin, userSignUp } from '../mysql/SqlConnectInterface'
const username = ref("");
const passwd = ref("");
const repeatPasswd = ref("");
const isPasswordSame = ref<FormValidationStatus>("success");


const clear = function () {
    username.value = '';
    passwd.value = '';
    repeatPasswd.value = '';
}

const login = function () {
    userLogin(username.value, passwd.value).then(
        res => {
            if (res === true) {
                console.log(`${username.value} has login`);
                closePopup();
                postLogin();
            }
            else createErrPopup("用户名或密码错误");
        }
    )
}

const signUp = function () {
    userSignUp(username.value, passwd.value).then(
        res => {
            closePopup();
            console.log(res);
            createAccPopup("注册成功");
        }
    ).catch(err => {
        console.error(err);
        createErrPopup("用户已存在，无法重复创建");
    })
}


const checkIsPasswdSame = function () {
    isPasswordSame.value = passwd.value === repeatPasswd.value ? 'success' : 'error';
}



export { username, passwd };
</script>

<script setup lang="ts">
import { NInput, useThemeVars, NCard, NButton, NTabs, NForm, NTabPane, NFormItemRow, NGradientText } from 'naive-ui'
import { ref } from 'vue'
import AnimalCat28Regular from '@vicons/fluent/AnimalCat28Regular'
import { Icon } from '@vicons/utils'
const mainColor = ref(useThemeVars().value.primaryColor);

</script>


<template>
    <div class="login-main">
        <div class="login-card-container">
            <n-card>
                <div class="login-card-content-container">
                    <div class="login-left">
                        <n-gradient-text class="title" :size="22" type="success">
                            校园猫猫管理平台
                        </n-gradient-text>
                        <Icon size="10rem" :color="mainColor">
                            <AnimalCat28Regular />
                        </Icon>
                    </div>
                    <div class="login-right">

                        <n-tabs class="card-tabs" default-value="signin" size="large" animated style="margin: 0 -4px"
                            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                            :on-update-value="clear">
                            <n-tab-pane name="signin" tab="登录">
                                <n-form>
                                    <n-form-item-row label="用户名">
                                        <n-input v-model:value="username" placeholder="someone" />
                                    </n-form-item-row>
                                    <n-form-item-row label="密码">
                                        <n-input type="password" show-password-on="mousedown" v-model:value="passwd"
                                            placeholder="password" />
                                    </n-form-item-row>
                                </n-form>
                                <n-button type="primary" block secondary strong @click="login">
                                    登录
                                </n-button>
                            </n-tab-pane>
                            <n-tab-pane name="signup" tab="注册">
                                <n-form>
                                    <n-form-item-row label="用户名">
                                        <n-input v-model:value="username" placeholder="someone" />
                                    </n-form-item-row>
                                    <n-form-item-row label="密码">
                                        <n-input type="password" show-password-on="mousedown" v-model:value="passwd"
                                            placeholder="password" />
                                    </n-form-item-row>
                                    <n-form-item-row label="重复密码">
                                        <n-input type="password" :status="isPasswordSame" v-model:value="repeatPasswd"
                                            placeholder="repeat password" @input="checkIsPasswdSame" />
                                    </n-form-item-row>
                                </n-form>
                                <n-button type="primary" block secondary strong @click="signUp">
                                    注册
                                </n-button>
                            </n-tab-pane>
                        </n-tabs>
                    </div>
                </div>
            </n-card>
        </div>
    </div>
</template>

<style>
.login-main {
    display: grid;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
}

.login-card-container {
    width: 70vw;
    max-width: 44rem;
    min-width: 18rem;
}

.login-card-content-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    column-gap: 2rem;
}

.login-left {
    display: grid;
    align-items: center;
    justify-items: center;
}

.login-right {
    /* margin-left: 2rem; */
    min-width: 12rem;
}
</style>
