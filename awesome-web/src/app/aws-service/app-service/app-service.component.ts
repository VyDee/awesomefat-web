import { Observable } from 'rxjs';
import { ExampleProduct } from './../../shared/product-info';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-service',
  templateUrl: './app-service.component.html',
  styleUrls: ['./app-service.component.scss']
})
export class AppServiceComponent implements OnInit {
  exampleProductsCollection: AngularFirestoreCollection<ExampleProduct>;
  exampleProducts: Observable<ExampleProduct[]>;

  exampleProductArr = [];
  newSpiltExampleArr = [];


  constructor(
    private afs: AngularFirestore
  ) {
    this.exampleProductsCollection = afs.collection<ExampleProduct>('ex-prod');
    this.exampleProducts = this.exampleProductsCollection.valueChanges();
  }

  ngOnInit(): void {
    this.getExProducts().subscribe((products) => {
      this.exampleProductArr = products;
      console.log('old ', this.exampleProductArr);
      this.newSpiltExampleArr = this.spiltArrayIntoChunk(this.exampleProductArr, 6);
      console.log('new ', this.newSpiltExampleArr);
    });

  }

  getExProducts() {
    return this.exampleProducts;
  }

  private spiltArrayIntoChunk (arr, perChunk) {
    let result = arr.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);

    return result;
  }

}

// var perChunk = 2 // items per chunk

// var inputArray = ['a','b','c','d','e']

// var result = inputArray.reduce((resultArray, item, index) => {
//   const chunkIndex = Math.floor(index/perChunk)

//   if(!resultArray[chunkIndex]) {
//     resultArray[chunkIndex] = [] // start a new chunk
//   }

//   resultArray[chunkIndex].push(item)

//   return resultArray
// }, [])

// console.log(result); // result: [['a','b'], ['c','d'], ['e']]
