import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-loader',
    template:
        `<div id="preloader">
            <div class="inner">
                <div class="spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>`
})

export class LoaderComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}



