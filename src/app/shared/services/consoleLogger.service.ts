import { isDevMode } from '@angular/core';


export class ConsoleLogger {
    static logger(data, msg?: string) {
        if (isDevMode()) {
            if (msg) {
                console.trace(msg + '', data);
            } else {
                console.trace(data);
            }
        }
    }
}