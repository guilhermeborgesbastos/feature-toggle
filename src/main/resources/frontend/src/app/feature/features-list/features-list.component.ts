import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { FeatureService, SnackBarService } from '@services/index';

import { AbstractDataSource } from '@shared/abstract-data.source';
import { handleError, formatError } from '@helpers/index';
import { IFeature, Feature } from '@models/index';

@Component({
  selector: 'app-features-list',
  templateUrl: './features-list.component.html',
  styleUrls: ['./features-list.component.scss'],
})
export class FeaturesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: AbstractDataSource<IFeature>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private featureService: FeatureService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataSource = new AbstractDataSource<IFeature>(this.featureService, this.snackBarService);
    this.displayedColumns = [
      'id',
      'displayName',
      'technicalName',
      'description',
      'expiresOn',
      'inverted',
      'actions',
    ];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.load();
  }

  public edit(featureId: number) {
    this.router.navigate(['/feature/edit', featureId]);
  }

  public onToggleChange(checked: boolean, featureId: number): void {
    let feature: IFeature = new Feature();
    feature.id = featureId;
    feature.inverted = checked;
    this.featureService
      .update(feature)
      .pipe(take(1)) // Unsubscribe automatically after the first execution.
      .subscribe(
        () => this.snackBarService.show(true, 'Feature invertion has been switched successfully.'),
        (error) => catchError(handleError)
      );
  }

  public delete(featureId: number) {
    this.featureService.delete(featureId).then(
      (res) => {
        this.snackBarService.show(true, `Feature has been deleted.`);
        // Realoding table of content
        this.dataSource.load();
      },
      (error) =>
        this.snackBarService.show(
          false,
          `Feature deletion has failed due to ${formatError(error)}.`
        )
    );
  }
}
