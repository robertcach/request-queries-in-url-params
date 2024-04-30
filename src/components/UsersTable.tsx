import { UsersResponse } from '@/interfaces';
import { getUsers } from '../services/getUsers';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

const USERS_TABLE_HEADER_TITLES = ['Nombre', 'Apellido', 'Email'];

export function UsersTable() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  console.log(searchParams);

  const currentParams = new URLSearchParams(searchParams);
  console.log(searchParams);

  const pageParam = currentParams.get('page');

  const { isLoading, error, data, fetchNextPage, fetchPreviousPage } =
    useInfiniteQuery<UsersResponse>({
      queryKey: ['users'],
      queryFn: ({ pageParam }) => getUsers(pageParam as number),
      getNextPageParam: (lastPage) => lastPage.page + 1,
      initialPageParam: pageParam ?? 1,
    });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const lastPage = data?.pages[data.pages.length - 1];

  const handleAddPage = (page: number) => {
    if (page > 1) {
      navigate(`${pathname}?page=${page}`);
    } else {
      navigate(pathname);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {USERS_TABLE_HEADER_TITLES.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.pages[0]?.data.map((user) => (
            <tr key={user.id} data-testid="user-list">
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        disabled={lastPage?.page === 1}
        onClick={async () => {
          await fetchPreviousPage();
          if (lastPage) {
            handleAddPage(lastPage.page - 1);
          }
        }}
      >
        Anterior
      </button>
      <button
        disabled={lastPage?.page === lastPage?.total_pages}
        onClick={async () => {
          await fetchNextPage();
          if (lastPage) {
            handleAddPage(lastPage.page + 1);
          }
        }}
      >
        Siguiente
      </button>
    </div>
  );
}
