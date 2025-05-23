export class Tag {
  id?: number;
  tagName: string;

  constructor(props: { id?: number; tagName: string }) {
    this.id = props.id;
    this.tagName = props.tagName;
  }
}
