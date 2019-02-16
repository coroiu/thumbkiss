import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application/application.service';
import { IConnection } from '../network/iconnection';

@Component({
  selector: 'app-virtual-glass',
  templateUrl: './virtual-glass.component.html',
  styleUrls: ['./virtual-glass.component.scss']
})
export class VirtualGlassComponent implements OnInit {
  private connection: IConnection;

  constructor(private application: ApplicationService) {
    this.connection = this.application.connection;
  }

  ngOnInit() {
  }

}
