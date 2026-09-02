import prisma from "./prisma";

interface AuditLogEntry {
  complaintId: number;
  userId: number;
  action: "create" | "update" | "status_change" | "delete";
  fieldChanged?: string;
  oldValue?: string | null;
  newValue?: string | null;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  return prisma.auditLog.create({
    data: {
      complaintId: entry.complaintId,
      userId: entry.userId,
      action: entry.action,
      fieldChanged: entry.fieldChanged || null,
      oldValue: entry.oldValue || null,
      newValue: entry.newValue || null,
      ipAddress: entry.ipAddress || null,
      userAgent: entry.userAgent || null,
    },
  });
}

export async function logComplaintCreate(
  complaintId: number,
  userId: number,
  data: Record<string, unknown>,
  request?: { ip?: string; userAgent?: string }
) {
  return createAuditLog({
    complaintId,
    userId,
    action: "create",
    newValue: JSON.stringify(data),
    ipAddress: request?.ip,
    userAgent: request?.userAgent,
  });
}

export async function logComplaintUpdate(
  complaintId: number,
  userId: number,
  changes: { field: string; oldValue: unknown; newValue: unknown }[],
  request?: { ip?: string; userAgent?: string }
) {
  return Promise.all(
    changes.map((change) =>
      createAuditLog({
        complaintId,
        userId,
        action: "update",
        fieldChanged: change.field,
        oldValue: String(change.oldValue ?? ""),
        newValue: String(change.newValue ?? ""),
        ipAddress: request?.ip,
        userAgent: request?.userAgent,
      })
    )
  );
}

export async function logStatusChange(
  complaintId: number,
  userId: number,
  oldStatus: string,
  newStatus: string,
  request?: { ip?: string; userAgent?: string }
) {
  return createAuditLog({
    complaintId,
    userId,
    action: "status_change",
    fieldChanged: "status",
    oldValue: oldStatus,
    newValue: newStatus,
    ipAddress: request?.ip,
    userAgent: request?.userAgent,
  });
}
