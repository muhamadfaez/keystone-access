import { Hono } from "hono";
import type { Env } from './core-utils';
import { KeyEntity, PersonnelEntity, KeyAssignmentEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Key, Personnel, KeyAssignment } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- DASHBOARD ---
  app.get('/api/stats', async (c) => {
    const allKeys = await KeyEntity.list(c.env);
    const totalKeys = allKeys.items.length;
    const keysIssued = allKeys.items.filter(k => k.status === 'Issued' || k.status === 'Overdue').length;
    const overdueKeys = allKeys.items.filter(k => k.status === 'Overdue').length;
    return ok(c, {
      totalKeys,
      keysIssued,
      keysAvailable: totalKeys - keysIssued,
      overdueKeys,
    });
  });
  app.get('/api/assignments/recent', async (c) => {
    const assignmentsPage = await KeyAssignmentEntity.list(c.env, null, 5);
    const assignments = assignmentsPage.items;
    const populatedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const key = await new KeyEntity(c.env, assignment.keyId).getState();
        const personnel = await new PersonnelEntity(c.env, assignment.personnelId).getState();
        return { ...assignment, key, personnel };
      })
    );
    return ok(c, populatedAssignments);
  });
  // --- KEYS ---
  app.get('/api/keys', async (c) => ok(c, await KeyEntity.list(c.env)));
  app.post('/api/keys', async (c) => {
    const body = await c.req.json<Partial<Key>>();
    if (!isStr(body.keyNumber) || !isStr(body.roomNumber)) return bad(c, 'keyNumber and roomNumber are required');
    const newKey: Key = {
      id: crypto.randomUUID(),
      keyNumber: body.keyNumber,
      keyType: body.keyType || 'Single',
      roomNumber: body.roomNumber,
      status: 'Available',
    };
    return ok(c, await KeyEntity.create(c.env, newKey));
  });
  // --- PERSONNEL ---
  app.get('/api/personnel', async (c) => ok(c, await PersonnelEntity.list(c.env)));
  app.post('/api/personnel', async (c) => {
    const body = await c.req.json<Partial<Personnel>>();
    if (!isStr(body.name) || !isStr(body.department) || !isStr(body.email)) return bad(c, 'name, department, and email are required');
    const newPerson: Personnel = {
      id: crypto.randomUUID(),
      name: body.name,
      department: body.department,
      email: body.email,
      phone: body.phone || '',
    };
    return ok(c, await PersonnelEntity.create(c.env, newPerson));
  });
  // --- ASSIGNMENTS ---
  app.post('/api/assignments', async (c) => {
    const body = await c.req.json<Partial<KeyAssignment>>();
    if (!isStr(body.keyId) || !isStr(body.personnelId) || !isStr(body.dueDate)) {
      return bad(c, 'keyId, personnelId, and dueDate are required');
    }
    const key = new KeyEntity(c.env, body.keyId);
    if (!(await key.exists()) || (await key.getState()).status !== 'Available') {
      return bad(c, 'Key is not available for assignment');
    }
    const newAssignment: KeyAssignment = {
      id: crypto.randomUUID(),
      keyId: body.keyId,
      personnelId: body.personnelId,
      issueDate: new Date().toISOString(),
      dueDate: body.dueDate,
    };
    await key.patch({ status: 'Issued' });
    return ok(c, await KeyAssignmentEntity.create(c.env, newAssignment));
  });
}