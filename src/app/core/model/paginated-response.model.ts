export interface Paginated<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Content {
  id: string;
  name: string;
  stud: string;
  description: string;
  birthDate: Date;
  breed: Breed;
  supplierId: string;
}

export interface Breed {
  id: string;
  name: string;
  type: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
