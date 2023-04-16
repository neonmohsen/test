import { useInfiniteQuery } from "react-query";
import { Todo, ApiResponse } from "./types/types";

const fetchTodos = async ({ pageParam = 1 }): Promise<ApiResponse> => {
  const limit = 10;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${limit}`
  );
  const data = await response.json();
  return { data };
};

export const useTodos = () => {
  return useInfiniteQuery<ApiResponse, Error>("todos", fetchTodos, {
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.data.length > 0;
      return hasMore ? allPages.length + 1 : false;
    },
  });
};
