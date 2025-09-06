// "use client";

// import { useState } from "react";

// import { useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";

// export default function GenerateProgramPage() {
//   const [formData, setFormData] = useState({
//     user_id: "", // You can pass Clerk user id here
//     age: "",
//     height: "",
//     weight: "",
//     injuries: "",
//     workout_days: "",
//     fitness_goal: "",
//     fitness_level: "",
//     dietary_restrictions: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState<any>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("/api/http/vapi/generate-program", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       setResponse(data);

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to generate program");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

  
//   ;

//   return (
    
//     <div className="p-6 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Generate Fitness Program</h1>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           type="text"
//           name="age"
//           placeholder="Age"
//           value={formData.age}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="height"
//           placeholder="Height (cm)"
//           value={formData.height}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="weight"
//           placeholder="Weight (kg)"
//           value={formData.weight}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="injuries"
//           placeholder="Injuries / Limitations"
//           value={formData.injuries}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="workout_days"
//           placeholder="Workout Days (e.g., Mon, Wed, Fri)"
//           value={formData.workout_days}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="fitness_goal"
//           placeholder="Fitness Goal"
//           value={formData.fitness_goal}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="fitness_level"
//           placeholder="Fitness Level (Beginner, Intermediate, Advanced)"
//           value={formData.fitness_level}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           name="dietary_restrictions"
//           placeholder="Dietary Restrictions"
//           value={formData.dietary_restrictions}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Generating..." : "Generate Program"}
//         </button>
//       </form>

//       {response && (
//         <div className="mt-6 p-4 border rounded bg-gray-50">
//           <h2 className="text-xl font-semibold mb-2">Generated Plan</h2>
//           <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";

// export default function GenerateProgramPage() {
//   const { user } = useUser();
//   const userId = user?.id as string;

//   const [formData, setFormData] = useState({
//     age: "",
//     height: "",
//     weight: "",
//     injuries: "",
//     workout_days: "",
//     fitness_goal: "",
//     fitness_level: "",
//     dietary_restrictions: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState<any>(null);

//   const createPlan = useMutation(api.plans.createPlan);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Prepare payload
//       const payload = {
//         user_id: userId,
//         age: Number(formData.age),
//         height: Number(formData.height),
//         weight: Number(formData.weight),
//         injuries: formData.injuries,
//         workout_days: formData.workout_days.split(",").map(day => day.trim()),
//         fitness_goal: formData.fitness_goal,
//         fitness_level: formData.fitness_level,
//         dietary_restrictions: formData.dietary_restrictions,
//       };

//       // Call AI backend
//       const res = await fetch("/api/vapi/generate-program", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       setResponse(data);

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to generate program");
//       }

//       // Save to Convex
//       await createPlan({
//         userId,
//         name: `${formData.fitness_goal} Plan - ${new Date().toLocaleDateString()}`,
//         workoutPlan: data.data.workoutPlan,
//         dietPlan: data.data.dietPlan,
//         isActive: true,
//       });

//     } catch (err) {
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Generate Fitness Program</h1>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="injuries" placeholder="Injuries / Limitations" value={formData.injuries} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="workout_days" placeholder="Workout Days (e.g., Mon, Wed, Fri)" value={formData.workout_days} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="fitness_goal" placeholder="Fitness Goal" value={formData.fitness_goal} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="fitness_level" placeholder="Fitness Level" value={formData.fitness_level} onChange={handleChange} className="w-full p-2 border rounded" />
//         <input type="text" name="dietary_restrictions" placeholder="Dietary Restrictions" value={formData.dietary_restrictions} onChange={handleChange} className="w-full p-2 border rounded" />

//         <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
//           {loading ? "Generating..." : "Generate Program"}
//         </button>
//       </form>

//       {response && (
//         <div className="mt-6 p-4 border rounded bg-gray-50">
//           <h2 className="text-xl font-semibold mb-2">Generated Plan</h2>
//           <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";

export default function GenerateProgramPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    injuries: "",
    workout_days: "",
    fitness_goal: "",
    fitness_level: "",
    dietary_restrictions: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/http/vapi/generate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...formData }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text();
        console.error("Invalid JSON response:", text);
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate program");
      }

      setResponse(data.data);

      // OPTIONAL: save to Convex directly if not already handled by API
      // await mutation(api.plans.createPlan, {
      //   userId,
      //   name: `${formData.fitness_goal} Plan`,
      //   workoutPlan: data.data.workoutPlan,
      //   dietPlan: data.data.dietPlan,
      //   isActive: true,
      // });

    } catch (err: any) {
      console.error("Error generating program:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Fitness Program</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key.replace("_", " ").toUpperCase()}
            value={formData[key as keyof typeof formData]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Program"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Generated Plan</h2>
          <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}



