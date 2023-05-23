import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NAVIGATION_TREE, NavigationNode } from 'src/app/constants/constants';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vertical-nav',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.css']
})
export class VerticalNavComponent {
  protected dataSource = new MatTreeNestedDataSource<NavigationNode>();
  protected treeControl = new NestedTreeControl<NavigationNode>(
    node => node.children
  );

  constructor() {
    this.dataSource.data = NAVIGATION_TREE;
  }

  protected hasChild = (_: number, node: NavigationNode) => !!node.children && node.children.length > 0;
}
