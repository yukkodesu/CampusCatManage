<template>
    <div class="main-root-container">
        <n-layout-header bordered>
            <div class="main-header">
                <n-gradient-text class="title" :size="18" type="success">
                    校园猫猫管理平台
                </n-gradient-text>
            </div>
        </n-layout-header>
        <div class="main-content-container">
            <n-layout has-sider position="absolute">
                <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
                    show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                    <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64"
                        :collapsed-icon-size="22" :options="menuOptions" />
                </n-layout-sider>
                <n-layout>
                    <div class="main-table-button">
                        <n-button @click="activateDrawer">
                            <n-icon>
                                <Add24Filled />
                            </n-icon>
                            添加
                        </n-button>
                        <n-input class="main-search-input" v-model:value="searchVal" type="text" placeholder="搜索" />
                    </div>
                    <TableVue class="main-data-table" :msg="activeKey" />
                </n-layout>
            </n-layout>
        </div>
    </div>
    <n-drawer v-model:show="showDrawer" :width="502" :placement="drawerPlacement">
        <n-drawer-content :title="drawerTitle">
            <CatInfoForm v-if="activeKey === 'catInfo'" :msg="catInfoMsg" />
            <AppearForm v-if="activeKey === 'appearLog'" :msg="appearLogMsg" />
            <FeedForm v-if="activeKey === 'feedLog'" :msg="feedLogMsg" />
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import { h, ref, Component, watch } from 'vue'
import { NDrawer, NDrawerContent, NInput, NButton, NIcon, NGradientText, NLayout, NMenu, NLayoutSider, NLayoutHeader } from 'naive-ui'
import AnimalCat28Regular from '@vicons/fluent/AnimalCat28Regular'
import Location28Regular from '@vicons/fluent/Location28Regular'
import Add24Filled from '@vicons/fluent/Add24Filled'
import FoodPizza24Regular from '@vicons/fluent/FoodPizza24Regular'
import TableVue from './Table.vue'
import type { MenuOption, DrawerPlacement } from 'naive-ui'
import CatInfoForm from './CatInfoForm.vue'
import AppearForm from './AppearForm.vue'
import type { CatInfo } from 'src/dataobj/catInfo'
import type { AppearLog } from 'src/dataobj/appearLog'
import type { FeedLog } from 'src/dataobj/feedLog'
import FeedForm from './FeedForm.vue'
</script>


<script lang="ts">
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    {
        label: '猫猫信息',
        key: 'catInfo',
        icon: renderIcon(AnimalCat28Regular),
    },
    {
        label: '猫猫出现打卡',
        key: 'appearLog',
        icon: renderIcon(Location28Regular)
    },
    {
        label: '投喂记录',
        key: 'feedLog',
        icon: renderIcon(FoodPizza24Regular)
    },
]

const activeKey = ref<string>("catInfo");
const collapsed = ref(true);
const searchVal = ref("");
const showDrawer = ref(false);
const drawerPlacement = ref<DrawerPlacement>("right");
const drawerTitle = ref("猫猫信息管理");

watch(activeKey, () => {
    switch (activeKey.value) {
        case "catInfo":
            drawerTitle.value = "猫猫信息管理"
            break;
        case "appearLog":
            drawerTitle.value = "出现位置打卡"
            break;
        case "feedLog":
            drawerTitle.value = "投喂登记"
            break;
        default:
            drawerTitle.value = "猫猫信息管理"
            break;
    }
})

const activateDrawer = function () {
    showDrawer.value = true;
    setCatInfoMsg(undefined);
    setAppearLogMsg(undefined);
    setFeedLogMsg(undefined);
}

const closeDrawer = () => {
    showDrawer.value = false;
}

const catInfoMsg = ref<CatInfo | undefined>(undefined);
const appearLogMsg = ref<AppearLog | undefined>(undefined);
const feedLogMsg = ref<FeedLog | undefined>(undefined);

const setCatInfoMsg = function (catinfo: CatInfo | undefined) {
    catInfoMsg.value = catinfo;
}


const setAppearLogMsg = function (appearLogInfo: AppearLog | undefined) {
    appearLogMsg.value = appearLogInfo;
}

const setFeedLogMsg = function (feedLogInfo: FeedLog | undefined) {
    feedLogMsg.value = feedLogInfo;
}


export { activateDrawer, setCatInfoMsg, setAppearLogMsg, setFeedLogMsg, closeDrawer };
</script>


<style>
.main-root-container {
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
}

.main-header {
    display: flex;
    padding: .8rem 2rem;

}

.main-content-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.main-table-button {
    padding: .5rem 1rem;
    display: flex;
    gap: 2rem
}

.main-search-input {
    max-width: 12rem;
}
</style>
