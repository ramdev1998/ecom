import { Component, OnInit } from '@angular/core';
import { product } from '../iProduct';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products: product[] = [];

  constructor(private producSvc: ProductService) { }

  ngOnInit(): void {
    this.producSvc.loadCartData();
    this.loadData();
    this.producSvc.updateProductEmit.subscribe(res => {
      this.loadData()
    })
  }

  private loadData() {
    this.products = this.producSvc.getCart();
  }

  onRemoveQty(index: number) {
    console.log(index)
    this.producSvc.onDecrementQty(index);
    this.producSvc.updateProductEmit.subscribe(_ => {
      this.loadData();
    })
  }

  onIncrementQty(index: number) {
    this.producSvc.onIncrementQty(index);
    this.producSvc.updateProductEmit.subscribe(_ => {
      this.loadData();
    })
  }

  onEdit() {
    // this.producSvc.onEditProduct()
  }
  onDelete(index: number) {
    console.log(index);
    this.producSvc.onDelete(index);
  }

  getFinalTotal() {
    return this.products.reduce((acc, item) => {
      return acc += +item.qty! * +item.price
    }, 0)
  }

}
