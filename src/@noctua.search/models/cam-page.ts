export class Page {
  size = 50;
  total = 0;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];
}

export class CamPage extends Page {
}