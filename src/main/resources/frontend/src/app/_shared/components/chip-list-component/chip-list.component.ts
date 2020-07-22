import { FormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractResource, AbstractApiService, IRestResponse } from '@app/_shared/interfaces';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
})
export class ChipListComponent<T extends AbstractResource> implements OnInit, OnDestroy {
  private entityService: AbstractApiService<T>;
  private loadingSubject$: BehaviorSubject<boolean>;
  private _selectedEntries: T[] = [];

  @Input() get selectedEntries(): T[] {
    return this._selectedEntries;
  }

  set selectedEntries(value: T[]) {
    this._selectedEntries = value;
  }

  @Output()
  change: EventEmitter<T[]> = new EventEmitter<T[]>();

  allEntries: T[] = [];
  entrieCtrl = new FormControl();
  filteredEntries$: Observable<T[]>;
  loading$: Observable<boolean>;

  filterProperty: string;
  selectable: boolean;
  removable: boolean;

  // It's a lable/title to customize the component's view
  @Input() title: string;

  @ViewChild('entriesInput', { static: false }) entriesInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() {
    this.selectable = true;
    this.removable = true;

    this.loadingSubject$ = new BehaviorSubject<boolean>(true);
    this.loading$ = this.loadingSubject$.asObservable();

    this.filteredEntries$ = this.entrieCtrl.valueChanges.pipe(
      startWith(null),
      map((search: T | null) => (search ? this.filter(search) : this.allEntries))
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.loadingSubject$.unsubscribe();
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
      .pipe(
        take(1) // Unsubscribe automatically after first execution.
      )
      .subscribe((resp: IRestResponse<T>) => (this.allEntries = resp.content));

    this.loadingSubject$.next(false);
  }

  private filter(value: any): T[] {
    const FILTER_VALUE = value && value[this.filterProperty] ? value[this.filterProperty] : value;
    return this.allEntries.filter(
      (entrie) =>
        entrie[this.filterProperty].toLowerCase().indexOf(FILTER_VALUE.toLowerCase()) !== -1
    );
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const SELECTED_ENTRIE: T = event.option.value;
    const INDEX = this._selectedEntries.map((entrie) => entrie.id).indexOf(SELECTED_ENTRIE.id);

    if (INDEX === -1) {
      this._selectedEntries.push(SELECTED_ENTRIE);
      this.entriesInput.nativeElement.value = '';
      this.entrieCtrl.setValue(null);
      this.change.emit(this._selectedEntries);
    }
  }

  public remove(entrie: T): void {
    const INDEX = this._selectedEntries.indexOf(entrie);

    if (INDEX > -1) {
      this._selectedEntries.splice(INDEX, 1);
      this.change.emit(this._selectedEntries);
    }
  }

  public retrieveEntrieIds(): number[] {
    return this._selectedEntries.map((entrie) => entrie.id);
  }
}
