/** Resolves active workspace from X-Workspace-Id header or first membership */
export function resolveWorkspaceId(request: {
  headers: Record<string, string | string[] | undefined>;
  user?: {
    workspaces?: Array<{ workspaceId: string; role?: string }>;
  };
}): string {
  const user = request.user;
  const memberships = user?.workspaces ?? [];
  const header = request.headers['x-workspace-id'];
  const headerId = Array.isArray(header) ? header[0] : header;

  if (headerId && memberships.some((m) => m.workspaceId === headerId)) {
    return headerId;
  }
  return memberships[0]?.workspaceId ?? '';
}

export function resolveWorkspaceRole(
  request: {
    headers: Record<string, string | string[] | undefined>;
    user?: { workspaces?: Array<{ workspaceId: string; role?: string }> };
  },
  workspaceId: string,
): string | null {
  const member = request.user?.workspaces?.find((m) => m.workspaceId === workspaceId);
  return member?.role ?? null;
}
