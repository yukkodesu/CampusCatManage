<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue'
import { NButton, NDataTable, PaginationProps } from 'naive-ui'
import type { DataTableColumn } from 'naive-ui'
import { catInfoTitle } from '../dataobj/catInfo'
import { queryCatInfo, queryAppearLog, queryFeedLog } from '../mysql/SqlConnectInterface'
import { activateDrawer, setCatInfoMsg, setAppearLogMsg, setFeedLogMsg } from './Main.vue'
const props = defineProps({
    msg: String
});

onMounted(() => {
    query(`${props.msg}`);
    watch(() => props.msg, () => query(`${props.msg}`));
});

// const height = ref("93vh");
</script>
<script lang="ts">
const columns = ref<DataTableColumn[]>([]);
const data = ref<Object[]>([]);


const columnsForAppearLog: DataTableColumn[] = [
    { key: 'timeString', title: '出现时间' },
    { key: 'cat_name', title: '猫猫名字' },
    { key: 'college_name', title: '出现校区' },
    { key: 'user_name', title: '打卡用户' }
];

const columnsForFeedLog: DataTableColumn[] = [
    { key: 'timeString', title: '投喂时间' },
    { key: 'cat_name', title: '猫猫名字' },
    { key: 'food_name', title: '投喂食物' },
    { key: 'user_name', title: '投喂人' }
];

const pagination = ref<PaginationProps>({ pageSize: 6 });

const query = function (msg: string) {
    columns.value = [];
    data.value = [];
    switch (msg) {
        case "catInfo":
            queryCatInfo().then(
                res => {
                    Object.keys(res[0]).forEach((it: string) => {
                        if (it !== "cat_uid")
                            columns.value.push({
                                key: it,
                                title: catInfoTitle.get(it),
                            })
                    });
                    columns.value.push({
                        key: "edit",
                        title: "",
                        render(row) {
                            return h(
                                NButton,
                                {
                                    strong: true,
                                    tertiary: true,
                                    size: 'small',
                                    onClick: () => {
                                        activateDrawer();
                                        setCatInfoMsg({
                                            cat_uid: `${row["cat_uid"]}`,
                                            cat_name: `${row["cat_name"]}`,
                                            cat_variety: `${row["cat_variety"]}`,
                                            cat_color: `${row["cat_color"]}`,
                                            cat_temp: `${row["cat_temp"]}`,
                                        });
                                    }
                                },
                                { default: () => '修改' }
                            )
                        }
                    });
                    [...res].forEach(it => {
                        data.value.push(it);
                    });
                }
            );
            break;
        case "appearLog":
            queryAppearLog().then(res => {
                columnsForAppearLog.forEach(it => columns.value.push(it));
                columns.value.push({
                    key: "edit",
                    title: "",
                    render(row) {
                        return h(
                            NButton,
                            {
                                strong: true,
                                tertiary: true,
                                size: 'small',
                                onClick: () => {
                                    activateDrawer();
                                    // console.log(row);
                                    setAppearLogMsg({
                                        appear_log: `${row['appear_log']}`,
                                        cat_uid: `${row['cat_uid']}`,
                                        user_uid: `${row['user_uid']}`,
                                        college_id: `${row['college_id']}`,
                                        appear_location: `${row['appear_location']}`,
                                        appear_time: `${row['appear_time']}`,
                                    })
                                }
                            },
                            { default: () => '详情' }
                        )
                    }
                });
                [...res].forEach(it => {
                    data.value.push({
                        ...it,
                        timeString: new Date(it['appear_time']).toLocaleString(),
                    });
                });
            });
            break;
        case "feedLog":
            queryFeedLog().then(res => {
                columnsForFeedLog.forEach(it => columns.value.push(it));
                columns.value.push({
                    key: "edit",
                    title: "",
                    render(row) {
                        return h(
                            NButton,
                            {
                                strong: true,
                                tertiary: true,
                                size: 'small',
                                onClick: () => {
                                    activateDrawer();
                                    // console.log(row);
                                    setFeedLogMsg({
                                        food_uid: `${row['food_uid']}`,
                                        feed_time: `${row['feed_time']}`,
                                        cat_uid: `${row['cat_uid']}`,
                                        feed_uid: `${row['feed_uid']}`,
                                    });
                                }
                            },
                            { default: () => '详情' }
                        )
                    }
                });
                [...res].forEach(it => {
                    data.value.push({
                        ...it,
                        timeString: new Date(it['feed_time']).toLocaleString(),
                    });
                });
            });
            break;
    }
}


export { query };
</script>


<template>
    <n-data-table class="data-table" :columns="columns" :data="data" :pagination="pagination" :bordered="false" />
</template>

<style>

</style>


