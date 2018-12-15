import { dateFormat } from 'src/app/common';
import { Component, OnInit, Input } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent implements OnInit {

  constructor() { }

  @Input() notification: Notification;
  dateStr: string;

  ngOnInit() {
    this.dateStr = dateFormat(new Date(this.notification.createDate));
  }

}
