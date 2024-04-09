import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {CartType} from "../../../../types/cart.type";
import {FavoriteService} from "../../services/favorite.service";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'favourite-card',
  templateUrl: './favourite-card.component.html',
  styleUrls: ['./favourite-card.component.scss']
})
export class FavouriteCardComponent implements OnInit {
  @Input() product!: FavoriteType;
  @Input() countInCart: number | undefined = 0;
  @Output() removeFavorite: EventEmitter<string> = new EventEmitter<string>();
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
  constructor(private favoriteService: FavoriteService, private cartService: CartService) { }

  ngOnInit(): void {
  }

  updateCount(value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.product.countInCart = this.count;
        });
    }
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.product.countInCart = this.count;
      });
  }

  removeFromCart(): void {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.product.countInCart = 0;
        this.count = 1;
      });
  }

  removeFromFavorites() {
    this.removeFavorite.emit(this.product.id);
  }
}
