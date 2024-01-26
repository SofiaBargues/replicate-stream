"use client";
import { createPrediction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "react-dom";

export default function HomePage() {
  const [state, formAction] = useFormState(createPrediction, null);
  console.log(state);

  return (
    <form action={formAction} className="m-auto grif max-w-[512px] gap-4">
      <Input
        defaultValue="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        name="image"
        placeholder="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        type="text"
      />
      <Textarea placeholder="An industrial bedroom" name="prompt" />
      <Button>Create</Button>
    </form>
  );
}
