import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';

describe('App', () => {
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  function flushTasks(): void {
    const req = httpController.expectOne('/api/tasks.json');
    req.flush([
      { id: 1, title: 'Review legacy controller', done: false, priority: 'high' },
      { id: 2, title: 'Replace $scope watchers', done: false, priority: 'medium' },
      { id: 3, title: 'Upgrade to components', done: true, priority: 'low' }
    ]);
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    flushTasks();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render legacy header title', async () => {
    const fixture = TestBed.createComponent(App);
    flushTasks();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-header h1')?.textContent).toContain('Legacy AngularJS App');
  });
});
