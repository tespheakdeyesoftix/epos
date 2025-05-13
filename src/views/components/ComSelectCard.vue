<template>
 
    <ion-item @click="onSelect" button  >
            <ion-avatar slot="start" v-if="photoField">
                <Img :src="data[photoField]"   v-if="data[photoField]" />
                <div class="avatar-placeholder" :style="{ backgroundColor: getRandomColor() }" v-else>{{
                    getAvatarLetter(data[labelField] ?? data[valueField]) }}</div>
            </ion-avatar>
            <ion-label>
              <h2>{{ data[labelField] ?? data[valueField] }}</h2>
              <p  v-if="description">{{ description }}</p>
            </ion-label>
            <ion-icon slot="end" :icon="checkmarkCircle" v-if="data.selected" size="medium" color="primary" />
          </ion-item>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import {  getAvatarLetter, getRandomColor } from "@/helpers/utils"
import { checkmarkCircle } from "ionicons/icons"; // Import Ionicons


const props = defineProps({
    data: Object,
    valueField: {
        type: String,
        default: "name"
    },
    labelField: {
        type: String,
        default: "label"
    },
    descriptionField: {
        type: String,
        default: "description"
    },
    descriptionFields: String,
    photoField: String,
    selectedValue:String,
    selectedValues:Object

})
const emit = defineEmits();

 
const description = computed(() => {

    if (props.descriptionFields) {


        let values: any[] = [];
        props.descriptionFields.split(",").map((item: string) => item.trim()).forEach((f: string) => {
            if (props.data) {
                values.push(props.data[f])
            }
        });
        if (values) {
            return values.join(", ")
        }
    }
    if (props.descriptionField) {
        if (props.data) {
            return props.data[props.descriptionField];
        }


    }


    return "";
})

const onSelect = () => {
    emit("onSelect")

}
</script>

<style scoped>
.avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #007bff;
    /* Blue background */
    color: white;
    font-size: 14px;
    font-weight: bold;
    border-radius: 50%;
    text-transform: uppercase;
}
</style>