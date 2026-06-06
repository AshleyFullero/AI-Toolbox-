import { auth } from '@/lib/auth';
import { replicate, DEFAULT_IMAGE_PARAMS } from '@/lib/replicate';
import { db } from '@/lib/db';
import { z } from 'zod';

// Force Node.js runtime — Replicate, Prisma, and auth use Node-only APIs
export const runtime = 'nodejs';

const requestSchema = z.object({
  prompt: z
    .string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(500, 'Prompt must be under 500 characters'),
  width: z.number().int().min(512).max(1536).optional().default(1024),
  height: z.number().int().min(512).max(1536).optional().default(1024),
  num_inference_steps: z.number().int().min(10).max(50).optional().default(30),
  negative_prompt: z.string().max(300).optional(),
});

export async function POST(req: Request) {
  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { prompt, width, height, num_inference_steps, negative_prompt } = parsed.data;

  try {
    // Run prediction on Replicate (SDXL)
    const output = await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37ec1375916f3e191f66d56',
      {
        input: {
          prompt,
          negative_prompt: negative_prompt ?? 'blurry, bad quality, watermark, text, ugly',
          width,
          height,
          num_inference_steps,
          guidance_scale: DEFAULT_IMAGE_PARAMS.guidance_scale,
          scheduler: DEFAULT_IMAGE_PARAMS.scheduler,
        },
      }
    );

    // The output is typically an array of URLs
    const imageUrls = Array.isArray(output) ? output : [output];
    const imageUrl = String(imageUrls[0]);

    // Save to database
    await db.imageGeneration.create({
      data: {
        userId: session.user.id,
        prompt,
        imageUrl,
        width,
        height,
        model: 'stability-ai/sdxl',
      },
    });

    return Response.json({ imageUrl, prompt });
  } catch (error) {
    console.error('Image generation error:', error);
    return Response.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET: Fetch the current user's image generation history.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const generations = await db.imageGeneration.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return Response.json({ generations });
}
