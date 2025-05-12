'use client';

import { Todo } from '@/database/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { toggleTodo } from '@/actions/todos';

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <form
      action={async (formData) => {
        await toggleTodo(formData);
      }}
      className="flex items-center gap-2 rounded-lg border px-4 py-2"
    >
      <input type="hidden" name="id" value={todo.id} />
      <Checkbox
        defaultChecked={todo.completed}
        onClick={(e) => e.currentTarget.form?.requestSubmit()}
      />
      <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
        {todo.title}
      </span>
    </form>
  );
}
