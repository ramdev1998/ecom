import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { product } from '../product.modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: product[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<product[]>('/assets/products.json').subscribe((res) => {
      this.products = res;
    });
  }

  onAddToCart(index: number) {
    console.log(index);
  }
  onDetail(index: number) {
    this.router.navigate(['product-detail'], {
      queryParams: {
        id: index,
      },
    });
  }
}
