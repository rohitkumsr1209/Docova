import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
      Create a personalized workout and diet plan.
      Age: ${body.age}, Height: ${body.height}, Weight: ${body.weight},
      Goal: ${body.fitness_goal}, Days: ${body.workout_days}, Level: ${body.fitness_level},
      Injuries: ${body.injuries || "None"}, Restrictions: ${body.dietary_restrictions || "None"}.

      ⚠️ Return ONLY valid JSON. Format:
      {
        "workoutPlan": {
          "schedule": ["Monday", "Wednesday", "Friday"],
          "exercises": [
            {
              "day": "Monday",
              "routines": [
                { "name": "Push Ups", "sets": 3, "reps": 12 }
              ]
            }
          ]
        },
        "dietPlan": {
          "dailyCalories": 2000,
          "meals": [
            {
              "name": "Breakfast",
              "foods": ["Oatmeal with berries", "Greek yogurt", "Coffee"]
            }
          ]
        }
      }
        Generate a personalized workout plan and diet plan in STRICT JSON format only.
Do not include explanations or notes. Use valid JSON with quotes for all strings.

Example format:
{
  "workoutPlan": { "schedule": [...], "exercises": [...] },
  "dietPlan": { "dailyCalories": 2000, "meals": [...] }
}

Now generate the plan for:
Age: ${body.age}
Height: ${body.height}
Weight: ${body.weight}
Goal: ${body.fitness_goal}
Level: ${body.fitness_level}
Injuries: ${body.injuries}
Dietary restrictions: ${body.dietary_restrictions}
Workout days: ${body.workout_days}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    let text = result.response.text();
    // Remove code fences
text = text.replace(/```json|```/g, "").trim();

// Fix invalid tokens like asManyAsPossible or as many as possible
text = text.replace(/:\s*asManyAsPossible/gi, ': "as many as possible"');
text = text.replace(/:\s*as many as possible/gi, ': "as many as possible"');

// You can add more sanitizers if AI invents other tokens



    let plan;
    try {
      plan = JSON.parse(text);
    } catch (err) {
      console.error("Parsing failed:", err, text);
      return NextResponse.json(
        { success: false, error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }
    // After parsing plan
console.log("✅ Parsed plan:", plan);

// Save to Convex
try {
  await fetch("https://resilient-bat-710.convex.site/api/saveProgram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: body.user_id,
      workoutPlan: plan.workoutPlan,
      dietPlan: plan.dietPlan,
    }),
  });
  console.log("📦 Saved plan to Convex DB");
} catch (dbErr) {
  console.error("❌ Failed saving to Convex:", dbErr);
}

return NextResponse.json({ success: true, data: plan }, { status: 200 });


    return NextResponse.json({ success: true, data: plan }, { status: 200 });
  } catch (error) {
    console.error("API /generate-program failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }

  
}

