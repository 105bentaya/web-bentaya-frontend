import {Filter} from "../model/filter.model";
import {LazyLoadEvent} from "primeng/api";

export default class FilterUtils {

  public static queryString(str: string): string {
    return this.stripAccents(str).toLowerCase();
  }

  public static stripAccents(str: string): string {
    return str
      .replace(/Á/g, "A")
      .replace(/É/g, "E")
      .replace(/Í/g, "I")
      .replace(/Ó/g, "O")
      .replace(/Ú/g, "U")
      .replace(/á/g, "a")
      .replace(/é/g, "e")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ú/g, "u");
  }

  public static showAllOnTrueFilter() {
    return (objectValue: boolean, filterValue: boolean): boolean => {
      if (filterValue === undefined || filterValue === null) return true;
      if (objectValue === undefined || objectValue === null) return false;
      if (filterValue) return true;
      return !objectValue;
    };
  }

  public static nameSurnameFilter(list: any[]) {
    return (value: any, filter: any): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return this.findPersonInFilter(list.find(p => p.id === value), filter);
    };
  }

  public static nameSurnameIdFilter(list: any[]) {
    return (value: any, filter: any): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const person = list.find(ps => ps.id == value);
      if (isNaN(+filter)) {
        return this.findPersonInFilter(person, filter);
      } else {
        return +filter === person?.id;
      }
    };
  }

  public static findPersonInFilter(person: any, filter: any): boolean {
    const personName: string = person?.name! + " " + person?.surname!;
    const personNameReverse: string = person?.surname! + " " + person?.name!;
    const personNameComma: string = person?.name! + ", " + person?.surname!;
    const personNameReverseComma: string = person?.surname! + ", " + person?.name!;

    return this.queryString(personName).includes(this.queryString(filter.toString())) ||
      this.queryString(personNameReverse).includes(this.queryString(filter.toString())) ||
      this.queryString(personNameComma).includes(this.queryString(filter.toString())) ||
      this.queryString(personNameReverseComma).includes(this.queryString(filter.toString()));
  }

  public static lazyEventToFilter(event: LazyLoadEvent, defaultSort?: string): Filter {
    const filter: Filter = {
      page: event.first! / event.rows!,
      countPerPage: event.rows!
    };

    if (event.sortField || defaultSort) {
      filter.sortedBy = event.sortField ?? defaultSort;
      filter.asc = event.sortOrder === 1;
    }

    for (const filtersKey in event.filters) {
      filter[filtersKey] = event.filters[filtersKey].value;
    }
    return filter;
  }
}
