import {AfterViewInit, Component} from '@angular/core';
import {PNG} from 'local-png-js';
import {UINT8_BASE64, oneByte} from './png';

const STORAGE_BASE_NAME = 'storageBase64';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'base64-chrome-extension';
  pngConfig = {
    baseString: '',
    imgType: '',  // 图像类型
    backgrounds: [
      {color: '#000', label: '黑'},
      {color: '#fff', label: '白'},
      {color: '#f00', label: '红'},
    ],
    background: '',
  };
  imgTypes = [
    {type: 'png', name: 'PNG'},
    {type: 'Uint8', name: 'Uint8'}
  ];

  baseString: string;

  list: any[];

  constructor() {
    this.pngConfig.imgType = this.imgTypes[0].type;
    this.pngConfig.background = this.pngConfig.backgrounds[0].color;
    this.list = this.getBase64List();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setSelectionRange();
    }, 0);
  }

  pngVal(): void {
    // console.log("origin: ",this.pngConfig.baseString);
    const str = this.pngConfig.baseString;
    if (!str) {
      this.baseString = null;
      return;
    }
    this.baseString = str.trim().replace(/^"|"$|^'|'$/g, '').replace('data: ', '').trim();
    this.decode();
  }

  decode(): string {
    if (!this.baseString) {
      return '';
    }
    let data = 'data:image/png;base64,';
    if (this.pngConfig.baseString.includes('base64,')) {
      data = this.pngConfig.baseString;
    } else if (this.pngConfig.imgType === 'png') {
      data += this.baseString.replace(/^"|"$|^'|'$/g, '').trim();
    } else {
      let png: any;
      let array: Uint8Array;
      try {
        array = this._base64ToUint8Array(this.baseString);
      } catch (e) {
        console.log('decode base64 error, ', e);
        return;
      }

      let width: any;
      let height: any;
      let pixelDataOriginal: number[] | Uint8Array;
      // https://www.cnblogs.com/zhangnan35/p/12433201.html
      if (this.pngConfig.imgType === 'Uint8') {

        try {
          png = PNG.newPng(array);
        } catch (e) {
          console.log('decode png error, ', e);
          return;
        }
        width = png.width;
        height = png.height;
        // console.log("array", png, width, height);
        const decodePixels = png.decodePixels();
        let buffData;
        let currentColor;
        const colorDml = [255, 0, 0];
        const colorDisease = [255, 255, 0];
        switch (png.pixelBitlength) {
          case 8:
            // grayscale
            pixelDataOriginal = new Uint8Array(png.width * png.height * 4);
            buffData = new Uint8Array(decodePixels.buffer);

            for (let i = 0; i < png.width * png.height; i++) {
              if (buffData[i] > 0) {
                // lable2动脉瘤(红色),lable1血管(绿色)
                if (buffData[i] === 2) {
                  currentColor = [...colorDml];
                } else {
                  currentColor = [...colorDisease];
                }
                pixelDataOriginal[i * 4] = currentColor[0];
                pixelDataOriginal[i * 4 + 1] = currentColor[1];
                pixelDataOriginal[i * 4 + 2] = currentColor[2];
                pixelDataOriginal[i * 4 + 3] = 255;
              }
            }
            break;
          default:
            break;
        }
      } else {
      }
      data = this._renderPixel({pixelData: pixelDataOriginal, width, height});
    }
    return data;
  }

  getPixelValues(pixelData): any {
    let minPixelValue = Number.MAX_VALUE;
    let maxPixelValue = Number.MIN_VALUE;
    const len = pixelData.length;
    let pixel = void 0;

    for (let i = 0; i < len; i++) {
      pixel = pixelData[i];
      minPixelValue = minPixelValue < pixel ? minPixelValue : pixel;
      maxPixelValue = maxPixelValue > pixel ? maxPixelValue : pixel;
    }

    return {
      minPixelValue,
      maxPixelValue
    };
  }

  // str2ab(str) {
  //   const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  //   const bufView = new Array(buf);
  //   for (let i = 0, strLen = str.length; i < strLen; i++) {
  //     bufView[i] = str.charCodeAt(i);
  //   }
  //   return bufView;
  // }
  //
  // buffer2Base64(int16) {
  //   // const binary = String.fromCharCode.apply(null, buffer);
  //   // return window.btoa(binary);
  //   return window.btoa(int16.reduce(
  //     function (data, byte) {
  //       return data + String.fromCharCode(byte);
  //     },
  //     ''
  //   ));
  // }

  _base64ToUint8Array(base64String: string): Uint8Array {
    const rawData = window.atob(base64String) || '';
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  _renderPixel({pixelData, width, height}): string {
    const canvas: any = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
    const ctx = canvas.getContext('2d', {alpha: false});
    const imageData = new ImageData(new Uint8ClampedArray(pixelData), width, height);
    ctx.putImageData(imageData, 0, 0);
    const base64 = canvas.toDataURL();
    return base64;
  }

  setSelectionRange(): void {
    const input = document.querySelector('textarea');
    input.select();
    if (document.execCommand) {
      document.execCommand('paste');
    }

    setTimeout(() => {
      this.pngVal();
    }, 10);
  }

  onImageLoad(): void {
    // 将解析成功的图片添加到历史
    this.setBase64List(this.baseString);
  }

  onImageError($event: Event): void {
    console.log('onImageError', $event);
  }

  getBase64List(): Array<any> {
    return JSON.parse(localStorage.getItem(STORAGE_BASE_NAME) || '[]');
  }

  setBase64List(base64: string): void {
    const list = this.getBase64List();
    if (list.find((item) => item.base64 === base64)) {
      return;
    }
    list.unshift({base64, date: new Date()});
    if (list.length > 5) {
      list.length = 5;
    }
    localStorage.setItem(STORAGE_BASE_NAME, JSON.stringify(list));
  }
}
