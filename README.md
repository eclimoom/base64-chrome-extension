# Base64ChromeExtension

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

`ng build --watch`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### 1. 增加隐私条款
http://devfront.top/file-page/privacy.html

### todo:
1. 1byte png
2. 

dicom bm
http://192.168.6.35/bm/aacc748f-07a65df0-83053431-72c4d111-21f4cf0a/010bf150-f4eab77a-6a9f7301-33739b7e-82030c25/4bf4f05b-cb836d89-d127a2af-031c6553-a8963418_0

dicom png
http://192.168.6.35/png/1.2.840.113820.861002.43689.3707805208437.2.2854477/1.3.12.2.1107.5.1.4.60315.30000019080806502363800127394/1.3.12.2.1107.5.1.4.60315.30000019080806502363800127395_0

mask
http://192.168.6.35/predicts/1.2.156.600734.762202257.139620.1730459902.8499.5400253/biomind/98117e9d-a22b-11ef-a3bc-1b7ba874f173/mask/404754_13.png
fetch('http://192.168.6.35/predicts/1.2.156.600734.762202257.139620.1730459902.8499.5400253/biomind/98117e9d-a22b-11ef-a3bc-1b7ba874f173/mask/404754_13.png',
{
    method: 'GET',
    headers: {
        'Authorization':'Bearer eyJhbGciOiJIUzUxMiIsImlhdCI6MTczNDkyMTg5OCwiZXhwIjoxNzM1MDA4Mjk4fQ.eyJ1c2VybmFtZSI6ImhlanVuamkifQ.F6eAXVB788BLdq9JzPR5craxRFKJxPhaocYtvdeifZRdSSNjKd4merud2Tct5LI1RVATZ7mCQnBNHGIKMGQz7A'
    }
})
.then(res => res.blob()) // Gets the response and returns it as a blob
.then(blob => {
console.log(blob);
let objectURL = URL.createObjectURL(blob);
let myImage = new Image();
myImage.src = objectURL;
document.getElementsByTagName('body')[0].appendChild(myImage)
});


fetch('http://192.168.6.35/bm/aacc748f-07a65df0-83053431-72c4d111-21f4cf0a/010bf150-f4eab77a-6a9f7301-33739b7e-82030c25/4bf4f05b-cb836d89-d127a2af-031c6553-a8963418_0',
{
method: 'GET',
headers: {
'Authorization':'Bearer eyJhbGciOiJIUzUxMiIsImlhdCI6MTczNDkyMTg5OCwiZXhwIjoxNzM1MDA4Mjk4fQ.eyJ1c2VybmFtZSI6ImhlanVuamkifQ.F6eAXVB788BLdq9JzPR5craxRFKJxPhaocYtvdeifZRdSSNjKd4merud2Tct5LI1RVATZ7mCQnBNHGIKMGQz7A'
}
})
.then(res => res.blob()) // Gets the response and returns it as a blob
.then(blob => {
    console.log(blob);
    let objectURL = URL.createObjectURL(blob);
    let myImage = new Image();
    myImage.src = objectURL;
    document.getElementsByTagName('body')[0].appendChild(myImage)
});



## 本地调试和启动Chrome扩展程序项目

  - 构建项目  
    `npm run build`
  - 加载扩展程序 
    地址栏输入 chrome://extensions/，然后开启“开发者模式”。  
  - 加载已解压的扩展程序
    点击“加载已解压的扩展程序”按钮，然后选择 dist/base64-chrome-extension 目录。
  - 实时开发。  
    `npm run build -- --watch`
  - 每次构建完成后，刷新Chrome扩展程序。 


## 发布
 - 打包项目  
    `bash extension_build.sh`
 - 上传 dist/base64-chrome-extension.zip 到 [Chrome Web Store](https://chrome.google.com/webstore/devconsole/)


## release note
0.1.10 
 - png 24 bit colorType（色彩类型）2 的支持 用 RGB 表示颜色的base64支持
