import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) { }
  url = `http://localhost:3000/send-mail`;
  sendEmail(data, url = this.url) {
    return this.http.post(url, data, {responseType: 'text'});
  }
}
