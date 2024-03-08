import axios from 'axios';
import useSWR from 'swr';
import { CityType } from '../../types/index';

const fetcher = (url: string) => {
  return axios.get(url).then((res) => res.data);
};

export function useCities() {
  const { data, error, mutate } = useSWR<CityType>(
    [`https://api.mysupership.vn/v1/partner/areas/province`],
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type citiesState = ReturnType<typeof useCities>;
