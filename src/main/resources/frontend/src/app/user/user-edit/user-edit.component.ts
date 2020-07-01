import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user.service';
import { formatError } from '@helpers/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { User } from '@app/_models/user';
import { Role } from '@app/_models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit {
  roles = Role;
  editForm: FormGroup;
  loading$: Observable<boolean>;
  private loadingSubject: BehaviorSubject<boolean>;
  private userId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
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

  private loadUserData() {
    this.loadingSubject.next(true);
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const userId: number = +params.get('user_id');
          return this.userService.findById(userId);
        })
      )
      .subscribe((user) => {
        this.loadingSubject.next(false);
        this.userId = user.id;
        this.editForm.get('name').setValue(user.name);
        this.editForm.get('email').setValue(user.email);
        this.editForm.get('role').setValue(user.role['id']);
      });
  }

  edit() {
    this.loadingSubject.next(true);
    const data = new User();
    data.id = this.userId;
    data.name = this.editForm.get('name').value;
    data.email = this.editForm.get('email').value;
    data.role = Role[String(this.editForm.get('role').value)];
    this.userService.update(data).subscribe(
      (res) => {
        this.loadingSubject.next(false);
        this.snackBarService.show(true, `User has been updated.`);
        this.router.navigate(['/users']);
      },
      (err) => {
        this.snackBarService.show(false, `User edition failed due to ${formatError(err)}.`);
        this.loadingSubject.next(false);
      }
    );
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
