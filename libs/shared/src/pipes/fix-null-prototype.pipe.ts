import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FixNullPrototypePipe implements PipeTransform {
  transform(value: any) {
    return JSON.parse(JSON.stringify(value));
  }
}
