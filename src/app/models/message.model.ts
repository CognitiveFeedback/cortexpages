export class Message {
    public id: number;
    public name: string;
    public email: string;
    public subject: string;
    public text: string;
    public createdDate: string;

    get shortCreatedDate(): string {
        return this.createdDate;
      }
}