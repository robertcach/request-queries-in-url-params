import { UsersResponse } from '@/interfaces';
import { getUsers } from '../services/getUsers';

import { useInfiniteQuery } from '@tanstack/react-query';

export function Users() {
  const { isLoading, error, data } = useInfiniteQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: ({ pageParam }) => getUsers(pageParam as number),
    getNextPageParam: (lastPage) => lastPage.page + 1,
    initialPageParam: 1,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.pages[0].data.map((user) => (
        <p>{user.first_name}</p>
      ))}
    </div>
  );
}
