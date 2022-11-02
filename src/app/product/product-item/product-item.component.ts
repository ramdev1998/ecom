import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../iProduct';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  prodId!: number;
  product!: product;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productSvc: ProductService
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.loadData();
  }

  private loadData() {
    this.productSvc.getProducts().subscribe((res) => {
      this.product = res.find((item) => +item.id === +this.prodId)!;
    });
  }

  private getQueryParams() {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.prodId = res['id'];
    });
  }

  onAddToCart(product: product) {
    this.productSvc.setItemsIntoCarts(product);
  }
}
