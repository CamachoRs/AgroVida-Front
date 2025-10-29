import { Component } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";

@Component({
  selector: 'app-news-component',
  imports: [NavComponent],
  templateUrl: './news-component.html',
  styleUrl: './news-component.css'
})
export class NewsComponent {
  activeLink = "news";
}
