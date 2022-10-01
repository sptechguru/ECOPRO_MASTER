import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';

@Injectable()
export class OnRouteService {

    previousUrl: any;

    constructor(private router: Router) {
        this.router.events.filter(e => e instanceof NavigationEnd)
            .subscribe({
                next: (event: any) => {
                    this.previousUrl = event.url;
                }
            });

        this.router.events.filter(e => e instanceof NavigationStart)
            .subscribe({
                next: (event: any) => {
                }
            });
    }
}
