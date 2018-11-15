import { Post } from './../models/post.model';

export function sortPostsByDate(p1: Post, p2: Post) {
  if (p1.createDate > p2.createDate) {
    return -1;
  } else {
    return 1;
  }
}
