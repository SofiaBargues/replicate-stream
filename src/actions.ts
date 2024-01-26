"use server";
import { Prediction } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createPrediction(formData: FormData) {
  noStore();

  let prediction = await fetch("https://replicate.com/api/predictions", {
    headers: {
      accept: "application/json",
      "accept-language": "en,es-ES;q=0.9,es;q=0.8,pt;q=0.7",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrftoken": "UrEUHZ9q4UV9ubUx2B9T3IqHxXTm0KCQ",
    },
    referrer: "https://replicate.com/jagilley/controlnet-hough",
    referrerPolicy: "same-origin",
    body: JSON.stringify({
      input: {
        eta: 0,
        image: formData.get("image"),
        scale: 9,
        prompt: formData.get("prompt"),
        a_prompt: "best quality, extremely detailed",
        n_prompt:
          "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
        ddim_steps: 20,
        num_samples: "1",
        value_threshold: 0.1,
        image_resolution: "512",
        detect_resolution: 512,
        distance_threshold: 0.1,
      },
      is_training: false,
      stream: false,
      create_model: "0",
      version:
        "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  }).then((res) => res.json() as Promise<Prediction>);

  while (["starting", "processing"].includes(prediction.status)) {
    console.log({ id: prediction.id });
    prediction = await fetch(
      "https://replicate.com/api/predictions/" + prediction.id,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en,es-ES;q=0.9,es;q=0.8,pt;q=0.7",
          "sec-ch-ua":
            '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        referrer: "https://replicate.com/jagilley/controlnet-hough",
        referrerPolicy: "same-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      },
    ).then((res) => res.json() as Promise<Prediction>);
    await sleep(4000);
  }
  console.log(prediction);
  return prediction;
}
