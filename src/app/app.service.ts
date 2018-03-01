
import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
    private animals: string[];
    private result: string[];

    constructor() {
        this.animals = ['golden retriever', 'french bulldog', 'german shepherd', 'alaskan husky',
            'jack russel terrier', 'boxer', 'chow chow', 'pug', 'akita', 'corgi', 'labrador'];
    }

    public getDogs(count: number) {
        this.result = [];

        if (count > this.animals.length) {
            count = this.animals.length;
        }

        for (let i = 0; i < count; i++) {
            this.result.push(this.animals[i]);
        }

        return this.result;
    }
}
