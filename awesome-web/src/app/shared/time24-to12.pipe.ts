import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time24To12'
})
export class Time24To12Pipe implements PipeTransform {

  transform(time: any): any {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    const part = hour > 12 ? 'pm' : 'am';
    min = (min + '').length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length === 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }

}
