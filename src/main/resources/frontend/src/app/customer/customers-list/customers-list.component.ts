import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractDataSource } from '../../_shared/abstract-data.source';
import { CustomerService } from '@app/_services/customer.service';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { ICustomer } from '@app/_shared/interfaces';
import { Router } from '@angular/router';
import { formatError } from '@app/_helpers/utils';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: AbstractDataSource<ICustomer>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private customerService: CustomerService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataSource = new AbstractDataSource<ICustomer>(this.customerService, this.snackBarService);
    this.displayedColumns = ['id', 'name', 'actions'];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.load();
  }

  public edit(customerId: number) {
    this.router.navigate(['/customer/edit', customerId]);
  }

  public delete(customerId: number) {
    this.customerService.delete(customerId).then(
      (res) => {
        this.snackBarService.show(true, `Customer has been deleted.`);
        // Realoding table content
        this.dataSource.load();
      },
      (err) =>
        this.snackBarService.show(false, `Customer deletion has failed due to ${formatError(err)}.`)
    );
  }
}
