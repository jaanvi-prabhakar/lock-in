"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { todos } from "@/database/schema"

/*  Todo titles cannot be empty */
const schema = z.object({
    title: z.string().min(1, "Title cannot be empty"),
})

export async function createTodo(_: any, formData: FormData) {
    /* YOUR CODE HERE */
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session?.user) return { error: "Unauthorized"}

    const title = formData.get("title") as string
    const validation = schema.safeParse({title})

    if (!validation.success){
        return {error: validation.error.errors[0].message}
    }

    await db.insert(todos).values({
        title,
        completed: false,
        userId: session.user.id,
    })

    revalidatePath("/todos")
    return {error: ""}
}

export async function toggleTodo(formData: FormData) {
    /* YOUR CODE HERE */
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session?.user) return { error: "Unauthorized"}

    const todoId = formData.get("id") as string
    if (!todoId) return { error: "Missing ID"}

    const existingTodo = await db.query.todos.findFirst({
        where: eq(todos.id, todoId),
    })

    if (!existingTodo || existingTodo.userId !== session.user.id) {
        return
    }

    const [todo] = await db
        .select()
        .from(todos)
        .where(eq(todos.id, todoId))
    
    if (!todo || todo.userId !== session.user.id) {
        return { error: "Forbidden"}
    }

    await db 
        .update(todos)
        .set({ completed : !existingTodo.completed})
        .where(eq(todos.id, todoId))

    revalidatePath("/todos")
    return {error: ""}
}

export async function deleteTodo(formData: FormData): Promise<void> {
    /* YOUR AUTHORIZATION CHECK HERE */
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session?.user || session.user.role != "admin"){
        return 
        //{ error: "Unauthorized"}
    }
    const id = formData.get("id") as string;
    await db.delete(todos)
        .where(eq(todos.id, id));

    revalidatePath("/admin");
    //return { error: ""}
}
