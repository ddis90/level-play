import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Onboarding lead from the public website. Creates a Project in LEAD status so
// it flows straight into the portal's pipeline for staff to pick up.
const LeadSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(20),
  serviceType: z.string().max(60).optional().or(z.literal('')),
  city: z.string().max(60).optional().or(z.literal('')),
  requirements: z.string().max(2000).optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the form and try again.', details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // Generate a human-friendly project code: LP-<year>-<sequence>.
  const year = new Date().getFullYear();
  const countThisYear = await prisma.project.count({
    where: { code: { startsWith: `LP-${year}-` } },
  });
  const code = `LP-${year}-${String(countThisYear + 1).padStart(3, '0')}`;

  const summaryParts = [
    data.serviceType && `Service: ${data.serviceType}`,
    `Contact: ${data.fullName} · ${data.email} · ${data.phone}`,
    data.requirements && `Requirements: ${data.requirements}`,
  ].filter(Boolean);

  await prisma.project.create({
    data: {
      code,
      name: `${data.serviceType || 'Enquiry'} — ${data.fullName}`,
      description: summaryParts.join('\n'),
      status: 'LEAD',
      city: data.city || null,
    },
  });

  return NextResponse.json({ ok: true, code });
}
