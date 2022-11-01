import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  productIndex: any;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getQueryParams()
  }

  private getQueryParams() {
    this.activatedRoute.queryParams.subscribe(res => {
      this.productIndex = res
      console.log(res)
    })
  }

}
