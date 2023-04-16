import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Todo, FetchPostsResult } from "./types/types";
import axios from "axios";

// const fetchTodos = async ({ pageParam = 1 }): Promise<ApiResponse> => {
//   const limit = 10;
//   const response = await fetch(
//     `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${limit}`
//   );
//   const data = await response.json();
//   return { data };
// };

// export const useTodos = () => {
//   return useInfiniteQuery<ApiResponse, Error>("todos", fetchTodos, {
//     getNextPageParam: (lastPage, allPages) => {
//       const hasMore = lastPage.data.length > 0;
//       return hasMore ? allPages.length + 1 : false;
//     },
//   });
// };

export const usePosts = () => {
  return useQuery<Todo[]>("todos", () =>
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.data)
  );
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation((newTodo: Omit<Todo, "id">) =>
    axios
      .post("https://jsonplaceholder.typicode.com/todos", newTodo)
      .then((response) => response.data)
  );
};

const updateTodo = async (todo: Todo): Promise<Todo> => {
  const { data } = await axios.put<Todo>(
    `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
    todo
  );
  return data;
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation(updateTodo, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("todos");
    },
  });
};

const deleteTodo = async (id: number) => {
  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  return response.data;
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });
};

// const fetchPosts = async ({ pageParam = 1 }): Promise<FetchPostsResult> => {
//   const response = await axios.get<Todo[]>(
//     "https://jsonplaceholder.typicode.com/todos",
//     {
//       params: { _page: pageParam, _limit: 10 },
//     }
//   );

//   return {
//     data: response.data,
//     nextPage: response.headers.link.includes('rel="next"')
//       ? pageParam + 1
//       : null,
//   };
// };

// const createPost = async (postData: Todo): Promise<Todo> => {
//   const response = await axios.post<Todo>(
//     "https://jsonplaceholder.typicode.com/todo",
//     postData
//   );
//   return response.data;
// };

// export const usePosts = () => {
//   return useInfiniteQuery<FetchPostsResult, Error>("todo", fetchPosts, {
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//   });
// };

// export const useCreatePost = () => {
//   return useMutation<Todo, Error, Todo>(createPost);
// };
