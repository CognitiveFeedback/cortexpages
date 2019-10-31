import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { Point2D } from '../products/software/Point2D';
import { PixelItem } from '../products/software/PixelItem';

const runRemote: boolean = true;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private httpClient: HttpClient) { }

  baseMessageService = runRemote ? 'http://api.neocortex.com.au/api/message' : 'http://localhost:52955/api/message';
  basePixelService = runRemote ? 'http://api.neocortex.com.au/api/Pixel' : 'http://localhost:52955/api/Pixel';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error} ${JSON.stringify(error.error)}`);
    }
    // return an observable with a user-facing error message
    return throwError('There was an error dude.');
  };

  loadByGuid(guid: string): Observable<PixelItem[]> {
    return this.httpClient.get<PixelItem[]>(`${this.basePixelService}/loadByGuid?guid=${guid}`, this.httpOptions)
      .pipe(map(data => {
        let result: PixelItem[] = [];
        for (let i = 0; i < data.length; i++) {
          let d: any = data[i];
          let a = new Point2D(d.fromPointX, d.fromPointY);
          let b = new Point2D(d.toPointX, d.toPointY);
          let c = new Point2D(d.dragFromPixelX, d.dragFromPixelY);
          let e = new Point2D(d.dragToPixelX, d.dragToPixelY);
          let item = new PixelItem(a, b, c, e, null);
          item.png64 = d.png64;
          item.sequenceGuid = d.sequenceId;
          item.sequence = d.sequence;
          result.push(item);
        }
        return result;
      }))
      .pipe(catchError(this.handleError));
  }

  GetCatalog(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(`${this.basePixelService}/GetCatalog`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }


  public getMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.baseMessageService}/getMessages`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public saveMessage(model: any): Observable<any> {
    return this.httpClient.post(`${this.baseMessageService}/saveMessage`, model, this.httpOptions).pipe(catchError(this.handleError));
  }

  public getPixelItem(): Observable<PixelItem[]> {
    return this.httpClient.get<Message[]>(`${this.basePixelService}/getPixelItem`, this.httpOptions)
      .pipe(map(data => {
        let result: PixelItem[] = [];
        for (let i = 0; i < data.length; i++) {
          let d: any = data[i];
          let a = new Point2D(d.fromPointX, d.fromPointY);
          let b = new Point2D(d.toPointX, d.toPointY);
          let c = new Point2D(d.dragFromPixelX, d.dragFromPixelY);
          let e = new Point2D(d.dragToPixelX, d.dragToPixelY);
          let item = new PixelItem(a, b, c, e, null);
          item.png64 = d.png64;
          item.sequenceGuid = d.sequenceId;
          item.sequence = d.sequence;
          result.push(item);
        }
        return result;
      }))
      .pipe(catchError(this.handleError));
  }

  public savePixelItem(items: PixelItem[]): Observable<any> {
    let request = [];
    for (let i = 0; i < items.length; i++) {
      let model = items[i];
      let data = {
        fromPointX: model.fromPoint.x,
        toPointX: model.toPoint.x,
        dragFromPixelX: model.dragFromPixel.x,
        dragToPixelX: model.dragToPixel.x,
        fromPointY: model.fromPoint.y,
        toPointY: model.toPoint.y,
        dragFromPixelY: model.dragFromPixel.y,
        dragToPixelY: model.dragToPixel.y,
        png64: model.image.src,
        sequenceId: model.sequenceGuid,
        sequence: model.sequence,
        name: ''
      };
      request.push(data);
    }
    return this.httpClient.post(`${this.basePixelService}/SavePixelItems`, request, this.httpOptions).pipe(catchError(this.handleError));
  }
}
