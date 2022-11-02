import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { product } from './iProduct';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products!: product[];
  cartProductList: product[] = [];

  cartCount = 0;
  public cartItemCount = new BehaviorSubject<number>(this.cartCount);

  public updateProductEmit = new Subject<void>();

  constructor(private http: HttpClient) {}

  setProducts() {
    this.http.get<product[]>('/assets/products.json').subscribe((res) => {
      this.products = res;
    });
  }

  getProducts() {
    this.setProducts();
    return this.http.get<product[]>('/assets/products.json');
  }

  getCart() {
    return JSON.parse(localStorage.getItem('cartProduct')!);
  }

  loadCartData() {
    this.cartProductList = this.getCart();
  }

  setItemInLocalStorage(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  onDelete(index: number) {
    let filteredProducts = this.cartProductList.filter(item => +item.id !== +index);
    this.cartProductList = filteredProducts;
    this.setItemInLocalStorage('cartProduct', filteredProducts);
    this.cartItemCount.next(--this.cartCount);
    this.updateProductEmit.next();
  }

  onIncrementQty(index: number) {
    debugger;
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

  setItemsIntoCarts(product: any) {
    const productExistInCart = this.cartProductList.find(
      ({ id }) => +id === +product.id
    );
    if (!productExistInCart) {
      this.cartItemCount.next(++this.cartCount);
      this.cartProductList.push({ ...product, qty: 1 });
      this.setItemInLocalStorage('cartProduct', this.cartProductList);

      return;
    }
    productExistInCart.qty! += 1;
    this.setItemInLocalStorage('cartProduct', this.cartProductList);
  }

  onEditProduct(product: product) {
    const prod = this.products.find((item) => item.id === product.id);
    console.log(prod);
  }
}
