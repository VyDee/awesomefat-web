import { NotificationService } from 'src/app/service/notification.service';
import { Observable } from 'rxjs';
import { UserOrder } from './../shared/order-info';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  shoppingOrdersCollection: AngularFirestoreCollection<UserOrder>;
  shoppingOrder: Observable<UserOrder[]>;
  shoppingOrderDoc: AngularFirestoreDocument<UserOrder>;

  constructor(
    private afs: AngularFirestore,
    private notificationService: NotificationService
  ) {
    this.shoppingOrdersCollection = this.afs.collection<UserOrder>('orders');
    this.shoppingOrder = this.shoppingOrdersCollection.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as UserOrder;
        data.orderId = a.payload.doc.id;
        return data;
      })
    }));
   }

   getOrders() {
     return this.shoppingOrder;
   }

   addOrder(order: UserOrder) {
     const id = this.afs.createId();
     order.orderId = id;
     this.shoppingOrdersCollection.add(order);
     this.notificationService.showSuccess("Your order has succesfully added to the cart")
   }

   deleteOrder(order: UserOrder) {
     this.shoppingOrderDoc = this.afs.doc(`orders/${order.orderId}`);
     this.shoppingOrderDoc.delete();
   }

   updateOrder(order: UserOrder) {
     console.log(order);
    this.shoppingOrderDoc = this.afs.doc(`orders/${order.orderId}`);
    this.shoppingOrderDoc.update(order);
   }
}
