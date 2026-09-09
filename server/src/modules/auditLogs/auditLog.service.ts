import { Request } from 'express';
import { AuditLog } from './auditLog.model';

export interface AuditEntry {
  actor?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  req?: Request;
}

/** Append-only audit logging. Never writable by normal users through the API. */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await AuditLog.create({
      actor: entry.actor ?? entry.req?.user?.id ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      metadata: entry.metadata ?? {},
      ipAddress: entry.req?.ip,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[audit] failed to write audit log', err);
  }
}
