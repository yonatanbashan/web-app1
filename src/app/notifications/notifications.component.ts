import { PostsService } from './../posts/posts.service';
import { PostViewComponent } from './../posts/post-view/post-view.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../models/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  constructor(
    private postsService: PostsService,
    private notifyService: NotificationService,
    private router: Router,
    private dialogRef: MatDialogRef<NotificationsComponent>,
    public dialog: MatDialog
  ) { }

  notifications: Notification[] = [];
  notifySubs: Subscription;
  empty: boolean = false;

  ngOnInit() {
    this.notifyService.getNotifications();
    this.notifySubs = this.notifyService.getNotificationSubject().subscribe(notifications => {
      this.notifications = notifications;
      this.updateNotifyStatus();
      this.notifySubs.unsubscribe(); // To avoid 'dynamically changing comments'
      this.notifyService.markAllAsRead();
    });
  }

  ngOnDestroy() {
    this.notifySubs.unsubscribe();
  }

  onClick(notification: Notification) {
    if (notification.type === 'follow') {
      this.dialogRef.close();
      this.router.navigate(['/user', notification.objectLinkId]);
    }

    if (notification.type === 'comment') {
      this.postsService.getPostById(notification.objectLinkId)
      .subscribe(response => {
        let post = response.post;
        post.id = post._id;
        this.dialogRef.close();
        let dialog = this.dialog.open(PostViewComponent, {
          data: {
            post: post,
            userId: notification.receiverId,
            fullDisplay: true
          }
        });
      });
    }

  }

  updateNotifyStatus() {
    if (this.notifications.length > 0) {
      this.empty = false;
    } else {
      this.empty = true;
      setTimeout(() => { this.dialogRef.close() } , 1500)
    }
  }

  onClear() {
    this.notifyService.clearNotifications();
    this.notifications = [];
    this.updateNotifyStatus();

  }

}
