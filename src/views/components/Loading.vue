 <template>
    <div id="container">
        <ion-spinner></ion-spinner>
    </div>
  </template>
  
  <script setup lang="ts">
    import { IonSpinner } from '@ionic/vue';
  </script>
  
  <style scoped>
  #container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
   
  </style>
  