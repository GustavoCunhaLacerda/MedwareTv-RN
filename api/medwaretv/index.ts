export type MedwareTvPage = {
  CodMedwareTv: number;
  Tv: number;
  URL: string;
  Tempo: number;
  Tipo: number;
};

export type Home = {
  codTV: string;
  showAlert: boolean;
}


export default {
  async list<TResponse>(codTv: string): Promise<TResponse> {
    return fetch(
      "https://api.medware.com.br/medwaretv/?" +
        new URLSearchParams({
          codTv,
        }),
    )
      .then((response) => response.json())
      .then((data) => {
        return data as TResponse;
      });
  },
};
