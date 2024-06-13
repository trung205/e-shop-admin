import { useSearchParams } from 'next/navigation';

export default function useSearchParamsCus() {
  const searchParams = useSearchParams();

  // Chuyển đổi SearchParams thành đối tượng
  const paramsObj: any = {};
  searchParams.forEach((value, key) => {
    paramsObj[key] = value;
  });

  console.log(paramsObj); // { page: '1', keyword: 'email' }

  return {searchParams, paramsObj};
}
