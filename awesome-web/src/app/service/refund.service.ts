import { OrderRefund } from './../shared/order-refund';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefundService {
  refundOrdersCollection: AngularFirestoreCollection<OrderRefund>;
  refundOrder: Observable<OrderRefund[]>;
  refundOrderDoc: AngularFirestoreDocument<OrderRefund>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.refundOrdersCollection = this.afs.collection<OrderRefund>('refund');
    this.refundOrder = this.refundOrdersCollection.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as OrderRefund;
        data.orderId = a.payload.doc.id;
        return data;
      })
    }))
  }

  getRefunds() {
    return this.refundOrder;
  }

  addRefund(refund: OrderRefund) {
    const id = this.afs.createId();
    refund.refundId = id;
    this.refundOrdersCollection.add(refund);
  }
}
