<template>
  <BaseModal @onConfirm="onConfirm" :title="title">
    <div class="keyboard-container mt-0">
      <com-input 
        v-model="inputText"
        label-placement="stacked"
        :clear-input="true"
        :placeholder="t('Type here...')" 
        fill="outline"
        :showKeyboard="false"
        focus
      >
      </com-input>

      <div class="chip-container">
        <ion-chip v-for="(n, index) in predefineNotes" :key="index" @click="() => inputText = n">
          <ion-label>{{ n }}</ion-label>
          <ion-icon :icon="close" @click.stop="() => onDeleteNote(index)"></ion-icon>
        </ion-chip>
      </div>

      <div class="keyboard" v-if="plateform !== 'mobile'">
        <div v-for="(row, rowIndex) in keys" :key="rowIndex" class="keyboard-row">
          <button
            v-for="key in row"
            :key="key"
            class="keyboard-key"
            :class="{
              wide: key === 'space',
              backspace: key === 'backspace',
              shift: key === 'shift' || key === 'ប្តូរ',
              lang: key === 'lang',
              ctrl: key === 'CTRL' || key === 'បញ្ជា',
              alt: key === 'ALT' || key === 'ជំនួស',
              altgr: key === 'ALT GR' || key === 'ឆ្លាស់',
              win: key === 'Win',
              caps: key === 'caps' || key === 'ប្តូរជាប់',
              enter: key === 'enter' || key === 'បញ្ចូល',
              tab: key === 'TAB' || key === 'ថេប',
              active:
                ((key === 'TAB' || key === 'ថេប')&& isTAB.value) ||
                ((key === 'CTRL' || key === 'បញ្ជា')&& isCtrl.value) ||
                ((key === 'ALT' || key === 'ជំនួស')&& isAlt.value) ||
                ((key === 'ALT GR' || key === 'ឆ្លាស់')&& isAltGr.value) ||
                (key === 'Win' && isWin.value) ||
                ((key === 'caps' || key === 'ប្តូរជាប់') && isCapsLock.value) ||
                ((key === 'enter' || key === 'បញ្ចូល') && isEnter.value) ||
                ((key === 'shift' || key === 'ប្តូរ') && isShift.value),
            }"
            @click="handleKeyPress(key)"
          >
            {{ keyDisplay(key) }}
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { modalController } from '@ionic/vue';
import { close, personRemove, settings } from 'ionicons/icons';
const t = window.t;
const props = defineProps({
  title: String,
  defaultValue: String,
  storageKey:String
});
const plateform = ref(app.utils.getPlateform())
// States
const inputText = ref(props.defaultValue || "");
const isShift = ref(false);
const isCapsLock = ref(false);
const isCtrl = ref(false);
const isAlt = ref(false);
const isWin = ref(false);
const currentLanguage = ref('khmer');
const isTAB = ref(false);
const isAltGr = ref(false);
const predefineNotes = ref([]);
const isEnter = ref(false)
// Keyboard layouts
const khmerNormalKeys = [
  ['«','១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩', '០', 'ឥ', 'ឲ', 'backspace'],
  ['ថេប', 'ឆ', 'ឹ', 'េ', 'រ', 'ត', 'យ', 'ុ', 'ិ', 'ោ', 'ផ', 'ៀ', 'ឪ', 'ឮ'],
  ['ប្តូរជាប់', 'ា', 'ស', 'ដ', 'ថ', 'ង', 'ហ', '្', 'ក', 'ល', 'ើ', '់', 'បញ្ចូល'],
  ['ប្តូរ', 'ឋ', 'ខ', 'ច', 'វ', 'ប', 'ន', 'ម', 'ុំ', '។', '៊', 'ប្តូរ'],
  ['lang', 'បញ្ជា', '', 'ជំនួស', 'space', 'ឆ្លាស់', '', 'បញ្ជា', 'lang'],
];
const khmerShiftKeys = [
  ['»','!', 'ៗ', '"', '៛', '%', '៍', '័', '៏', '(', ')', '៌', '=', 'backspace'],
  ['ថេប', 'ឈ', 'ឺ', 'ែ', 'ឬ', 'ទ', 'ួ', 'ូ', 'ី', 'ៅ', 'ភ', 'ឿ', 'ឧ', 'ឭ'],
  ['ប្តូរជាប់', 'ាំ', 'ៃ', 'ឌ', 'ធ', 'អ', 'ះ', 'ញ', 'គ', 'ឡ', 'ោះ', '៉', 'បញ្ចូល'],
  ['ប្តូរ', 'ឍ', 'ឃ', 'ជ', 'េះ', 'ព', 'ណ', 'ំ', 'ុះ', '៕', '?', 'ប្តូរ'],
  ['lang', 'បញ្ជា', '', 'ជំនួស', 'space', 'ឆ្លាស់', '', 'បញ្ជា', 'lang'],
];
const khmerAltKeys = [
  ['ឯ','ឫ','ឦ','ឱ','ឰ','ឩ','ឳ','ឲ','ឮ','ឪ','ឧ','ឡ','អ'],
  ['lang', 'បញ្ជា', '', 'ជំនួស', 'space', 'ឆ្លាស់', '', 'បញ្ជា', 'lang'],
];
const englishNormalKeys = [
  ['`','1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
  ['TAB', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
  ['lang', 'CTRL', 'Win', 'ALT', 'space', 'ALT GR', 'Win', 'CTRL', 'lang'],
];
const englishShiftKeys = [
  ['~','!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace'],
  ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
  ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter'],
  ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shift'],
  ['lang', 'CTRL', 'Win', 'ALT', 'space', 'ALT GR', 'Win', 'CTRL', 'lang'],
];
// Reactive keys
const keys = ref([...khmerNormalKeys]);

function handleKeyPress(key) {
  if (key === 'lang') {
    toggleLanguage();
    return;
  }
  if (key === 'shift' || key === 'ប្តូរ') {
    isShift.value = !isShift.value;
    isCapsLock.value = false;
    updateKeys();
    return;
  }
  if (key === 'caps' || key === 'ប្តូរជាប់') {
    isCapsLock.value = !isCapsLock.value;
    isShift.value = isCapsLock.value;
    updateKeys();
    resetModifiers();
    return;
  }
  if (key === 'CTRL' || key === 'បញ្ជា') {
    isCtrl.value = !isCtrl.value;
    isAlt.value = false;
    isWin.value = false;
    return;
  }
  if (key === 'ALT' || key === 'ជំនួស') {
    isAlt.value = !isAlt.value;
    isCtrl.value = false;
    isWin.value = false;
    return;
  }
  if (key === 'Win') {
    isWin.value = !isWin.value;
    isCtrl.value = false;
    isAlt.value = false;
    return;
  }
  if (key === 'space') {
    inputText.value += ' ';
    resetModifiers();
    return;
  }
  if (key === 'backspace') {
    inputText.value = inputText.value.slice(0, -1);
    resetModifiers();
    return;
  }
  if (key === 'enter' || key === 'បញ្ចូល') {
   onConfirm ()
   return;
  }
  if (key === 'TAB' || key === 'ថេប') {
  isTAB.value = true;
  inputText.value += '\t'; // Adds a tab character
  resetModifiers();
  return;
  }
  if (key === 'ALT GR' || key === 'ឆ្លាស់') {
  isAltGr.value = !isAltGr.value;
  updateKeys();
  return;
  }
  if (isCtrl.value) {
    handleCtrlCombination(key);
  } else if (isAlt.value) {
    handleAltCombination(key);
  } else if (isWin.value) {
    handleWinCombination(key);
  } else {
    inputText.value += key;
  }
  resetModifiers();
}

function handleCtrlCombination(key) {
  if (key.toLowerCase() === 'c') inputText.value += '[COPY]';
  if (key.toLowerCase() === 'v') inputText.value += '[PASTE]';
  if (key.toLowerCase() === 'x') inputText.value += '[CUT]';
  if (key.toLowerCase() === 'a') inputText.value += '[SELECT ALL]';
}
function handleAltCombination(key) {
  if (key.toLowerCase() === 't') inputText.value += '[ALT+TAB]';
  if (key.toLowerCase() === 'f') inputText.value += '[ALT+F4]';
}
function handleWinCombination(key) {
  if (key.toLowerCase() === 'd') inputText.value += '[WIN+D]';
  if (key.toLowerCase() === 'r') inputText.value += '[WIN+R]';
}
function resetModifiers() {
  isCtrl.value = false;
  isAlt.value = false;
  isWin.value = false;
  isTAB.value = false;
  isAltGr.value = false;
  isEnter.value = false;
}
function toggleLanguage() {
  currentLanguage.value = currentLanguage.value === 'khmer' ? 'english' : 'khmer';
  isShift.value = false;
  isCapsLock.value = false;
  resetModifiers();
  updateKeys();
}
function updateKeys() {
  if (currentLanguage.value === 'khmer') {
    if (isAltGr.value) {
      keys.value = [...khmerAltKeys];
    } else {
      keys.value = isShift.value || isCapsLock.value
        ? [...khmerShiftKeys]
        : [...khmerNormalKeys];
    }
  } else {
    keys.value = isShift.value || isCapsLock.value
      ? [...englishShiftKeys]
      : [...englishNormalKeys];
  }
}

function keyDisplay(key) {
  if (key === 'TAB') return 'Tab ⇥';
  if (key === 'ថេប') return 'ថេប ⇥';
  if (key === 'space') return 'Space';
  if (key === 'backspace') return '⌫';
  if (key === 'shift') return 'Shift';
  if (key === 'ប្តូរ') return 'ប្តូរ';
  if (key === 'lang') return '🌐';
  if (key === 'បញ្ជា') return 'បញ្ជា';
  if (key === 'ជំនួស') return 'ជំនួស';
  if (key === 'ឆ្លាស់') return 'ឆ្លាស់';
  if (key === 'caps') return 'Caps';
  if (key === 'enter') return 'Enter';
  if (key === 'ប្តូរជាប់') return 'ប្តូរជាប់';
  if (key === 'បញ្ចូល') return 'បញ្ចូល';
  if (key === 'CTRL') return 'Ctrl';
  if (key === 'ALT') return 'Alt';
  if (key === 'Win') return '⊞';
  return key;
}

function onConfirm() {

  if(props.storageKey){
    if(inputText.value){
    const exist = predefineNotes.value.find(x=>x.toLowerCase()==inputText.value.toLocaleLowerCase())
    if(!exist){
      predefineNotes.value.push(inputText.value)
      window.storageService.setItem(props.storageKey, JSON.stringify(predefineNotes.value) )
    }
    
  }
  }
 
  modalController.dismiss(inputText.value, 'confirm');
}
async function onDeleteNote(index) {
  // const confirm = await window.confirm("Are you sure you want to delete this note?");
  if (confirm) {
    predefineNotes.value.splice(index, 1);
    if (props.storageKey) {
      window.storageService.setItem(props.storageKey, JSON.stringify(predefineNotes.value));
    }
  }
}

onMounted(()=>{
  if(props.storageKey){
    const notes = window.storageService.getItem(props.storageKey)
    if(notes){
      predefineNotes.value = JSON.parse(notes)
    }
  }

  props.defaultValue == props.defaultValue || "";

  
})

//modalController.dismiss(inputText.value, 'confirm');
//inputText.value = ''; //Clear input after dismissing
</script>

<!-- css -->
<style scoped>
.chip-container {
  display: flex;
  flex-wrap: nowrap; /* Prevents wrapping to the next row */
  overflow-x: auto; /* Enables horizontal scrolling */
  gap: 8px; /* Adds spacing between chips */
  padding: 8px; /* Optional: Adds padding around the container */
}
/* Optional: Style for the ion-chip to ensure consistent appearance */
ion-chip {
  flex: 0 0 auto; /* Prevents chips from stretching */
}
/* (Same style as you already have, no changes needed) */
.keyboard-container {
  width: 100%;
  height: 100%;
  max-width: 1024px;
  max-height: 768px;
  padding: 20px;
  margin: 0 auto;
  text-align: center;
  font-family: 'Noto Sans Khmer', 'Noto Sans', sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  justify-content: center;
}
.input-field {
  width: 95%;
  margin-bottom: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  --padding-start: 16px;
}
.keyboard {
  width: 100%;
  background: #f3f3f3;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  /* max-height: 600px; */
}
.keyboard-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-bottom: 5px;
}
.keyboard-key {
  width: 55px;
  height: 50px;
  margin: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.keyboard-key:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}
.wide {
  width: 350px;
}
.backspace {
  background-color: #ffcccc;
  width: 90px;
}
/* .backspace:hover {
  background-color: #ff9999;
}  */
.shift {
  width: 100px;
}
.lang {
  background-color: #cecece;
}
.lang:hover {
  background-color: #9e9e9e;
}
.enter {
  /* background-color: #ccffcc; */
  width: 80px;
}
.active {
  background-color: #ff9900;
  transform: translateY(-2px);
}
.caps {
  /* background-color: #cce5ff; */
  width: 80px;
}
.tab {
  width: 70px;
}
.altgr {
  width: 90px; 
}

@media (max-width: 1024px) and (max-height: 768px) {
  .keyboard-container {
    padding: 10px;
  }
  .input-field {
    font-size: 14px;
  }
  .keyboard-key {
    width: 55px;
    height: 55px;
    font-size: 17px;
    margin: 0px;
  }
  .wide {
    width: 350px;
  }
  .shift {
    width: 90px;
  }
  .caps {
  /* background-color: #cce5ff; */
  width: 80px;
}
.enter {
  /* background-color: #ccffcc; */
  width: 80px;
}
.backspace {
  background-color: #ffcccc;
  width: 90px;
}
.tab {
  width: 70px;
}
.altgr {
  width: 90px;
}
}
</style>


