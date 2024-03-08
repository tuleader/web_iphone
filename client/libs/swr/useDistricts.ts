import { CityType,DistrictType } from '../../types/index';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string, queryParams: string = '') => {
  return axios.get(`${url}${queryParams}`).then((res) => res.data);
};

// export function useDistricts(queryParams?: string) {
//   const { data, error, mutate } = useSWR<CityType[]>(
//     [`https://provinces.open-api.vn/api/p/`, queryParams],
//     fetcher
//   );

//   return {
//     data,
//     error,
//     mutate,
//   };
// }
export function useDistricts(provinceCode: string) {
  const { data, error, mutate } = useSWR<DistrictType[]>(
    [`https://api.mysupership.vn/v1/partner/areas/district?province=${provinceCode}`],
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type citiesState = ReturnType<typeof useDistricts>;
