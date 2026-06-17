import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DocumentKind, Visibility } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { isStaff, assignableLevelsFor } from '@/lib/rbac';

const UploadSchema = z.object({
  title: z.string().min(1).max(200),
  kind: z.nativeEnum(DocumentKind),
  visibility: z.nativeEnum(Visibility),
  fileUrl: z.string().min(1).max(500),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = UploadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please complete all fields.' }, { status: 422 });
  }
  const { title, kind, visibility, fileUrl } = parsed.data;

  // Access: staff can upload to any project; a client only to their own.
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { members: { where: { userId: user.id }, select: { id: true } } },
  });
  if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });

  const isMember = project.members.length > 0;
  if (!isStaff(user.roles) && !isMember) {
    return NextResponse.json({ error: 'You do not have access to this project.' }, { status: 403 });
  }

  // CRITICAL: re-check on the server that this role may assign the chosen
  // visibility. Never trust the client's option list.
  if (!assignableLevelsFor(user.roles).includes(visibility)) {
    return NextResponse.json(
      { error: 'You are not allowed to set that visibility level.' },
      { status: 403 },
    );
  }

  const doc = await prisma.document.create({
    data: {
      projectId: project.id,
      title,
      kind,
      visibility,
      fileUrl,
      uploadedById: user.id,
    },
  });

  return NextResponse.json({ ok: true, id: doc.id });
}
