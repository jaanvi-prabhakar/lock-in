'use client';

import { useOptimistic } from 'react';
import { useRef } from 'react';
import { createTodo } from '@/actions/todos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Todo } from '@/database/schema';

import { TodoItem } from './TodoItem';

import { useActionState } from 'react';

import { useTransition } from 'react';

export default function TodoList({ userId, todos }: { userId: string; todos: Todo[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [formState, formAction] = useActionState(createTodo, { error: '' });

  const [isPending, startTransition] = useTransition();

  const [optimisticTodos, addOptimisticTodo] = useOptimistic<Todo[], FormData>(
    todos,
    (currentTodos, formData) => {
      const title = formData.get('title') as string;
      return [
        ...currentTodos,
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
        },
      ];
    }
  );

  async function handleSubmit(formData: FormData) {
    addOptimisticTodo(formData);
    await formAction(formData);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="flex gap-2 items-stretch">
        <Input name="title" placeholder={'Add a new todo...'} />
        {/* this part disables the "Add" button while the server action is running */}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add'}
        </Button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
