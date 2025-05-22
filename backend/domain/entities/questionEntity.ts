export class Question {
  id?: number;
  title: string;
  content: any; // JSON type
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  userId: string;

  constructor(props: {
    id?: number;
    title: string;
    content: any;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    userId: string;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.userId = props.userId;
  }
}
