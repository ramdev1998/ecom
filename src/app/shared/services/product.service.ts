import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Ishipping } from '../../product/cart/cart.component';
import { product } from '../interfaces/iProduct';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products!: product[];
  cartProductList: product[] = [];

  public cartItemCount = new BehaviorSubject<number>(0);

  public updateProductEmit = new Subject<void>();

  constructor(private http: HttpClient) {}

  setProducts() {
    this.http.get<product[]>('/assets/products.json').subscribe((res) => {
      this.products = res;
    });
  }

  getProducts() {
    this.setProducts();
    this.loadCartData();
    return this.http.get<product[]>('/assets/products.json');
  }

  getCart() {
    return JSON.parse(localStorage.getItem('cartProduct')!);
  }

  loadCartData() {
    this.cartProductList = this.getCart() || [];
    setTimeout(() => {
      this.cartItemCount.next(this.cartProductList.length);
    }, 0);
  }

  setItemInLocalStorage(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  onDelete(index: number) {
    let filteredProducts = this.cartProductList.filter(item => +item.id !== +index);
    this.cartProductList = filteredProducts;
    this.setItemInLocalStorage('cartProduct', filteredProducts);
    this.cartItemCount.next(this.cartProductList.length);
    this.updateProductEmit.next();
  }

  onIncrementQty(index: number) {
    const productExistInCart = this.cartProductList.find(
      (item) => +item.id === +index
    );
    if (productExistInCart) {
      productExistInCart.qty! += 1;
    }
    this.setItemInLocalStorage('cartProduct', this.cartProductList);
    this.updateProductEmit.next();
  }

  onDecrementQty(index: number) {
    const productExistInCart = this.cartProductList.find(
      (item) => +item.id === +index
    );
    if (productExistInCart) {
      if (productExistInCart.qty == 1) {
        return;
      }
      productExistInCart.qty! -= 1;
    }
    this.setItemInLocalStorage('cartProduct', this.cartProductList);
    this.updateProductEmit.next();
  }

  setItemsIntoCarts(product: product) {
    const productExistInCart = this.cartProductList.find(
      ({ id }) => +id === +product.id
    );
    if (!productExistInCart) {
      this.cartProductList.push({ ...product, qty: 1 });
      this.cartItemCount.next(this.cartProductList.length);
      this.setItemInLocalStorage('cartProduct', this.cartProductList);

      return;
    }
    productExistInCart.qty! += 1;
    this.setItemInLocalStorage('cartProduct', this.cartProductList);
  }

  onEditProduct(product: product) {
    const prod = this.products.find((item) => item.id === product.id);
  }

  // for the movement added shopping here is should be in separate methosd
  fetchShippingMethod(): Observable<Ishipping[]> {
    return this.http.get<Ishipping[]>('/assets/shipping.json')
  }
}
