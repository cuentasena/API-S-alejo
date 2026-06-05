import { Component, OnInit } from '@angular/core';
import { ApiService, Post } from '../../services/api.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarPosts();
  }

  cargarPosts(): void {
    this.loading = true;
    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los posts';
        this.loading = false;
        console.error(err);
      }
    });
  }
}