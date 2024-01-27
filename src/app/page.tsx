"use client";
import { createPrediction, getPrediction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Prediction } from "@/types";
import { useFormState, useFormStatus } from "react-dom";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function FormContent() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? <Skeleton className="h-[480px] w-[512px]" /> : null}
      <Input
        defaultValue="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        name="image"
        placeholder="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        type="file"
      />
      <Textarea placeholder="An industrial bedroom" name="prompt" />
      <Button disabled={pending}>Create</Button>
    </>
  );
}

export default function HomePage() {
  const [state, formAction] = useFormState(handleSubmit, null);

  async function handleSubmit(_state: null | Prediction, formData: FormData) {
    let prediction = await createPrediction(formData);
    while (["starting", "processing"].includes(prediction.status)) {
      prediction = await getPrediction(prediction.id);
      await sleep(4000);
    }

    return prediction;
  }

  return (
    <section className="m-auto grid max-w-[512px] gap-4">
      {state?.output && (
        <img alt="Previsualizacion del render" src={state.output[1]} />
      )}

      <form action={formAction} className="grid gap-4">
        <FormContent />
      </form>
    </section>
  );
}
