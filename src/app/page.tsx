"use client";
import { useFormState, useFormStatus } from "react-dom";

import { createPrediction, getPrediction, runModel } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Prediction } from "@/types";
import { Label } from "@/components/ui/label";

function FormContent() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? <Skeleton className="h-[480px] w-[512px]" /> : null}
      <Label htmlFor="image">Image</Label>
      <Input
        defaultValue="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        name="image"
        placeholder="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        type="file"
      />
      <Label htmlFor="prompt">What is in it</Label>
      <Textarea name="prompt" placeholder="A puppy" />
      <Button disabled={pending}>Create</Button>
    </>
  );
}

export default function HomePage() {
  const [state, formAction] = useFormState(handleSubmit, null);

  async function handleSubmit(_state: null | string[], formData: FormData) {
    return await runModel(formData);
  }

  return (
    <section className="m-auto grid max-w-[512px] gap-4">
      {state ? <img alt="Previsualizacion del render" src={state[0]} /> : null}

      <form action={formAction} className="grid gap-4">
        <FormContent />
      </form>
    </section>
  );
}
