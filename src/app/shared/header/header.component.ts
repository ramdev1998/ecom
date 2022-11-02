import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/product/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;

  constructor(private prodSvc: ProductService) { }

  ngOnInit(): void {
    this.prodSvc.cartItemCount.subscribe(res => {
      this.cartCount = res;
    })
  }

}
