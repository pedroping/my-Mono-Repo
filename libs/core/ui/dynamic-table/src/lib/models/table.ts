import { Type } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

export interface ITableColumn<T> {
  label: string;
  selector: string;
  hasCustomField?: boolean;
  hasControls?: boolean;
  component?: Type<DefaultInput<T>>;
  controls?: AbstractControl;
}

export interface ITableConfig<T> {
  columns: ITableColumn<T>[];
  hasExpansion: boolean;
  hasPaginator: boolean;
  paginatorOptions?: IPaginatorOptions;
  hasDefaultPaginator?: boolean;
  defaultPaginatorOptions?: IDefaultPaginatorOptions;
}
export interface IPaginatorOptions {
  pageSize: number;
  pageSizeOptions: number[];
}

export interface IDefaultPaginatorOptions {
  pageSize: number;
  totalSize: number;
  currentPage: number;
  previousLabel: string;
  nextLabel: string;
}
export interface DefaultInput<T> {
  tableElement: T;
  selector: keyof T;
  formControl: FormControl;
}

export type IControl = AbstractControl | FormControl;
