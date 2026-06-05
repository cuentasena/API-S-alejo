import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, Post } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch posts from API', () => {
    const mockPosts: Post[] = [
      { userId: 1, id: 1, title: 'Test Post 1', body: 'Body 1' },
      { userId: 1, id: 2, title: 'Test Post 2', body: 'Body 2' }
    ];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch a single post by ID', () => {
    const mockPost: Post = { userId: 1, id: 1, title: 'Test Post', body: 'Body' };

    service.getPostById(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should create a new post', () => {
    const newPost: Partial<Post> = { title: 'New Post', body: 'New Body', userId: 1 };
    const mockResponse: Post = { id: 101, userId: 1, title: 'New Post', body: 'New Body' };

    service.createPost(newPost).subscribe(post => {
      expect(post).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush(mockResponse);
  });

  it('should update a post', () => {
    const updateData: Partial<Post> = { title: 'Updated Title' };
    const mockResponse: Post = { id: 1, userId: 1, title: 'Updated Title', body: 'Original Body' };

    service.updatePost(1, updateData).subscribe(post => {
      expect(post).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should delete a post', () => {
    service.deletePost(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});