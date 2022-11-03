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
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  products: product[] = [];
  isOpen = false;
  shippingList!: Ishipping[];
  selectedShipping!: string;
  selectedShippingPrice!: string;
  productSlice: product[] = [];

  constructor(private producSvc: ProductService, private http: HttpClient) {}

  startEdit(id: number): void {
    this.products[id].edit = true;
  }

  ngOnInit(): void {
    this.producSvc.loadCartData();
    this.loadData();
    this.fetchShippingMethod();
    this.producSvc.updateProductEmit.subscribe((res) => {
      this.loadData();
    });
  }

  private loadData() {
    this.productSlice = this.products = this.parseData(this.producSvc.getCart() || []);
    console.log(this.products);
  }

  parseData(datas: any[]) {
    return datas.reduce((acc, item) => {
      acc.push({ ...item, edit: false });
      return acc;
    }, []);
  }

  onRemoveQty(index: number) {
    console.log(index);
    this.producSvc.onDecrementQty(index);
    this.producSvc.updateProductEmit.subscribe((_) => {
      this.loadData();
    });
  }

  onIncrementQty(index: number) {
    this.producSvc.onIncrementQty(index);
    this.producSvc.updateProductEmit.subscribe((_) => {
      this.loadData();
    });
  }

  onEdit(id: number) {
    console.log(id, 'iiid');
    // this.producSvc.onEditProduct()
  }
  onDelete(index: number) {
    console.log(index);
    this.producSvc.onDelete(index);
  }

  getFinalTotal() {
    return this.products.reduce((acc, item) => {
      return (acc += +item.qty! * +item.price);
    }, 0);
  }

  fetchShippingMethod() {
    this.producSvc.fetchShippingMethod().subscribe((res) => {
      this.shippingList = res;
    });
  }

  onShippingChange(event: any) {
    if (event.target.value) {
      this.selectedShipping = this.shippingList[+event.target.value].name;
      this.selectedShippingPrice = this.shippingList[+event.target.value].price;
    } else {
      this.selectedShipping = '';
      this.selectedShippingPrice = '';
    }
  }

  onSave(id: number, product: product) {
    // this is not valid but for now due to no backend added
    this.products[id] = product;
    this.products[id].edit = false;
  }

}
