import { useState } from "react";
import { useTodos } from "./useTodos";
import { Todo } from "./types/types";

const App: React.FC = () => {
  const [displayedPages, setDisplayedPages] = useState(1);
  const [allPagesFetched, setAllPagesFetched] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTodos();

  const todos: Todo[] = data
    ? data.pages.slice(0, displayedPages).flatMap((page) => page.data)
    : [];

  const loadMoreTodos = async () => {
    if (!allPagesFetched && !isFetchingNextPage) {
      await fetchNextPage();
      if (!hasNextPage) {
        setAllPagesFetched(true);
      } else {
        setDisplayedPages(displayedPages + 1);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Todos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {todos.map((todo) => (
          <div key={todo.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl mb-2 font-semibold text-blue-600">
              {todo.title}
            </h2>
            <p className="text-gray-700">{todo.body}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {!allPagesFetched && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded fo`cus:outline-none"
            onClick={loadMoreTodos}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
