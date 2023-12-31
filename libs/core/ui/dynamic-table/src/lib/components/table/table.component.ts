import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectedRowService } from '@my-monorepo/core/features/expand-table';
import { ITableConfig } from '../../models/table';
import { IN_OUT_PANE_ANIMATION } from '../../animations/inOutPane';
import { ICON_STATE_ANIMATION } from '../../animations/iconState';

@Component({
  selector: 'dynamic-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [IN_OUT_PANE_ANIMATION, ICON_STATE_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnChanges {
  @Input({ required: true }) config!: ITableConfig<T>;
  @Input({ required: true }) data!: T[];

  length = 0;
  columnsLength = 0;
  viewDataSource!: T[];
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<T>;
  availableTemplates: TemplateRef<unknown>[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ContentChildren('customTemplate') set templates(
    query: QueryList<TemplateRef<unknown>>
  ) {
    this.availableTemplates = query.toArray();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    readonly selectedRowService: SelectedRowService<T>
  ) {}

  ngOnInit() {
    this.createDataSource();
  }

  ngAfterViewInit(): void {
    if (this.config.hasPaginator && this.paginator)
      this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.createDataSource();
    }
  }

  createDataSource() {
    this.setColumns();
    this.viewDataSource = this.data;
    this.length = this.data.length;
    this.dataSource = new MatTableDataSource(this.viewDataSource);

    if (this.config.hasDefaultPaginator && this.config.customPagination)
      this.config.customPagination();
  }

  setColumns() {
    this.displayedColumns = this.config.columns.map((item) => item.selector);
    this.columnsLength = this.displayedColumns.length;
    if (this.config.hasExpansion)
      this.displayedColumns = [...this.displayedColumns, 'expandeIcon'];
  }

  handlePageChange(event: number | PageEvent) {
    this.scrollToTop();
    if (typeof event == 'number' && this.config.defaultPaginatorOptions) {
      this.config.defaultPaginatorOptions.currentPage = event;
    }
    if (this.config.customPagination) return this.config.customPagination();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
}
