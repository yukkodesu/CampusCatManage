<template>
    <n-form ref="formRef" :label-width="80" :model="formValue.catInfo" :rules="rules">
        <n-form-item label="猫猫昵称">
            <n-input v-model:value="formValue.catInfo.cat_name" placeholder="叫什么好" />
        </n-form-item>
        <n-form-item label="猫猫种类">
            <n-input v-model:value="formValue.catInfo.cat_variety" placeholder="什么种类" />
        </n-form-item>
        <n-form-item label="猫猫毛色">
            <n-input v-model:value="formValue.catInfo.cat_color" placeholder="长什么样" />
        </n-form-item>
        <n-form-item label="猫猫性格">
            <n-input v-model:value="formValue.catInfo.cat_temp" placeholder="性格怎么样" />
        </n-form-item>
        <n-form-item>
            <n-button attr-type="button" @click="submit">
                <n-icon>
                    <Checkmark28Filled />
                </n-icon>
                提交
            </n-button>
        </n-form-item>
    </n-form>
</template>

<script lang="ts">
import { onMounted } from "vue";
import { createCatInfo, updateCatInfo } from "../mysql/SqlConnectInterface.js";

let isEdit: boolean = false;

const formValue = ref({
    catInfo: {
        cat_name: "",
        cat_variety: "",
        cat_color: "",
        cat_temp: "",
    },
});

const rules = {
    catInfo: {
        cat_name: {
            required: true,
            trigger: "blur",
        },
        cat_variety: {
            required: true,
            trigger: "blur",
        },
        cat_color: {
            required: true,
            trigger: "blur",
        },
        cat_temp: {
            required: true,
            trigger: "blur",
        },
    },
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { NIcon, NForm, NFormItem, NInput, NButton } from "naive-ui";
import Checkmark28Filled from "@vicons/fluent/Checkmark28Filled";
import { query } from './Table.vue'
import { closeDrawer } from './Main.vue'
const props = defineProps(["msg"]);

const submit = function () {
    if (isEdit) {
        updateCatInfo(
            `${props.msg["cat_uid"]}`,
            formValue.value.catInfo.cat_name,
            formValue.value.catInfo.cat_variety,
            formValue.value.catInfo.cat_color,
            formValue.value.catInfo.cat_temp,
        ).then(() => { query("catInfo"); closeDrawer(); });
    } else {
        createCatInfo(
            formValue.value.catInfo.cat_name,
            formValue.value.catInfo.cat_variety,
            formValue.value.catInfo.cat_color,
            formValue.value.catInfo.cat_temp,
        ).then(() => { query("catInfo"); closeDrawer(); });
    }

};

onMounted(() => {
    if (props.msg !== undefined) {
        isEdit = true;
        formValue.value.catInfo = {
            cat_name: `${props.msg["cat_name"]}`,
            cat_variety: `${props.msg["cat_variety"]}`,
            cat_color: `${props.msg["cat_color"]}`,
            cat_temp: `${props.msg["cat_temp"]}`,
        };
    } else {
        isEdit = false;
        formValue.value.catInfo = {
            cat_name: "",
            cat_variety: "",
            cat_color: "",
            cat_temp: "",
        };
    }
});
</script>
