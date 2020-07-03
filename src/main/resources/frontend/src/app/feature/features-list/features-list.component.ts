import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FeatureService } from '@app/_services/feature.service';
import { catchError } from 'rxjs/operators';
import { handleError, formatError } from '../../_helpers/utils';
import { SnackBarService } from '@app/_services/snack-bar.service';
import { IFeature } from '@app/_shared/interfaces';
import { AbstractDataSource } from '@app/_shared/abstract-data.source';
import { Router } from '@angular/router';

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

  private enableFeature(featureId: number) {
    return this.featureService.enable(featureId).then(
      () => this.snackBarService.show(true, 'Feature has been enabled successfully.'),
      (error) => catchError(handleError)
    );
  }

  private disableFeature(featureId: number) {
    return this.featureService.disable(featureId).then(
      () => this.snackBarService.show(true, 'Feature has been disabled successfully.'),
      (error) => catchError(handleError)
    );
  }

  public onToggleChange(checked: boolean, featureId: number): void {
    if (checked) {
      this.enableFeature(featureId);
    } else {
      this.disableFeature(featureId);
    }
  }

  public edit(featureId: number) {
    this.router.navigate(['/feature/edit', featureId]);
  }

  public archive(featureId: number) {
    this.router.navigate(['/feature/edit', featureId]);
  }

  public delete(featureId: number) {
    this.featureService.delete(featureId).then(
      (res) => {
        this.snackBarService.show(true, `Feature has been deleted.`);
        // Realoding table content
        this.dataSource.load();
      },
      (err) =>
        this.snackBarService.show(false, `Feature deletion has failed due to ${formatError(err)}.`)
    );
  }
}
