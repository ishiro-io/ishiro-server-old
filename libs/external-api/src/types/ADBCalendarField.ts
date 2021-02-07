class ADBCalendarField {
  aid: number;

  startdate: number;

  constructor(message: string) {
    const data = message.split("|");

    this.aid = Number(data[0]);
    this.startdate = Number(data[1]);
  }
}

export default ADBCalendarField;
