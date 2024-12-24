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



本地调试和启动Chrome扩展程序项目

  - 构建项目  
    `npm run build`
  - 加载扩展程序 
    打开 Chrome 浏览器，进入扩展程序管理页面（地址栏输入 chrome://extensions/），然后开启“开发者模式”。  
  - 加载已解压的扩展程序
    点击“加载已解压的扩展程序”按钮，然后选择 dist/base64-chrome-extension 目录。
  - 实时开发： 如果你希望在开发过程中实时查看更改，可以使用 ng build --watch 命令来监视文件更改并自动重新构建项目。  
    `npm run build -- --watch`
  - 每次构建完成后，刷新 Chrome 扩展程序管理页面中的扩展程序以加载最新的更改。 



```js
chrome.runtime.sendMessage({
    action: 'proxyFetch',
    url: 'http://192.168.6.35/predicts/1.2.156.600734.762202257.139620.1730459902.8499.5400253/biomind/98117e9d-a22b-11ef-a3bc-1b7ba874f173/mask/404754_13.png',
    method: 'GET',
    headers: {'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsImlhdCI6MTczNDkzNTU1MSwiZXhwIjoxNzM1MDIxOTUxfQ.eyJ1c2VybmFtZSI6ImhlanVuamkifQ.v2201EENmdEQLRoUKvqXF7cyJx4XQZLH3tE50M9dBg1xTz03ysqP9gMrz4R9oFHhysk98Q3uVi6ozmP-HGD65A'}
  },
  (response) => {
    console.log('Response Data:', response);
    if (response?.ok) {
      console.log('Response Data:', response.data);
      const img = new Image();
      img.src = URL.createObjectURL(new Blob([response.data]));
      document.body.appendChild(img);
    } else {
      console.error('Error:', response.error || `Status: ${response.status}`);
    }
  }
);
```


何煦家庭教育故事.mp4
这个徒弟我收下了.jpg
睡前_和大人一起读.jpg
认真阅读兵马俑.jpg
睡前_读丝绸之路.jpg
全家福.jpg
书店_三国演义漫画_2.jpg
书店_三国演义漫画_1.jpg
带着小朋友一起读绘本.jpg
附件3_2024年顺义区“好父母、好家庭”申报材料.docx
附件1_2024年“顺义区好父母、好家庭”推荐表.docx
附件2_2024年“顺义区好父母、好家庭”推荐统计表.docx
