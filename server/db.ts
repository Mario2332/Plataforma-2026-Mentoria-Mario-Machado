import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  gestores, 
  mentores, 
  alunos, 
  estudos, 
  simulados, 
  anotacoesMentor,
  horariosEstudo,
  controleConteudos,
  Gestor,
  Mentor,
  Aluno,
  Estudo,
  Simulado,
  AnotacaoMentor,
  HorarioEstudo,
  ControleConteudo,
  InsertGestor,
  InsertMentor,
  InsertAluno,
  InsertEstudo,
  InsertSimulado,
  InsertAnotacaoMentor,
  InsertHorarioEstudo,
  InsertControleConteudo
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'gestor';
      updateSet.role = 'gestor';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Gestores
export async function getGestorByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gestores).where(eq(gestores.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createGestor(data: InsertGestor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(gestores).values(data);
  return result;
}

// Mentores
export async function getMentorByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(mentores).where(eq(mentores.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMentoresByGestorId(gestorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mentores).where(eq(mentores.gestorId, gestorId));
}

export async function createMentor(data: InsertMentor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(mentores).values(data);
  return result;
}

export async function updateMentor(id: number, data: Partial<InsertMentor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mentores).set(data).where(eq(mentores.id, id));
}

export async function deleteMentor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(mentores).where(eq(mentores.id, id));
}

// Alunos
export async function getAlunoByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(alunos).where(eq(alunos.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAlunosByMentorId(mentorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alunos).where(eq(alunos.mentorId, mentorId));
}

export async function getAlunoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(alunos).where(eq(alunos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAluno(data: InsertAluno) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(alunos).values(data);
  return result;
}

export async function updateAluno(id: number, data: Partial<InsertAluno>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(alunos).set(data).where(eq(alunos.id, id));
}

export async function deleteAluno(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(alunos).where(eq(alunos.id, id));
}

export async function getTotalAlunosCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(alunos);
  return result.length;
}

export async function getAllAlunos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alunos).orderBy(desc(alunos.createdAt));
}

// Estudos
export async function getEstudosByAlunoId(alunoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(estudos).where(eq(estudos.alunoId, alunoId)).orderBy(desc(estudos.data));
}

export async function createEstudo(data: InsertEstudo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(estudos).values(data);
  return result;
}

export async function updateEstudo(id: number, data: Partial<InsertEstudo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(estudos).set(data).where(eq(estudos.id, id));
}

export async function deleteEstudo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(estudos).where(eq(estudos.id, id));
}

// Simulados
export async function getSimuladosByAlunoId(alunoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(simulados).where(eq(simulados.alunoId, alunoId)).orderBy(desc(simulados.data));
}

export async function createSimulado(data: InsertSimulado) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(simulados).values(data);
  return result;
}

export async function updateSimulado(id: number, data: Partial<InsertSimulado>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(simulados).set(data).where(eq(simulados.id, id));
}

export async function deleteSimulado(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(simulados).where(eq(simulados.id, id));
}

// Anotações Mentor
export async function getAnotacaoMentor(mentorId: number, alunoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(anotacoesMentor)
    .where(and(eq(anotacoesMentor.mentorId, mentorId), eq(anotacoesMentor.alunoId, alunoId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertAnotacaoMentor(data: InsertAnotacaoMentor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getAnotacaoMentor(data.mentorId, data.alunoId);
  
  if (existing) {
    await db.update(anotacoesMentor)
      .set({ conteudo: data.conteudo, updatedAt: new Date() })
      .where(eq(anotacoesMentor.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(anotacoesMentor).values(data);
    return result;
  }
}

// Horários de Estudo
export async function getHorariosByAlunoId(alunoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(horariosEstudo).where(eq(horariosEstudo.alunoId, alunoId)).orderBy(horariosEstudo.diaSemana, horariosEstudo.horaInicio);
}

export async function createHorario(data: InsertHorarioEstudo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(horariosEstudo).values(data);
  return result;
}

export async function updateHorario(id: number, data: Partial<InsertHorarioEstudo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(horariosEstudo).set(data).where(eq(horariosEstudo.id, id));
}

export async function deleteHorario(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(horariosEstudo).where(eq(horariosEstudo.id, id));
}


// ============================================
// CONTROLE DE CONTEÚDOS
// ============================================

export async function getControleConteudoByAlunoAndTopico(alunoId: number, topicoId: string): Promise<ControleConteudo | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(controleConteudos)
    .where(and(eq(controleConteudos.alunoId, alunoId), eq(controleConteudos.topicoId, topicoId)))
    .limit(1);
  
  return result[0];
}

export async function getAllControleConteudosByAluno(alunoId: number): Promise<ControleConteudo[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(controleConteudos)
    .where(eq(controleConteudos.alunoId, alunoId));
}

export async function upsertControleConteudo(data: InsertControleConteudo): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const existing = await getControleConteudoByAlunoAndTopico(data.alunoId, data.topicoId);
  
  if (existing) {
    await db
      .update(controleConteudos)
      .set({
        estudado: data.estudado,
        questoesFeitas: data.questoesFeitas,
        questoesAcertos: data.questoesAcertos,
        updatedAt: new Date()
      })
      .where(eq(controleConteudos.id, existing.id));
  } else {
    await db.insert(controleConteudos).values(data);
  }
}
