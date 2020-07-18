import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { User } from '@app/_models/user';
import { Role } from '@app/_models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnDestroy {
  private loadingSubject$: BehaviorSubject<boolean>;
  private userId: number;

  roles = Role;
  editForm: FormGroup;
  loading$: Observable<boolean>;
  paramsSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject$.asObservable();
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      role: new FormControl('', Validators.required),
    });
    this.loadUserData();
  }

  ngOnDestroy() {
    this.loadingSubject$.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  private loadUserData() {
    this.loadingSubject$.next(true);
    this.paramsSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const userId: number = +params.get('user_id');
          return this.userService.findById(userId);
        })
      )
      .subscribe((user) => {
        this.loadingSubject$.next(false);
        this.userId = user.id;
        this.editForm.get('name').setValue(user.name);
        this.editForm.get('email').setValue(user.email);
        this.editForm.get('role').setValue(user.role['id']);
      });
  }

  public edit() {
    this.loadingSubject$.next(true);
    const DATA = new User();
    DATA.id = this.userId;
    DATA.name = this.editForm.get('name').value;
    DATA.email = this.editForm.get('email').value;
    DATA.role = Role[String(this.editForm.get('role').value)];
    this.userService
      .update(DATA)
      .pipe(take(1))
      .subscribe(
        (resp) => {
          this.loadingSubject$.next(false);
          this.snackBarService.show(true, `User has been updated.`);
          this.router.navigate(['/users']);
        },
        (error) => {
          this.snackBarService.show(false, `User edition failed due to ${formatError(error)}.`);
          this.loadingSubject$.next(false);
        }
      );
  }

  public cancel() {
    this.router.navigate(['/users']);
  }
}
