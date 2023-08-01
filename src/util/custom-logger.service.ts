/* eslint-disable prettier/prettier */
import { LoggerService } from '@nestjs/common';

export class CustomLoggerService implements LoggerService {
  private readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private getContextString(): string {
    return `[${this.serviceName}]`;
  }

  private getDate(): string {
    // Given timestamp in UTC
    const utcTimestamp = new Date().toISOString();

    // Step 1: Convert UTC to GMT+5.30
    const utcDate = new Date(utcTimestamp);
    // const gmt530Offset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const gmt530Timestamp = new Date(utcDate.getTime());

    // Step 2: Format the new timestamp as "DD/MM/YYYY, HH:mm:ss"
    const day = String(gmt530Timestamp.getDate()).padStart(2, '0');
    const month = String(gmt530Timestamp.getMonth() + 1).padStart(2, '0');
    const year = gmt530Timestamp.getFullYear();
    const hours = String(gmt530Timestamp.getHours()).padStart(2, '0');
    const minutes = String(gmt530Timestamp.getMinutes()).padStart(2, '0');
    const seconds = String(gmt530Timestamp.getSeconds()).padStart(2, '0');
    const milliseconds = String(gmt530Timestamp.getMilliseconds()).padStart(
      3,
      '0',
    );
    const formattedTimestamp = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}:${milliseconds}`;

    return formattedTimestamp; // Output: 01/08/2023, 09:53:34:01
  }

  log(message: string): void {
    const ctxString = this.getContextString();
    const date = this.getDate();
    console.log(`${date} : ${ctxString} :  ${message}`);
  }

  error(message: string): void {
    const ctxString = this.getContextString();
    const date = this.getDate();
    console.log(`${date} : ${ctxString} : ${message}`);
  }

  warn(message: string): void {
    const ctxString = this.getContextString();
    const date = this.getDate();
    console.log(`${date} : ${ctxString} : ${message}`);
  }

  debug(message: string): void {
    const ctxString = this.getContextString();
    const date = this.getDate();
    console.log(`${date} : ${ctxString} :  ${message}`);
  }

  verbose(message: string): void {
    const ctxString = this.getContextString();
    const date = this.getDate();
    console.log(`${date} : ${ctxString} =>  ${message}`);
  }
}
