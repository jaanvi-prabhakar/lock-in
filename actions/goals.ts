
export async function createGoal(goal: {
    title: string;
    description?: string;
    difficulty: "easy" | "medium" | "hard";
    timeEstimate?: number;
  }) {
    const res = await fetch("/api/goals/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(goal),
      credentials: "include" // Important: sends cookies for Better Auth
    });
  
    if (!res.ok) {
      throw new Error(`Failed to create goal: ${res.statusText}`);
    }
  
    return await res.json();
  }
  