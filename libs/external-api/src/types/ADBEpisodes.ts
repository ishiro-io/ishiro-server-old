class ADBEpisode {
  epno: number;

  length: number;

  date: string;

  title: string;

  constructor(data: any) {
    const frenchTitle = data?.title?.find((t) => t?.$["xml:lang"] === "fr")?._;

    const englishTitle = data?.title?.find((t) => t?.$["xml:lang"] === "en")?._;

    this.epno = Number(data?.epno?.[0]._);
    this.length = data?.length?.[0];
    this.date = data?.airdate?.[0];
    this.title = frenchTitle || englishTitle;
  }
}

export default ADBEpisode;
