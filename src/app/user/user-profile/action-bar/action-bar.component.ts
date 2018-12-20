import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/users.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { sortUsersByName } from 'src/app/common/'
import { NotificationsComponent } from 'src/app/notifications/notifications.component';
import { faPencilAlt, faIdCard, faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {

  faPencilAlt = faPencilAlt;
  faIdCard = faIdCard;
  faBell = faBell;

  constructor(
    private usersService: UsersService,
    private router: Router,
    public dialog: MatDialog
    ) { }
  followedUsers: User[];
  @Input() notifyNum: number;
  dialogRef: any;

  ngOnInit() {
    this.usersService.getFollowedUsers()
    .subscribe((users) => {
      this.followedUsers = users.sort(sortUsersByName);
    });
  }

  getNotificationText() {
    let text = "Notifications";
    if (this.notifyNum > 0) {
      text += ` (${this.notifyNum})`;
    }
    return text;
  }

  onNewPost() {
    this.router.navigate(['/new-post']);
  }

  onEditProfile() {
    this.router.navigate(['/user-edit']);
  }

  onNotifications() {
    this.notifyNum = 0;
    this.dialogRef = this.dialog.open(NotificationsComponent, {});
  }

}
