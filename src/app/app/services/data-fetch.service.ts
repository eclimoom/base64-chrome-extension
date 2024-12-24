import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {

  private readonly defaultUrl = 'http://192.168.6.35/predicts/1.2.156.600734.762202257.139620.1730459902.8499.5400253/biomind/98117e9d-a22b-11ef-a3bc-1b7ba874f173/mask/404754_13.png';
  private readonly defaultToken = 'Bearer eyJhbGciOiJIUzUxMiIsImlhdCI6MTczNDkzNTU1MSwiZXhwIjoxNzM1MDIxOTUxfQ.eyJ1c2VybmFtZSI6ImhlanVuamkifQ.v2201EENmdEQLRoUKvqXF7cyJx4XQZLH3tE50M9dBg1xTz03ysqP9gMrz4R9oFHhysk98Q3uVi6ozmP-HGD65A';

  constructor() {
  }

  getFetchData(url: string = this.defaultUrl, token: string = this.defaultToken): Observable<any> {
    const headers: any = {
      Authorization: token,
      'Content-Type': 'arrayBuffer'
    };
    return from(fetch(url, headers).then(response => response.arrayBuffer()));
  }

  // 根绝文件流的判断文件格式
  getFileType(data: any, endData: any): { type: string, isImg: boolean } {
    const buffer = new Uint8Array(data);
    // console.log('buffer', buffer);
    let type = 'unknown';
    // 图片格式
    let isImg = false;
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      type = 'jpeg';
      isImg = true;
    } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      type = 'png';
      isImg = true;
      // const end = new Uint8Array(endData);
      // tslint:disable-next-line:max-line-length
      // if (buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A && buffer[8] === 0x1A ) {
      //   type = 'dicom_png';
      // } else
      if (buffer[18] === 0x02 && buffer[19] === 0x00 && buffer[22] === 0x02 && buffer[23] === 0x00) {
        type = 'dicom_png';
        if (buffer[24] === 0x01 && buffer[29] === 0xDC && buffer[30] === 0x03 && buffer[31] === 0xE9 && buffer[32] === 0x57) {
          type = '1png';
        }
      }

    } else if (buffer[0] === 0x47 && buffer[1] === 0x49) {
      type = 'gif';
      isImg = true;
    } else if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
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
    } else if (buffer[0] === 0x50 && buffer[1] === 0x4B) {
      type = 'zip';
    } else if (buffer[0] === 0x52 && buffer[1] === 0x61) {
      type = 'rar';
    } else if (buffer[0] === 0x7B && buffer[1] === 0x5C) {
      type = 'json';
    }
    return {type, isImg};

  }


}
