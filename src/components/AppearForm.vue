<template>
    <n-form ref="formRef" :label-width="80" :model="formValue.appearLog" :rules="rules">
        <n-form-item :span="12" label="点击地图选择出现位置" path="datetimeValue">
            <div class="olmap">
                <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true"
                    style="height:240px; width:460px" @singleclick="onMapClick">
                    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

                    <ol-tile-layer>
                        <ol-source-osm />
                    </ol-tile-layer>
                    <ol-vector-layer>
                        <ol-source-cluster :distance="40">

                            <ol-source-vector>
                                <ol-feature>
                                    <ol-geom-point :coordinates="markerCoods"></ol-geom-point>
                                </ol-feature>
                            </ol-source-vector>

                        </ol-source-cluster>
                        <ol-style>
                            <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                            <ol-style-icon :src="markerIcon" :scale="0.05" :anchor="[0.5, 1]"></ol-style-icon>
                        </ol-style>
                    </ol-vector-layer>
                </ol-map>
            </div>
        </n-form-item>
        <n-form-item label="出现位置">
            <n-input :disabled="true" v-model:value="formValue.appearLog.appear_location" placeholder="" />
        </n-form-item>
        <n-form-item :span="12" label="出现时间">
            <n-date-picker v-model:value="formValue.appearLog.appear_time" type="datetime" placeholder="选择出现时间" />
        </n-form-item>
        <n-form-item label="出现的猫猫" :span="5">
            <n-select v-model:value="formValue.appearLog.cat_uid" placeholder="选择一只猫猫" :options="whichCat"
                :default-value="formValue.appearLog.cat_uid" />
        </n-form-item>
        <n-form-item label="出现的校区" :span="5">
            <n-select v-model:value="formValue.appearLog.college_id" placeholder="选择大学城校区" :options="whichCollege" />
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
    appearLog: {
        appear_location: string;
        college_id: Value | null;
        appear_time: number;
        cat_uid: Value | null;
        appear_log: string;
    };
};

const formValue = ref<FormValue>({
    appearLog: {
        appear_location: '',
        college_id: null,
        appear_time: new Date().getTime(),
        cat_uid: null,
        appear_log: '',
    },
});

const rules = {
    appearLog: {
        appear_location: {
            required: true,
        },
        college_id: {
            required: true,
        },
        appear_time: {
            required: true,
        },
        cat_name: {
            required: true,
        },
    },
};

const whichCat = ref<SelectMixedOption[]>([]);
const whichCollege = ref<SelectMixedOption[]>([]);

</script>

<script setup lang="ts">
import { ref } from 'vue';
import { NIcon, NForm, NFormItem, NInput, NButton, NSelect, NDatePicker } from 'naive-ui';
import type { Value, ValueAtom } from 'naive-ui/es/select/src/interface';
import { onMounted } from 'vue';
import Checkmark28Filled from '@vicons/fluent/Checkmark28Filled'
import type MapBrowserEvent from 'ol/MapBrowserEvent'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import type { AppearLog } from '../dataobj/appearLog';
import markerIcon from '../assets/markerIcon.png'
import { query } from './Table.vue';
import { closeDrawer } from './Main.vue';
import { queryCatInfo, queryCollege, updateAppearLog, createAppearLog } from '../mysql/SqlConnectInterface'
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';

const center = ref([113.96580036721535, 22.589852989267584])
const projection = ref('EPSG:4326')
const zoom = ref(16)
const rotation = ref(0)


const markerCoods = ref([0, 0]);


const onMapClick = function (e: MapBrowserEvent<UIEvent>) {
    console.log(e.coordinate);
    markerCoods.value = e.coordinate;
    formValue.value.appearLog.appear_location = "[" + markerCoods.value.slice().reverse().toString() + "]";
};
let isEdit = false;
const props = defineProps(['msg']);

onMounted(
    () => {
        whichCat.value = [];
        whichCollege.value = [];
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
        queryCollege().then(res => {
            [...res].forEach(it => {
                whichCollege.value.push(
                    {
                        value: it['college_id'],
                        label: it['college_name'],
                    }
                )
            })
        });
        // console.log(whichCat.value);
        if (props.msg !== undefined) {
            isEdit = true;
            markerCoods.value = JSON.parse(`${props.msg['appear_location']}`).reverse();
            center.value = markerCoods.value;
            formValue.value.appearLog = {
                cat_uid: `${props.msg['cat_uid']}`,
                college_id: `${props.msg['college_id']}`,
                appear_location: `${props.msg['appear_location']}`,
                appear_time: new Date(`${props.msg['appear_time']}`).getTime(),
                appear_log: `${props.msg['appear_log']}`,
            };
        } else {
            center.value = [113.96580036721535, 22.589852989267584];
            isEdit = false;
            formValue.value.appearLog = {
                appear_location: '',
                college_id: null,
                appear_time: new Date().getTime(),
                cat_uid: null,
                appear_log: '',
            };
        }
    }
)


const submit = function () {
    console.log(formValue.value.appearLog);
    if (isEdit) {
        updateAppearLog(formValue.value.appearLog.cat_uid,
            formValue.value.appearLog.college_id,
            formValue.value.appearLog.appear_location,
            formValue.value.appearLog.appear_log,
            formValue.value.appearLog.appear_time);

    } else {
        createAppearLog(formValue.value.appearLog.cat_uid,
            formValue.value.appearLog.college_id,
            formValue.value.appearLog.appear_location,
            formValue.value.appearLog.appear_time);
    }
    closeDrawer();
    query("appearLog");
}




</script>


<style>
.olmap {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>