import { ReactNode } from "react";

export interface Todo {
  userId: number;
  id?: number;
  title: string;
  completed: boolean;
}

export interface FetchPostsResult {
  data: Todo[];
  nextPage: number | null;
}
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
