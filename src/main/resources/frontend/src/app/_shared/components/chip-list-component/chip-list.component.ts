import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AbstractResource, AbstractApiService, IRestResponse } from '@app/_shared/interfaces';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
})
export class ChipListComponent<T extends AbstractResource> implements OnInit {
  private entityService: AbstractApiService<T>;
  private _selectedEntries: T[] = [];
  private loadingSubject: BehaviorSubject<boolean>;

  allEntries: T[] = [];
  entrieCtrl = new FormControl();
  filteredEntries: Observable<T[]>;
  loading$: Observable<boolean>;

  filterProperty: string;
  selectable: boolean = true;
  removable: boolean = true;

  // It's a lable to customize the component's view
  @Input() title: string;

  @ViewChild('entriesInput', { static: false }) entriesInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() {
    this.loadingSubject = new BehaviorSubject<boolean>(true);
    this.loading$ = this.loadingSubject.asObservable();

    this.filteredEntries = this.entrieCtrl.valueChanges.pipe(
      startWith(null),
      map((search: T | null) => (search ? this.filter(search) : this.allEntries.slice()))
    );
  }

  /**
   * Initializes the component injecting the entity service and which property of this entity is
   * going to be used to filtering.
   *
   * @param entityService the service of the respective Entity<T>
   * @param filterProperty the property of the entity<T> that will be
   *                       the key for displaying and searching entries.
   */
  public init(entityService: AbstractApiService<T>, filterProperty: string) {
    this.entityService = entityService;
    this.filterProperty = filterProperty;

    this.entityService
      .load({ page: 0, size: 100 }) // TODO: Apply a server side filtering...
      .subscribe((resp: IRestResponse<T>) => (this.allEntries = resp.content));

    this.loadingSubject.next(false);
  }

  ngOnInit() {}

  @Input() get selectedEntries(): T[] {
    return this._selectedEntries;
  }

  set selectedEntries(value: T[]) {
    this._selectedEntries = value;
  }

  private filter(value: any): T[] {
    const filterValue = value && value[this.filterProperty] ? value[this.filterProperty] : value;
    return this.allEntries.filter(
      (cust) => cust[this.filterProperty].toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
    );
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const entrie: T = event.option.value;
    const index = this._selectedEntries.indexOf(entrie);

    if (index === -1) {
      this._selectedEntries.push(entrie);
      this.entriesInput.nativeElement.value = '';
      this.entrieCtrl.setValue(null);
    }
  }

  public remove(entrie: T): void {
    const index = this._selectedEntries.indexOf(entrie);

    if (index > -1) {
      this._selectedEntries.splice(index, 1);
    }
  }

  public retrieveEntrieIds(): number[] {
    return this._selectedEntries.map((entrie) => entrie.id);
  }
}
