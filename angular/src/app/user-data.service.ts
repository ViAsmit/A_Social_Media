import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserDataService {

    getUserData: EventEmitter<object> = new EventEmitter();

    constructor() { }
}
