import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { product } from 'src/app/shared/interfaces/iProduct';
import { ProductService } from '../../shared/services/product.service';

export interface Ishipping {
  id: number;
  name: string;
  price: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products: product[] = [];
  isOpen = false
  shippingList!: Ishipping [];
  selectedShipping!: string;
  selectedShippingPrice!: string;

  constructor(private producSvc: ProductService, private http: HttpClient) { }

  ngOnInit(): void {
    this.producSvc.loadCartData();
    this.loadData();
    this.fetchShippingMethod();
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

  fetchShippingMethod() {
    this.producSvc.fetchShippingMethod().subscribe(res => {
      this.shippingList = res;      
    })
  }

  onShippingChange(event: any) {
    if(event.target.value) {
      this.selectedShipping = this.shippingList[+event.target.value].name;
      this.selectedShippingPrice = this.shippingList[+event.target.value].price;
    } else {
      this.selectedShipping = '';
      this.selectedShippingPrice = '';
    }

    console.log(this.selectedShipping,
      this.selectedShippingPrice)
  }

}
