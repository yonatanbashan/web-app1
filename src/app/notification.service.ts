import { Subject } from 'rxjs';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { ConnectionService } from './connection.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { Notification } from './models/notification.model';

@Injectable()
export class NotificationService {

  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  private serverAddress = this.connectionService.getServerAddress();
  private notifications: Notification[];
  private notifySubj: Subject<Notification[]> = new Subject<Notification[]>();

  getNotificationSubject() {
    return this.notifySubj;
  }

  markAllAsRead() {
    this.http.get(this.serverAddress + 'api/notifications/mark/').subscribe();
  }

  clearNotifications() {
    this.http.get(this.serverAddress + 'api/notifications/clear/')
    .subscribe(() => {
      this.updateNotifications();
    });
  }

  addNotification(text: string, type: string, objectLinkId: string, receiverId: string) {
    const myId = this.authService.getActiveUserId();
    const request = {
      text: text,
      receiverId: receiverId,
      senderId: myId,
      type: type,
      objectLinkId: objectLinkId
    }
    this.http.post(this.serverAddress + 'api/notifications/add/', request).subscribe((response) => {

    });
  }

  updateNotifications() {
    this.http.get<any>(this.serverAddress + 'api/notifications/all/').subscribe(response => {
      this.notifications = response.notifications;
      this.notifySubj.next(this.notifications);
    });
  }

  getNumNotification() {
    return this.notifications.length;
  }

  getNumUnreadNotifications() {
    const unread = this.notifications.filter(n => !n.read);
    return unread.length;
  }

  getNotifications() {
    this.updateNotifications();
    return this.notifications;
  }


}
