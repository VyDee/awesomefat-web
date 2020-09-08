import { Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  currentSection = 'about-me';

  constructor(
    private viewportScroller: ViewportScroller,
  ) { }

  ngOnInit(): void {
  }

  public onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
    console.log("onSectionChange ",sectionId);
  }

  public onClick(elementId: string) {
    this.currentSection = elementId;
    this.viewportScroller.scrollToAnchor(elementId);
    console.log(this.viewportScroller.scrollToAnchor(elementId))
  }
}
