import { Component, OnInit, OnDestroy } from '@angular/core';
import { product } from '../iProduct';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { Slick } from 'ngx-slickjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: product[] = [];
  private prodSub!: Subscription;

  constructor(private prodService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.prodService.getProducts().subscribe((res) => {
      this.products = res;
    });
  }

  onAddToCart(product: product) {
    this.prodService.setItemsIntoCarts(product);
  }
  onDetail(index: number) {
    this.router.navigate(['product-detail'], {
      queryParams: {
        id: index,
      },
    });
  }

  // slider
  config: Slick.Config = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    dots: true,
    autoplay: true,
    autoplaySpeed: 2000
  }

  ngOnDestroy(): void {
    if (this.prodSub) this.prodSub.unsubscribe();
  }
}
