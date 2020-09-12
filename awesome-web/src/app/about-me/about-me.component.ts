import { Routes } from '@angular/router';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  currentSection = 'about-me';
  spiedTag = 'DIV';

  constructor(
    private viewportScroller: ViewportScroller,
    private _el: ElementRef,
  ) { }

  ngOnInit(): void {
  }

  // public onSectionChange(sectionId: string) {
  //   this.currentSection = sectionId;
  //   console.log("onSectionChange ",sectionId);
  // }

  public onClick(elementId: string) {
    this.currentSection = elementId;
    this.viewportScroller.scrollToAnchor(elementId);
    console.log(this.viewportScroller.scrollToAnchor(elementId));
  }

  @HostListener('window: scroll', ['$event'])
  onScroll() {
    //current scroll posisiton on the Y axis
    const verticalOffset = window.pageYOffset + 100 || 0;

    //get aws-content children
    const children = this._el.nativeElement.children[0].children[1].children;
    console.log(">> _el.nativeElement.child[0]: ", this._el.nativeElement.children[0]);
    console.log(">>> ..... children[1] ", this._el.nativeElement.children[0].children[1]);
    console.log(">>> ..... children[1].children ", children);

    for (let i = 0; i < children.length; i ++) {
      const element = children [i];
      console.log(element);

      console.log(element.tagName);
      if(element.tagName === this.spiedTag) {
        // compare element position counting from the top with the vertical offset
        if (element.offsetTop < verticalOffset) {
          this.currentSection = element.id;
        }
      }
    }
  }
}
