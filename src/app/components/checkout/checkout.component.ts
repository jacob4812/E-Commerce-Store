import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems!: any[];
  total!: number;



  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.cart.value.items;
    this.total = this.cartService.getTotal(this.cartItems);
  }

  submitPaymentForm(): void {
    // Handle payment form submission here
    // For example, send payment details to a payment gateway
    // and navigate to a success page upon successful payment
    console.log('Payment form submitted');
    // After successful payment, navigate to the success page
    this.router.navigate(['/payment-success']);
  }

  calculateTotal() {

  }
}
