import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsComponent } from './posts.component';
import { ApiService, Post } from '../../services/api.service';
import { of, throwError } from 'rxjs';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  const mockPosts: Post[] = [
    { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
    { userId: 1, id: 2, title: 'Post 2', body: 'Body 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PostsComponent],
      providers: [ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    expect(component.loading).toBeTrue();
    
    component.ngOnInit();
    
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
    
    expect(component.posts.length).toBe(2);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading posts fails', () => {
    component.cargarPosts();
    
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.error(new ErrorEvent('Network error'));
    
    expect(component.error).toBe('Error al cargar los posts');
    expect(component.loading).toBeFalse();
  });
});