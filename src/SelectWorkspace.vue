<template>
  <ion-page>
    <ion-content fullscreen="true" class="home-content">
      <!-- Branding Section -->
      
      <div class="addws-page">
        <div class="fixed-container">
        <div class="branding">
          <ion-img src="assets/ePOS-logo.png" alt="App Logo" class="app-logo"></ion-img>
          <ion-text class="app-name">ePOS</ion-text>
        </div>
        <div style="height:calc(-317.5px + 100vh);background: transparent;" class="border-round-top-3xl p-3 -mt-5">
          <!-- Add Workspace Button --> 
          <ion-button size="large" expand="full" class="add-workspace" shape="round" router-link="/add-workspace" >{{ t("Add Workspace") }}</ion-button>
         

          <!-- Workspace List --> 
          <ion-list class="workspace-list bg-transparent">
            <ion-card
              v-for="p in properties"
              :key="p.property_code"
              @click="onLogin(p)"
              class="border-round-2xl"  
              button
            >
              <ion-card-header>
                <div class="workspace-header">
                  <!-- Workspace Avatar -->
                  <ion-avatar class="workspace-logo">
                    <Img :src="p.photo" :api_url="p.api_url"/>
                  </ion-avatar> 
                  <!-- Workspace Info (Two Lines) -->
                  <div class="workspace-info">
                    <ion-text class="workspace-name">{{ p.property_name }}</ion-text>
                    <ion-text class="user-name">{{ p.username }}</ion-text>
                  </div>

                  <!-- Vertical Ellipsis Menu Button -->
                  <ion-button fill="clear" @click.stop="onOpenMenu(p)">
                    <ion-icon :icon="ellipsisVertical"></ion-icon>
                  </ion-button> 
                </div>
              </ion-card-header>
            </ion-card> 
          </ion-list>
        </div>
      </div>
     </div>
    </ion-content> 
    <!-- Footer -->
    <ion-footer class="footer surface-ground"> 
      <ion-toolbar class="no-shadow h-auto mb-2 pt-2"> 
        <ion-buttons class="language-buttons">
          <ion-button v-for="(l, index) in languages" :key="index" @click="changeLanguage(l.lang)" :color="l.lang == locale?'danger':'default'" >
            <ion-icon :src="l.icon" slot="start" />
            {{ l.label }}
          </ion-button>
        </ion-buttons>
        <div class="footer-text">
          <ion-text class="powered-by">{{t("ePOS by ESTC")}}</ion-text>
          <ion-text class="app-version">Version 1.0.0</ion-text>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
<script setup>
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonIcon,
  actionSheetController,
  alertController,
  useIonRouter,
  loadingController,
  onIonViewWillEnter
} from '@ionic/vue';

const EscPosPrinter = window.Capacitor.Plugins.EscPosPrinter;
import { onMounted, ref } from 'vue';
import { ellipsisVertical } from 'ionicons/icons';
import { useAuth } from './hooks/useAuth';
import { useApp } from './hooks/useApp';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const result = ref({});
const { currentProperty, languages,getSetting } = useApp();
const ionRouter = useIonRouter();
const properties = ref([]);
const { login, isAuthenticated } = useAuth();

const changeLanguage = (lang) => {
  locale.value = lang;
  window.localStorage.setItem('lang', locale.value);
};


async function testbluetoothprinter(){
  console.log(window.Capacitor.Plugins.EscPosPrinter);
  try {
    const result = await EscPosPrinter.getBluetoothPrinterDevices();
    console.log('Printers found:', result);
    return result.devices || result; // depends on plugin return shape
  } catch (error) {
    console.error('Error discovering printers:', error);
  }
}

import { TcpSocket,DataEncoding  } from 'capacitor-tcp-socket';


async function testme(){
  printReceipt()

  //  try {
  //   const result = await TcpSocket.connect({
  //     ipAddress: '192.168.10.247',
  //     port: 9100
  //   });
  //   console.log(`Connected with client ID: ${result.client}`);
  //   await sendData(result.client)
  //   return result.client;
  // } catch (error) {
  //   console.error('Connection failed:', error);
  // }
  
}

// Send data
const sendData = async (clientId) => {

  try {
    await TcpSocket.send({
      client: clientId,
      data: 'Hello សួស្តី,',
       encoding: 'utf8'
    });
    console.log('Data sent successfully');

  // Feed 3mm (24 dots)
await TcpSocket.send({
  client: clientId,
  data: '0A0A0A', // 3x Line Feed
  encoding: 'hex'
});
await TcpSocket.send({
  client: clientId,
  data: '0A0A0A', // 3x Line Feed
  encoding: 'hex'
});
await TcpSocket.send({
  client: clientId,
  data: '0A0A0A', // 3x Line Feed
  encoding: 'hex'
});


    await TcpSocket.send({
    client: clientId,
    data: '1D5600',
    encoding: 'hex'
  });
  
  //  await TcpSocket.send({
  //     client: clientId,
  //     data: '1B401D5600', 
  //     encoding: 'hex'      // Specify HEX encoding
  //   });

    await disconnect(clientId)
  } catch (error) {
    console.error('Send failed:', error);
  } finally {
    // disconnect(clientId)
  }
};

const disconnect = async (clientId) => {
  try {
    const result = await TcpSocket.disconnect({
      client: clientId
    });
    console.log(`Disconnected client: ${result.client}`);
  } catch (error) {
    console.error('Disconnect failed:', error);
  }
};
async function sendCutCommand(clientId) {
  // Try different cut commands
  const cutCommands = [
    '1B6D',      // ESC m (Full cut)
    '1B69',      // ESC i (Partial cut)
    '1D5600',    // GS V 0 (Full cut)
    '1D5601',    // GS V 1 (Partial cut)
    '1D564200',  // GS V 66 0 (Older printers)
  ];

  for (const cmd of cutCommands) {
    try {
      await TcpSocket.send({
        client: clientId,
        data: cmd,
        encoding: DataEncoding.HEX,
      });
      console.log(`Sent cut command: ${cmd}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 sec
    } catch (error) {
      console.error(`Failed to send ${cmd}:`, error);
    }
  }
}


async function onLogin(p) {
  const loading = await app.showLoading("Login in...")
  const response = await login(p);
  await loading.dismiss();

  if (response) {
    currentProperty.value = p;
   app.setting.property = p
    await app.storageService.setItem("current_property",JSON.stringify(p))
    await app.utils.getSetting();
    ionRouter.navigate('/home', 'forward', 'replace');
  }
}

async function onOpenMenu(p) {
  const actionSheet = await actionSheetController.create({
    header: 'Action Menu',
    buttons: [
      {
        text: t('Edit Property'),
        handler: async () => {
          ionRouter.navigate('/add-workspace/' + p.property_code, 'forward', 'push');
        },
      },
      {
        text: t('Remove Property'),
        cssClass: 'remove-property-btn',
        handler: async () => {
          const alert = await alertController.create({
            header: 'Delete property',
            message: 'Are you sure you want to delete this property?',
            buttons: [
              { text: 'Cancel', role: 'cancel' },
              {
                text: 'OK',
                cssClass: 'alert-button-confirm',
              },
            ],
          });

          await alert.present();
          const result = await alert.onWillDismiss();

          if (result.role !== 'cancel') {
            properties.value = properties.value.filter(
              (r) => r.property_code !== p.property_code
            );
            app.storageService.setItem('properties', JSON.stringify(properties.value));
          }
        },
      },
    ],
  });

  await actionSheet.present();
}

onIonViewWillEnter(() => {
  if (isAuthenticated) {
    ionRouter.navigate('/home', 'forward', 'replace');
  }
  const strProperties = app.storageService.getItem('properties');
  if (strProperties) {
    properties.value = JSON.parse(strProperties);
  }
});

 
 
</script>

 
<style scoped>
/* Branding Section with Gradient Background */
.branding {
  height: 30vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white; 
} 
.app-logo {
  width: 70px;
  height: 70px;
  margin-bottom: 12px;
}

.app-name {
  font-size: 36px;
  font-weight: bold;
} 
.workspace-header {
  display: flex;
  align-items: center;
  justify-content: space-between; 
}

.workspace-logo {
  width: 50px;
  height: 50px;
}

.workspace-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  flex: 1;
}

.workspace-name {
  font-size: 16px;
  font-weight: bold;
  white-space: normal;
}


.user-name {
  font-size: 14px;
  color: gray;
}

.ripple-card {
  --ripple-color: rgba(0, 123, 255, 0.2);  /* Optional: Customize ripple color */

}


.footer {
  --background: transparent; /* No background */
  height: 100px;
  box-shadow: none;           /* No shadow */
  
}

.no-shadow {
  --box-shadow: none;        /* Remove shadow from ion-toolbar */
  --background: transparent; /* Transparent background for toolbar */
}

.footer-text {
  text-align: center; /* Center the text */
  width: 100%;        /* Ensure the div takes the full width */
}

.powered-by {
  display: block;     /* Make the text block to go to the next line */
  font-weight: bold;  /* Make the "Powered by" text stand out */
}

.app-version {
  display: block;     /* Ensure this is on a new line */
  font-size: 14px;     /* Smaller font size for the version */
  color: gray;        /* Slightly gray to differentiate from the title */
}
.remove-property-btn {
  color: red;  /* Makes the text red */
}

.language-buttons {
  display: flex;
  justify-content: center;
  width: 100%; 
}

</style>