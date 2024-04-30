import { UsersResponse } from '@/interfaces';
import { getUsers } from '../services/getUsers';

import { useInfiniteQuery } from '@tanstack/react-query';

const USERS_TABLE_HEADER_TITLES = ['Nombre', 'Apellido', 'Email'];

export function UsersTable() {
  const { isLoading, error, data, fetchNextPage, fetchPreviousPage } =
    useInfiniteQuery<UsersResponse>({
      queryKey: ['users'],
      queryFn: ({ pageParam }) => getUsers(pageParam as number),
      getNextPageParam: (lastPage) => lastPage.page + 1,
      initialPageParam: 1,
    });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const lastPage = data?.pages[data.pages.length - 1];

  return (
    <table>
      <thead>
        <tr>
          {USERS_TABLE_HEADER_TITLES.map((title, index) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.pages[0] &&
          data?.pages[0].data.length &&
          data?.pages[0].data.map((user) => (
            <tr key={user.id} data-testid="user-list">
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
      </tbody>

      <button
        disabled={lastPage?.page === 1}
        onClick={async () => await fetchPreviousPage()}
      >
        Anterior
      </button>
      <button
        disabled={lastPage?.page === lastPage?.total_pages}
        onClick={async () => await fetchNextPage()}
      >
        Siguiente
      </button>
    </table>
  );
}
