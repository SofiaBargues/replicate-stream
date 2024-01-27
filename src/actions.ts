"use server";
import { Prediction } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function runModel(formData: FormData) {
  const imageUrl = await fetch(
    `https://api.cloudinary.com/v1_1/sofiabargues/image/upload?upload_preset=replicate-stream&folder=replicate-stream`,
    {
      method: "PUT",
      body: formData.get("image") as File,
    },
  )
    .then((res) => res.json() as Promise<{ secure_url: string }>)
    .then((resJson) => {
      return resJson.secure_url;
    })
    .catch((err) => console.error(err));

  if (!imageUrl) {
    throw Error("Can't upload");
  }

  return (await replicate.run(
    "mcai/babes-v2.0-img2img:2bca10ed539cf2196f18b4ec85128a80355d94934db8620884ecca552cdc4def",
    {
      input: {
        image: imageUrl,
        prompt:
          (formData.get("prompt") as string) +
          ", Disney character concept art, 8k, unreal engine",
        upscale: 2,
        strength: 0.5,
        scheduler: "EulerAncestralDiscrete",
        num_outputs: 1,
        guidance_scale: 7.5,
        negative_prompt:
          "disfigured, kitsch, ugly, oversaturated, greain, low-res, deformed, blurry, bad anatomy, poorly drawn face, mutation, mutated, extra limb, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, disgusting, poorly drawn, childish, mutilated, mangled, old, surreal, calligraphy, sign, writing, watermark, text, body out of frame, extra legs, extra arms, extra feet, out of frame, poorly drawn feet, cross-eye",
        num_inference_steps: 30,
      },
    },
  )) as string[];
}

export async function createPrediction(
  formData: FormData,
): Promise<Prediction> {
  noStore();

  const imageUrl = await fetch(
    `https://api.cloudinary.com/v1_1/sofiabargues/image/upload?upload_preset=replicate-stream&folder=replicate-stream`,
    {
      method: "PUT",
      body: formData.get("image") as File,
    },
  )
    .then((res) => res.json() as Promise<{ secure_url: string }>)
    .then((resJson) => {
      return resJson.secure_url;
    })
    .catch((err) => console.error(err));

  if (!imageUrl) {
    throw Error("Can't upload");
  }

  const prediction = await fetch("https://replicate.com/api/predictions", {
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
        image: imageUrl,
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

  //   console.log(prediction);
  return prediction;
}
export async function getPrediction(id: string) {
  noStore();
  return fetch("https://replicate.com/api/predictions/" + id, {
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
  }).then((res) => res.json() as Promise<Prediction>);
}
