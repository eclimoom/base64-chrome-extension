import {AfterViewInit, Component} from '@angular/core';
import {PNG} from 'local-png-js';

const STORAGE_BASE_NAME = 'storageBase64';
const DEMO_STR = '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';

@Component({
  selector: 'app-base-to-png',
  templateUrl: './base-to-png.component.html',
  styleUrls: ['./base-to-png.component.scss']
})
export class BaseToPngComponent implements AfterViewInit {

  urlPath: any = 'https://srv.carbonads.net/static/30242/15f7619952d3cdf0e1f51f9262d4afe75069da8a';

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
    {type: 'string', name: '字符串'},
    {type: 'url', name: 'url'}
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
    } else if (this.pngConfig.imgType === 'string') {
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

  // getPixelValues(pixelData): any {
  //   let minPixelValue = Number.MAX_VALUE;
  //   let maxPixelValue = Number.MIN_VALUE;
  //   const len = pixelData.length;
  //   let pixel = void 0;
  //
  //   for (let i = 0; i < len; i++) {
  //     pixel = pixelData[i];
  //     minPixelValue = minPixelValue < pixel ? minPixelValue : pixel;
  //     maxPixelValue = maxPixelValue > pixel ? maxPixelValue : pixel;
  //   }
  //
  //   return {
  //     minPixelValue,
  //     maxPixelValue
  //   };
  // }

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

  handleSample(): void {

    this.pngConfig.baseString = DEMO_STR;
    this.baseString = DEMO_STR;
    this.decode();
  }

  // 上传文件
  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.renderFile(file);
    }
  }


  async urlVal(): any {
    const url = this.urlPath;
    if (!url) {
      return;
    }
    // load url
    const img = new Image();
    // img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;

    img.onload = (e: any) => {
      // console.log('e', img);
      // const canvas = new OffscreenCanvas(img.width, img.height);
      // const ctx = canvas.getContext('2d');
      // ctx.drawImage(img, 0, 0);
      // canvas.convertToBlob().then((blob) => {
      //   console.log('blob', blob);
      // });
      // const base64 = canvas.toDataURL();

      // fetch(url).then(res => res.arrayBuffer()).then(arrayBuffer => {
      //   const base64 = arrayBuffer.toString();
      //   console.log(base64);
      // });

      // const canvas = document.createElement('canvas');
      // const ctx = canvas.getContext('2d');
      // canvas.width = img.width;
      // canvas.height = img.height;
      // ctx.drawImage(img, 0, 0);
      // canvas.toBlob((blob: any) => {
      //   console.log('blob', blob);
      // });

      // 3
      createImageBitmap(img).then(bmp => {
        // transfer it to your worker

        console.log(bmp, 'img');
      });
    };

    // const blob = await fetch(url).then(r => r.blob());
    // const img2 = await createImageBitmap(blob);
  }


  private renderFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.pngConfig.baseString = e.target.result;
      this.pngVal();

    };
    console.log('file', file);
    if (file.type.includes('image')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }

  }
}
