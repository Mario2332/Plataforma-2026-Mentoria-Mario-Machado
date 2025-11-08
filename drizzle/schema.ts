import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["gestor", "mentor", "aluno"]).default("aluno").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Gestores - Administradores da plataforma Órbita
 */
export const gestores = mysqlTable("gestores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Gestor = typeof gestores.$inferSelect;
export type InsertGestor = typeof gestores.$inferInsert;

/**
 * Mentores - Clientes white-label que gerenciam alunos
 */
export const mentores = mysqlTable("mentores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  gestorId: int("gestorId").notNull().references(() => gestores.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  nomePlataforma: text("nomePlataforma").notNull(),
  logoUrl: text("logoUrl"),
  corPrincipal: varchar("corPrincipal", { length: 7 }).notNull().default("#3b82f6"),
  ativo: tinyint("ativo").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Mentor = typeof mentores.$inferSelect;
export type InsertMentor = typeof mentores.$inferInsert;

/**
 * Alunos - Usuários finais que registram estudos
 */
export const alunos = mysqlTable("alunos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  mentorId: int("mentorId").notNull().references(() => mentores.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  celular: varchar("celular", { length: 20 }),
  plano: varchar("plano", { length: 100 }),
  ativo: tinyint("ativo").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Aluno = typeof alunos.$inferSelect;
export type InsertAluno = typeof alunos.$inferInsert;

/**
 * Estudos - Registros de sessões de estudo dos alunos
 */
export const estudos = mysqlTable("estudos", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").notNull().references(() => alunos.id, { onDelete: "cascade" }),
  data: timestamp("data").notNull(),
  materia: varchar("materia", { length: 100 }).notNull(),
  conteudo: text("conteudo").notNull(),
  tempoMinutos: int("tempoMinutos").notNull().default(0),
  questoesFeitas: int("questoesFeitas").notNull().default(0),
  questoesAcertadas: int("questoesAcertadas").notNull().default(0),
  flashcardsRevisados: int("flashcardsRevisados").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Estudo = typeof estudos.$inferSelect;
export type InsertEstudo = typeof estudos.$inferInsert;

/**
 * Simulados - Registros de simulados do ENEM
 */
export const simulados = mysqlTable("simulados", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").notNull().references(() => alunos.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  data: timestamp("data").notNull(),
  // Linguagens
  linguagensAcertos: int("linguagensAcertos").notNull().default(0),
  linguagensTempo: int("linguagensTempo").notNull().default(0),
  // Humanas
  humanasAcertos: int("humanasAcertos").notNull().default(0),
  humanasTempo: int("humanasTempo").notNull().default(0),
  // Natureza
  naturezaAcertos: int("naturezaAcertos").notNull().default(0),
  naturezaTempo: int("naturezaTempo").notNull().default(0),
  // Matemática
  matematicaAcertos: int("matematicaAcertos").notNull().default(0),
  matematicaTempo: int("matematicaTempo").notNull().default(0),
  // Redação
  redacaoNota: int("redacaoNota").notNull().default(0),
  redacaoTempo: int("redacaoTempo").notNull().default(0),
  // Anotações
  anotacoes: text("anotacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Simulado = typeof simulados.$inferSelect;
export type InsertSimulado = typeof simulados.$inferInsert;

/**
 * Anotações do Mentor sobre alunos
 */
export const anotacoesMentor = mysqlTable("anotacoesMentor", {
  id: int("id").autoincrement().primaryKey(),
  mentorId: int("mentorId").notNull().references(() => mentores.id, { onDelete: "cascade" }),
  alunoId: int("alunoId").notNull().references(() => alunos.id, { onDelete: "cascade" }),
  conteudo: text("conteudo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AnotacaoMentor = typeof anotacoesMentor.$inferSelect;
export type InsertAnotacaoMentor = typeof anotacoesMentor.$inferInsert;

/**
 * Horários de Estudo - Cronograma semanal do aluno
 */
export const horariosEstudo = mysqlTable("horariosEstudo", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").notNull().references(() => alunos.id, { onDelete: "cascade" }),
  diaSemana: int("diaSemana").notNull(), // 0=Domingo, 1=Segunda, ..., 6=Sábado
  horaInicio: varchar("horaInicio", { length: 5 }).notNull(), // Formato HH:MM
  horaFim: varchar("horaFim", { length: 5 }).notNull(), // Formato HH:MM
  materia: text("materia").notNull(),
  descricao: text("descricao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HorarioEstudo = typeof horariosEstudo.$inferSelect;
export type InsertHorarioEstudo = typeof horariosEstudo.$inferInsert;

/**
 * Controle de Conteúdos ENEM - Tracking de progresso por tópico
 */
export const controleConteudos = mysqlTable("controleConteudos", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").notNull().references(() => alunos.id, { onDelete: "cascade" }),
  topicoId: varchar("topicoId", { length: 50 }).notNull(), // ex: 'mat-1', 'bio-5'
  estudado: int("estudado").notNull().default(0), // 0=não, 1=sim (tinyint)
  questoesFeitas: int("questoesFeitas").notNull().default(0),
  questoesAcertos: int("questoesAcertos").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ControleConteudo = typeof controleConteudos.$inferSelect;
export type InsertControleConteudo = typeof controleConteudos.$inferInsert;
