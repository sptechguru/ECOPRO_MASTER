import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-preferance',
  templateUrl: './language-preferance.component.html',
  styleUrls: ['./language-preferance.component.css']
})
export class LanguagePreferanceComponent implements OnInit {
  typesOfLanguage: string[] = ['English', 'हिन्दी', 'मराठी', 'മലയാളം'];
  constructor() { }

  ngOnInit(): void {
  }

}
