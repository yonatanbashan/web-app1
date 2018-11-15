import { User } from './../models/user.model';
import { Post } from './../models/post.model';

export function sortPostsByDate(p1: Post, p2: Post) {
  if (p1.createDate > p2.createDate) {
    return -1;
  } else {
    return 1;
  }
}


export function sortUsersByName(u1: User, u2: User) {
  if (u1.username <= u2.username) {
    return -1;
  } else {
    return 1;
  }
}
