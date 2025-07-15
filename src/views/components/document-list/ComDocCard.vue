<template>
 
    <ion-card button @click="openLink" class="ion-no-padding">
        <ion-card-content class="ion-no-padding">
           <ion-item lines="none" class="compact-item" >
            <ion-text class="ion-no-margin"><h2> <strong>{{ getTitle() }} </strong><ComStatus  v-if="getStatus() && getAmountField()"  :status="getStatus()"/></h2></ion-text>
            <strong slot="end" v-if="getAmountField()"  ><ComCurrency :value="data[getAmountField()]" /></strong>
            <ComStatus slot="end"  v-if="getStatus() && !getAmountField()"  :status="getStatus()"/>
           </ion-item>
           <template v-for="(f,index) in getSubTitleFields()" v-if="getSubTitleFields()" :key="'sub_title' + index">
           
        <ion-label  class="ion-margin" v-if="data[f]" >
                        {{  data[f] }} <br/>
                </ion-label> 
           </template>
        
           <ion-label class="ion-margin" v-if="getCreatedBy()">{{ t("By") }} : {{getCreatedBy()}} <br/></ion-label> 
           <ion-label class="ion-margin" v-if="getDate()"> {{ getDate() }}</ion-label>
        </ion-card-content>
    </ion-card>
 
</template>
<script setup>
import dayjs from 'dayjs';
 
const props = defineProps({
    data:Object,
    fields:Object,
    titleFields:String,
    subTitleFields:String
})
    const t = window.t;
function getTitle(){
    if(props.titleFields) return props.data[props.titleFields]
    if(props.data.name) return props.data.name
}
function openLink(){
    const link = props.fields.find(x=>x.url)

    app.ionRouter.navigate(`${link.url}/${props.data.name}` ,"forward","push")
}

function getCreatedBy(){
    if (props.data.created_by) return props.data.created_by.split("@")[0]
    if (props.data.closed_by) return props.data.closed_by.split("@")[0]
    if (props.data.modified_by) return props.data.modified_by.split("@")[0]
    if (props.data.owner) return props.data.owner.split("@")[0]
    return false
}

function getDate(){
    if (props.data.closed_date) return dayjs(props.data.closed_date).format('DD/MM/YYYY hh:mm A')
    if (props.data.modified) return dayjs(props.data.modified).format('DD/MM/YYYY hh:mm A')
    if (props.data.creation) return dayjs(props.data.creation).format('DD/MM/YYYY hh:mm A')
    
    return false
}
function getSubTitleFields(){
    if(props.subTitleFields){
        
        let fields = props.subTitleFields.split(",").map(x=>x.trim())
       
        if(fields.length>3){
            fields = fields.slice(0, 3);

        }
        return fields
    }
    return false
}

function getStatus(){
    if("is_closed" in props.data){
        return props.data.is_closed == 1?"Closed":"Opened"
    }
    if("status" in props.data){
        return props.data.status;
    }
    
    if("docstatus" in props.data){
        if(props.data.docstatus==0) return "Draft"
        if(props.data.docstatus==1) return "Submitted"
        return "Cancelled"
    }

    if("is_disabled" in props.data){
        return props.data.is_disabled ==1?"Inactive":"Active"
    }

    const statusHeaderField = props.fields.find(x=>x.header.toLowerCase() == "status");
    if(statusHeaderField){
        return props.data[statusHeaderField.fieldname]
    }
    return false
}


function getAmountField(){
    let f = props.fields.find(x=>x.is_card_amount && x.fieldtype == "Currency")
    if(f){
        return f.fieldname
    }
    f = props.fields.filter(x=>x.fieldtype == "Currency")

    if(f.length == 1){
        return f[0].fieldname
    }
    if (f.length>1) {
        // priority field grand_total, total_amount, amount,balance
        ["grand_total","total_amount","amount","balance","price"].forEach(x=>{
            const _f = f.find(r=>r.fieldname.includes(x))
            if(_f) return _f.name
        });
        return f[0].fieldname
    }
    return false
}


</script>

<style lang="css" scoped>
.compact-item {
  --padding-top: 4px;
  --padding-bottom: 4px;
  --min-height: 32px; /* or whatever you want */
  --background: rgba(255, 0, 0, 0);
}

.compact-item .item-native {
  padding-top: 0;
  padding-bottom: 0;
}
</style>