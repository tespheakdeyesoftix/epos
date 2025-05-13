# Default `ion-color` Values

This table shows the default color use in app

| Color Name          | Hex Value   | color | 
|---------------------|-------------|---------------------|
| **primary**          | `#3c449c`   | ![#3c449c](https://placehold.co/40x15/3c449c/3c449c.png) | 
| **secondary**        | `#41729F`   | ![#41729F](https://placehold.co/40x15/41729F/41729F.png) |
| **tertiary**         | `#C3E0E5`   | ![#C3E0E5](https://placehold.co/40x15/C3E0E5/C3E0E5.png) |
| **success**          | `#2dd55b`   | ![#2dd55b](https://placehold.co/40x15/2dd55b/2dd55b.png) |
| **warning**          | `#ffc409`   | ![#ffc409](https://placehold.co/40x15/ffc409/ffc409.png) |
| **danger**           | `#c5000f`   | ![#c5000f](https://placehold.co/40x15/c5000f/c5000f.png) |
| **light**            | `#f6f8fc`   | ![#f4f5f8](https://placehold.co/40x15/f6f8fc/f6f8fc.png) |
| **medium**           | `#5f5f5f`   | ![#5f5f5f](https://placehold.co/40x15/5f5f5f/5f5f5f.png) |
| **dark**             | `#2f2f2f`   | ![#2f2f2f](https://placehold.co/40x15/2f2f2f/2f2f2f.png) |



### Custom Ionic Color Example
link for get generate https://ionicframework.com/docs/theming/color-generator
### Define Custom Colors

> **Note:**  
> - **`--ion-color-mybrand`**: The main color used for backgrounds, buttons, and other UI elements.  
> - **`--ion-color-mybrand-contrast`**: The text color that ensures readability when placed over the `mybrand` background (e.g., on buttons or cards).  
> - **`--ion-color-mybrand-shade`**: A darker version of `mybrand`, typically used for pressed or active states.  
> - **`--ion-color-mybrand-tint`**: A lighter version of `mybrand`, often used for hover effects or subtle highlights.  

```css
:root {
  --ion-color-mybrand: #c5000f;
  --ion-color-mybrand-rgb: 197, 0, 15;
  --ion-color-mybrand-contrast: #ffffff;
  --ion-color-mybrand-contrast-rgb: 255, 255, 255;
  --ion-color-mybrand-shade: #ad000d;
  --ion-color-mybrand-tint: #cb1a27;
}
```
###  Apply the Custom Color to Ionic Components Globally 
```css
.ion-color-mybrand {
  --ion-color-base: var(--ion-color-mybrand);
  --ion-color-base-rgb: var(--ion-color-mybrand-rgb);
  --ion-color-contrast: var(--ion-color-mybrand-contrast);
  --ion-color-contrast-rgb: var(--ion-color-mybrand-contrast-rgb);
  --ion-color-shade: var(--ion-color-mybrand-shade);
  --ion-color-tint: var(--ion-color-mybrand-tint);
}
```
### Use Color 
```css
<ion-button color="mybrand">Background</ion-button>
<ion-text color="mybrand">Text Color</ion-text>
<ion-button color="mybrand">
  Background
  <ion-text color="mybrand">Text Color</ion-text>
</ion-button>
```
### Use in Class


# Code sample
Translate in code block use (window.t(""))
In template block
const t = window.t

# show loading and show taost
window.showWarning(message: string)
window.showSuccess(message: string)
window.showError(message: string)
window.showLoading(message)