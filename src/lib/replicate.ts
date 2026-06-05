import Replicate from 'replicate';

const globalForReplicate = globalThis as unknown as {
  replicate: Replicate | undefined;
};

/**
 * Replicate client singleton.
 */
export const replicate =
  globalForReplicate.replicate ??
  new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForReplicate.replicate = replicate;
}

/**
 * Default Stable Diffusion model version on Replicate.
 * Using SDXL for high-quality outputs.
 */
export const IMAGE_MODEL =
  'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37ec1375916f3e191f66d56';

/**
 * Default image generation parameters.
 */
export const DEFAULT_IMAGE_PARAMS = {
  width: 1024,
  height: 1024,
  num_inference_steps: 30,
  guidance_scale: 7.5,
  scheduler: 'K_EULER',
};
