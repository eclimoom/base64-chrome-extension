import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { PNG } from 'biomind-png-js';
import * as cornerstone from 'cornerstone-core';
import * as pako from 'pako';
import * as fzstd from 'fzstd';

console.log('pako', pako);

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  private readonly defaultUrl =
    'http://192.168.6.35/predicts/1.2.156.600734.762202257.139620.1730459902.8499.5400253/biomind/98117e9d-a22b-11ef-a3bc-1b7ba874f173/mask/404754_13.png';
  private readonly defaultToken =
    'Bearer eyJhbGciOiJIUzUxMiIsImlhdCI6MTczNDkzNTU1MSwiZXhwIjoxNzM1MDIxOTUxfQ.eyJ1c2VybmFtZSI6ImhlanVuamkifQ.v2201EENmdEQLRoUKvqXF7cyJx4XQZLH3tE50M9dBg1xTz03ysqP9gMrz4R9oFHhysk98Q3uVi6ozmP-HGD65A';

  constructor() {}

  getFetchData(
    url: string = this.defaultUrl,
    token: string = this.defaultToken
  ): Observable<any> {
    const headers: any = {
      Authorization: token,
      'Content-Type': 'arrayBuffer',
    };
    return from(fetch(url, headers).then((response) => response.arrayBuffer()));
  }

  // 根绝文件流的判断文件格式
  getFileType(data: any, endData: any): { type: string; isImg: boolean } {
    const buffer = new Uint8Array(data);
    // console.log('buffer', buffer);
    let type = 'unknown';
    // 图片格式
    let isImg = false;
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      type = 'jpeg';
      isImg = true;
    } else if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      type = 'png';
      isImg = true;
      // const end = new Uint8Array(endData);
      // tslint:disable-next-line:max-line-length
      // if (buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A && buffer[8] === 0x1A ) {
      //   type = 'dicom_png';
      // } else
      if (
        buffer[18] === 0x02 &&
        buffer[19] === 0x00 &&
        buffer[22] === 0x02 &&
        buffer[23] === 0x00
      ) {
        type = 'dicom_png';
        if (
          buffer[24] === 0x01 &&
          buffer[29] === 0xdc &&
          buffer[30] === 0x03 &&
          buffer[31] === 0xe9 &&
          buffer[32] === 0x57
        ) {
          type = '1png';
        }
      }
    } else if (buffer[0] === 0x47 && buffer[1] === 0x49) {
      type = 'gif';
      isImg = true;
    } else if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
      if (buffer[2] === 0x20 && buffer[3] === 0x20) {
        type = 'bm';
      } else {
        type = 'bmp';
      }
      isImg = true;
    }
    // 文档格式
    else if (buffer[0] === 0x25 && buffer[1] === 0x50) {
      type = 'pdf';
    } else if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
      type = 'zip';
    } else if (buffer[0] === 0x52 && buffer[1] === 0x61) {
      type = 'rar';
    } else if (buffer[0] === 0x7b && buffer[1] === 0x5c) {
      type = 'json';
    }
    return { type, isImg };
  }

  decodeImage(view: Uint8Array, type: string): any {
    let image: any;
    if (['dicom_png', '1png', 'png'].includes(type)) {
      const png = new PNG(view);
      const pngPixelData = png.decodePixels();
      let pixelData: any;
      if (type === 'dicom_png') {
        const pixelDataOriginal = new Int16Array(png.width * png.height);
        for (let i = 0; i < png.width * png.height; i++) {
          pixelDataOriginal[i] =
            pngPixelData[2 * i] * 256 + pngPixelData[2 * i + 1];
        }
        pixelData = new Int16Array(pixelDataOriginal.buffer);
        const wcDefault = 350;
        const wwDefault = 1000;
        const width = png.width;
        const height = png.height;

        image = {
          imageId: type + new Date().getTime().toString().slice(-5),
          minPixelValue: -32768,
          maxPixelValue: 32767,
          slope: 1.0,
          intercept: 0,
          windowCenter: wcDefault,
          windowWidth: wwDefault,
          render: cornerstone.renderGrayscaleImage,
          getPixelData: () => pixelData,
          rows: height,
          columns: width,
          height,
          originalWidth: width,
          originalHeight: height,
          width,
          color: false,
          columnPixelSpacing: 1.0,
          rowPixelSpacing: 1.0,
          invert: false,
          sizeInBytes: width * height * 2,
        };
      } else {
        const area = png.width * png.height;
        const color = [255, 255, 0];
        let whiteBoard: any;
        if (type === '1png') {
          whiteBoard = this.transform8Uint(
            pngPixelData,
            png.width,
            png.height,
            color
          );
        } else {
          whiteBoard = pngPixelData;
        }
        pixelData = new Uint16Array(whiteBoard);

        image = {
          imageId: type + new Date().getTime().toString().slice(-5),
          minPixelValue: 0,
          maxPixelValue: 255,
          slope: 1.0,
          intercept: 0,
          windowCenter: 128,
          windowWidth: 256,
          render: cornerstone.renderColorImage,
          getPixelData: () => pixelData,
          rows: png.height,
          columns: png.width,
          height: png.height,
          width: png.width,
          color: true,
          columnPixelSpacing: 1.0,
          rowPixelSpacing: 1.0,
          invert: false,
          sizeInBytes: area * 4,
        };
      }
    } else if (type === 'bm') {
      const params = this.decodeBmHead(view.slice(0, 128));
      image = this.decodeBmData(view.slice(128), params);
    }
    console.log('type:', type, image);
    return image;
  }

  transform8Uint(
    oneBytePixels: any,
    width: number,
    height: number,
    colorDisease: any
  ): any {
    const pixelDataOriginal = new Uint8Array(width * height * 4);
    const b = [1, 2, 4, 8, 16, 32, 64, 128];
    const redu = width % 8;
    let widthPNG = redu ? width + (8 - redu) : width;
    widthPNG = widthPNG / 8;

    for (let y = 0; y < height; y++) {
      const linePos = y * width * 4;
      for (let x = 0; x < widthPNG; x++) {
        const idxPNG = y * widthPNG + x;
        let idxLine = x * 8;
        let idxRGBA = linePos + idxLine * 4;
        for (let iBit = 7; iBit >= 0; iBit--) {
          // tslint:disable-next-line:no-bitwise
          if (oneBytePixels[idxPNG] & b[iBit]) {
            pixelDataOriginal[idxRGBA] = colorDisease[0];
            pixelDataOriginal[idxRGBA + 1] = colorDisease[1];
            pixelDataOriginal[idxRGBA + 2] = colorDisease[2];
            pixelDataOriginal[idxRGBA + 3] = 255;
          }
          idxRGBA += 4;
          idxLine += 4;
          if (idxLine >= width * 4) {
            break;
          }
        }
      }
    }
    return pixelDataOriginal;
  }

  decodeBmHead(headBuffer: Uint8Array): any {
    let list = [
      String.fromCharCode.apply(null, new Uint8Array(headBuffer.slice(0, 4))),
    ];
    list = list.concat(...new Uint32Array(headBuffer.buffer.slice(4, 36)));
    list = list.concat(...new Float32Array(headBuffer.buffer.slice(36, 60)));

    console.log('list>>:', list);
    /*
    enum PixelFormat
        // 已处理

        * {summary}{Graylevel, unsigned 16bpp image.}
        * {description}{The image is graylevel. Each pixel is unsigned and stored in two bytes.}
        PixelFormat_Grayscale16 = 4,

        * {summary}{Graylevel, signed 16bpp image.}
        * {description}{The image is graylevel. Each pixel is signed and stored in two bytes.}
        PixelFormat_SignedGrayscale16 = 5,

        * {summary}{Graylevel 8bpp image.}
        * {description}{The image is graylevel. Each pixel is unsigned and stored in one byte.}
        PixelFormat_Grayscale8 = 3,

        * {summary}{Color image in RGBA32 format.}
        * {description}{This format describes a color image. The pixels are stored in 4
        * consecutive bytes. The memory layout is RGBA.}
        PixelFormat_RGBA32 = 2,

        * {summary}{Graylevel, floating-point image.}
        * {description}{The image is graylevel. Each pixel is floating-point and stored in 4 bytes.}
        PixelFormat_Float32 = 6,

        // This is the memory layout for Cairo (for internal use in Stone of Orthanc)
        PixelFormat_BGRA32 = 7,

        * {summary}{Graylevel, unsigned 32bpp image.}
        * {description}{The image is graylevel. Each pixel is unsigned and stored in 4 bytes.}
        PixelFormat_Grayscale32 = 8,

        * {summary}{Graylevel, unsigned 64bpp image.}
        * {description}{The image is graylevel. Each pixel is unsigned and stored in 8 bytes.}
        PixelFormat_Grayscale64 = 10
    };
     */

    // ['BM', 800, 600, 4800, 3, 16, 0, 9, 0, 0, 1, 0, 0.3966499865055084, 0.3966499865055084]
    // ['BM', 1056, 594, 3168, 3, 8, 0, 1, 0, 0, 1, 0, 0, 0]
    const props = [
      'name', // 2            //
      'width', // 4           // 512
      'height', // 4          // 512
      'pitch', // 4          // 1024
      'sampleOfPixel', // 4   // 1     | 3
      'depth', // 4           // 16    | 8
      'signed', // 4          // 0 | 1 | 0
      'format', // 4          // 4 | 5 | 1 | 9
      'invert', // 4          // 4 | 5 | 1 | 9
      'window_center', // 4   // format Float32Array
      'window_width', // 4
      'rescale_slope', // 4
      'rescale_intercept', // 4
      'pixel_spacing_x', // 4
      'pixel_spacing_y', // 4
    ];

    const params = {};
    props.forEach((item, index) => {
      params[item] = list[index];
    });
    console.log(params, headBuffer);
    return params;
  }

  decodeBmData(buffer: Uint8Array, params: any): any {
    let {
      // tslint:disable-next-line:prefer-const
      name,
      // tslint:disable-next-line:prefer-const
      signed,
      // tslint:disable-next-line:prefer-const
      width,
      // tslint:disable-next-line:prefer-const
      height,
      // tslint:disable-next-line:prefer-const
      invert = 1,
      // tslint:disable-next-line:prefer-const
      format,
      // tslint:disable-next-line:prefer-const
      pixel_spacing_x = 1,
      // tslint:disable-next-line:prefer-const
      pixel_spacing_y = 1,
      window_center,
      window_width,
      // tslint:disable-next-line:prefer-const
      rescale_intercept = 1,
      // tslint:disable-next-line:prefer-const
      rescale_slope = 1,
    } = params;

    let pixelArray: any;
    if (name === 'BMZS') {
      pixelArray = fzstd.decompress(buffer);
    } else {
      pixelArray = pako.inflate(buffer);
    }

    let pixelBufferFormat: string;
    let isColor = false;

    if (format === 1) {
      const buf = new ArrayBuffer((pixelArray.length / 3) * 4);
      let pixels: Int8Array | Uint8Array;
      if (signed) {
        pixels = new Int8Array(buf);
        // pixelBufferFormat = 'Int8';
      } else {
        pixels = new Uint8Array(buf);
        // pixelBufferFormat = 'Uint8';
      }
      pixelArray = this.convertPixel(pixels, pixelArray);
    } else if (format === 9) {
      // pixelBufferFormat = 'Uint8';
      const currentIndex = pixelArray.length / 3 / params.width / params.height;
      const pixels = new Uint8Array((pixelArray.length / 3) * currentIndex * 4);
      let index = 0;
      for (let i = 0; i < pixelArray.length; i += 3 * currentIndex) {
        pixels[index++] = pixelArray[i + 1];
        pixels[index++] = pixelArray[i + currentIndex + 1];
        pixels[index++] = pixelArray[i + 2 * currentIndex + 1];
        pixels[index++] = 255;
      }
      pixelArray = pixels;
    } else if (format === 3) {
      // pixelBufferFormat = 'Uint8';
    } else {
      if (signed) {
        pixelArray = new Int16Array(pixelArray.buffer);
        // pixelBufferFormat = 'Int16';
      } else {
        pixelArray = new Uint16Array(pixelArray.buffer);
        // pixelBufferFormat = 'Uint16';
      }
    }

    if ([1, 2, 7, 9].includes(format)) {
      isColor = true;
    }

    const { minPixelValue, maxPixelValue } = this.getPixelValues(pixelArray);

    if (!window_center || !window_width) {
      if (!isColor) {
        window_center = (maxPixelValue - minPixelValue) / 2 + minPixelValue;
        window_width = maxPixelValue - minPixelValue;
      } else {
        window_center = 128;
        window_width = 256;
      }
    }

    return {
      imageId: 'dicomBm_' + new Date().getTime().toString().slice(-5),
      maxPixelValue,
      minPixelValue,
      slope: rescale_slope,
      intercept: rescale_intercept,
      windowCenter: window_center,
      windowWidth: window_width,
      render: cornerstone.renderGrayscaleImage,
      getPixelData: () => pixelArray,
      rows: height,
      columns: width,
      width,
      height,
      originalWidth: width,
      originalHeight: height,
      color: isColor,
      columnPixelSpacing: pixel_spacing_y,
      rowPixelSpacing: pixel_spacing_x,
      invert: !!invert,
      isSigned: !!signed,
      sizeInBytes: pixelArray.byteLength,
    };
  }

  private convertPixel(
    targetPixel: Uint8Array | Int8Array,
    pixelArray: Uint8Array
  ): Uint8Array | Int8Array {
    let index = 0;
    for (let i = 0; i < pixelArray.length; i += 3) {
      targetPixel[index++] = pixelArray[i];
      targetPixel[index++] = pixelArray[i + 1];
      targetPixel[index++] = pixelArray[i + 2];
      targetPixel[index++] = 255;
    }
    return targetPixel;
  }

  private getPixelValues(
    pixelArray: Uint8Array | Int16Array | Uint16Array
  ): { minPixelValue: number; maxPixelValue: number } {
    let minPixelValue = Number.MAX_VALUE;
    let maxPixelValue = Number.MIN_VALUE;
    const len = pixelArray.length;
    for (let i = 0; i < len; i++) {
      const pixel = pixelArray[i];
      minPixelValue = Math.min(minPixelValue, pixel);
      maxPixelValue = Math.max(maxPixelValue, pixel);
    }
    return { minPixelValue, maxPixelValue };
  }
}
