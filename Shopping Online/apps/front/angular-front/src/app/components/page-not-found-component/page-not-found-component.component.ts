import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found-component',
  templateUrl: './page-not-found-component.component.html',
  styleUrls: ['./page-not-found-component.component.css']
})
export class PageNotFoundComponentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onGoHome (): void{
    this.router.navigate(['/']);
    return;
  }
}
