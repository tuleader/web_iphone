import axios from 'axios';
import useSWR from 'swr';
import { WardType } from '../../types';

const fetcher = (url: string) => {
  return axios.get(url).then((res) => res.data);
};

export function useWards(districtCode: string) {
    const { data, error, mutate } = useSWR<WardType>(
      [`https://api.mysupership.vn/v1/partner/areas/commune?district=${districtCode}`],
      fetcher
    );
  
    return {
      data,
      error,
      mutate,
    };
  }
export type citiesState = ReturnType<typeof useWards>;