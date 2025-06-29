// lib/verifyAdmin.ts

import { NextRequest, NextResponse } from 'next/server';

export function verifyAdminToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.ADMIN_TOKEN}`;

  if (authHeader !== expected) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return null; // no error
}
