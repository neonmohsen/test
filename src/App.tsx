import { useEffect, useState } from "react";
import {
  usePosts,
  useCreatePost,
  useUpdateTodo,
  useDeleteTodo,
} from "./useTodos";
import Modal from "./components/Modal";
import { Todo } from "./types/types";

const App: React.FC = () => {
  const { data, isLoading } = usePosts();
  const createPostMutation = useCreatePost();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const [todosToShow, setTodosToShow] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setLocalTodos(data);
    }
  }, [data]);

  const handleRemoveTodo = (todoToRemove: Todo) => {
    if (typeof todoToRemove.id !== "undefined") {
      deleteTodo(todoToRemove.id, {
        onSuccess: () => {
          setLocalTodos(
            localTodos.filter((todo) => todo.id !== todoToRemove.id)
          );
        },
      });
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
    setIsEditing(true);
    setTitle(todo.title);
    setCompleted(todo.completed);
    setIsModalOpen(true);
  };

  const handleLoadMore = () => {
    if (todosToShow + 10 <= localTodos.length) {
      setTodosToShow(todosToShow + 10);
    } else {
      setTodosToShow(localTodos.length);
    }
  };

  const handleShowLess = () => {
    setTodosToShow((prev) => Math.max(prev - 10, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTodo: Todo = {
      userId: editTodo!.userId,
      id: editTodo!.id,
      title,
      completed,
    };
    if (isEditing && editTodo) {
      // Update the todo using the API
      // Update the todo in the localTodos list
      const updatedTodos = localTodos.map((todo) =>
        todo.id === editTodo.id ? { ...editTodo, title, completed } : todo
      );
      setLocalTodos(updatedTodos);
      updateTodo(updatedTodo);
      setIsModalOpen(false);
    } else {
      createPostMutation.mutate(
        { title, userId: 1, completed },
        {
          onSuccess: (newTodo: Todo) => {
            setTitle("");
            setIsModalOpen(false);
            setCompleted(false);
            setLocalTodos((prevTodos) => [newTodo, ...prevTodos]);
          },
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          onClick={() => setIsModalOpen(true)}
        >
          Create Todo
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleLoadMore}
          disabled={todosToShow >= localTodos.length}
        >
          Load More
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
          onClick={handleShowLess}
          disabled={todosToShow <= 10}
        >
          Show Less
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {localTodos.slice(0, todosToShow).map((todo) => (
          <div
            key={todo.id}
            className="p-4 bg-white shadow-md border border-gray-200 rounded-md"
          >
            <h2 className="font-bold mb-2 text-lg">{todo.title}</h2>
            <p
              className={`font-semibold ${
                todo.completed ? "text-green-500" : "text-red-500"
              }`}
            >
              {todo.completed ? "Completed" : "Not Completed"}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={() => handleEditTodo(todo)}
            >
              Edit
            </button>
            <button
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => handleRemoveTodo(todo)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {isLoading && <p>Loading...</p>}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Update Todo" : "Create Todo"}
            </h2>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full border-2 border-blue-300 rounded-md p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="completed" className="block mb-2">
                Status
              </label>
              <div className="flex items-center">
                <span className="mr-2">Not Completed</span>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input
                    type="checkbox"
                    name="completed"
                    id="completed"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="toggle-checkbox hidden"
                  />
                  <label
                    htmlFor="completed"
                    className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in"
                    style={{ width: "2.5rem" }}
                  >
                    <span className="toggle-button absolute left-0 top-0 h-5 w-5 bg-white rounded-full shadow transition-transform duration-200 ease-in"></span>
                  </label>
                </div>
                <span className="ml-2">Completed</span>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              {isEditing ? "Update Todo" : "Create Todo"}
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default App;
