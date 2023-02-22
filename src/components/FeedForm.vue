<template>
    <n-form ref="formRef" :label-width="80" :model="formValue.feedLog" :rules="rules">
        <n-form-item :span="12" label="投喂时间">
            <n-date-picker v-model:value="formValue.feedLog.feed_time" type="datetime" placeholder="选择投喂时间" />
        </n-form-item>
        <n-form-item label="投喂的猫猫" :span="5">
            <n-select v-model:value="formValue.feedLog.cat_uid" placeholder="选择一只猫猫" :options="whichCat"
                :default-value="formValue.feedLog.cat_uid" />
        </n-form-item>
        <n-form-item label="投喂的食物" :span="5">
            <n-select v-model:value="formValue.feedLog.food_uid" placeholder="选择食物" :options="whichFood" />
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

type FormValue = {
    feedLog: {
        feed_time: number;
        food_uid: Value | undefined;
        cat_uid: Value | undefined;
        feed_uid: string;
    };
};

const formValue = ref<FormValue>({
    feedLog: {
        food_uid: undefined,
        feed_time: new Date().getTime(),
        cat_uid: undefined,
        feed_uid: '',
    },
});

const rules = {
    feedLog: {
        food_uid: {
            required: true,
        },
        feed_time: {
            required: true,
        },
        cat_uid: {
            required: true,
        },
    },
};

const whichCat = ref<SelectMixedOption[]>([]);
const whichFood = ref<SelectMixedOption[]>([]);

</script>

<script setup lang="ts">
import { ref } from 'vue';
import { NIcon, NForm, NFormItem, NInput, NButton, NSelect, NDatePicker } from 'naive-ui';
import type { Value, ValueAtom } from 'naive-ui/es/select/src/interface';
import { onMounted } from 'vue';
import Checkmark28Filled from '@vicons/fluent/Checkmark28Filled'
import { query } from './Table.vue';
import { closeDrawer } from './Main.vue';
import { queryCatInfo, queryFood, createFeedLog, updateFeedLog } from '../mysql/SqlConnectInterface'
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';

let isEdit = false;
const props = defineProps(['msg']);

onMounted(
    () => {
        whichCat.value = [];
        whichFood.value = [];
        queryCatInfo().then(res => {
            [...res].forEach(it => {
                whichCat.value.push(
                    {
                        value: it['cat_uid'],
                        label: it['cat_name'],
                    }
                )
            })
        });
        queryFood().then(res => {
            [...res].forEach(it => {
                whichFood.value.push(
                    {
                        value: it['food_uid'],
                        label: it['food_name'],
                    }
                )
            })
        });
        if (props.msg !== undefined) {
            isEdit = true;
            formValue.value.feedLog = {
                feed_time: new Date(`${props.msg['feed_time']}`).getTime(),
                food_uid: `${props.msg['food_uid']}`,
                cat_uid: `${props.msg['cat_uid']}`,
                feed_uid: `${props.msg['feed_uid']}`,
            }
        } else {
            isEdit = false;
            formValue.value.feedLog = {
                food_uid: undefined,
                feed_time: new Date().getTime(),
                cat_uid: undefined,
                feed_uid: '',
            };
        }
    }
)


const submit = function () {
    if (isEdit) {
        updateFeedLog(formValue.value.feedLog.cat_uid,
            formValue.value.feedLog.food_uid,
            formValue.value.feedLog.feed_time,
            formValue.value.feedLog.feed_uid);
    } else {
        createFeedLog(formValue.value.feedLog.cat_uid,
            formValue.value.feedLog.food_uid,
            formValue.value.feedLog.feed_time);
    }
    closeDrawer();
    query("feedLog");
}




</script>


<style>
.olmap {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>