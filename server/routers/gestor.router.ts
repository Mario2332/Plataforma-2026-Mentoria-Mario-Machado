import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const gestorRouter = router({
  // Buscar dados do gestor logado
  me: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "gestor") {
      throw new Error("Acesso negado");
    }
    let gestor = await db.getGestorByUserId(ctx.user.id);
    
    // Se o gestor não existe, criar automaticamente
    if (!gestor) {
      await db.createGestor({
        userId: ctx.user.id,
        nome: ctx.user.name || "Gestor",
        email: ctx.user.email || "",
      });
      gestor = await db.getGestorByUserId(ctx.user.id);
    }
    
    return gestor;
  }),

  // Dashboard - métricas gerais
  getTotalAlunos: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "gestor") {
      throw new Error("Acesso negado");
    }
    return db.getTotalAlunosCount();
  }),

  // Gestão de Mentores
  getMentores: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "gestor") {
      throw new Error("Acesso negado");
    }
    let gestor = await db.getGestorByUserId(ctx.user.id);
    
    // Se o gestor não existe, criar automaticamente
    if (!gestor) {
      await db.createGestor({
        userId: ctx.user.id,
        nome: ctx.user.name || "Gestor",
        email: ctx.user.email || "",
      });
      gestor = await db.getGestorByUserId(ctx.user.id);
      if (!gestor) throw new Error("Gestor não encontrado");
    }
    return db.getMentoresByGestorId(gestor.id);
  }),

  createMentor: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        email: z.string().email(),
        nomePlataforma: z.string(),
        logoUrl: z.string().optional(),
        corPrincipal: z.string().default("#3b82f6"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "gestor") {
        throw new Error("Acesso negado");
      }
      const gestor = await db.getGestorByUserId(ctx.user.id);
      if (!gestor) throw new Error("Gestor não encontrado");
      
      // TODO: Criar usuário no sistema de autenticação
      // Por enquanto, vamos criar apenas o registro de mentor
      // Em produção, isso deve enviar um email de convite
      
      return db.createMentor({
        userId: 0, // Temporário - deve ser substituído pelo ID real do usuário
        gestorId: gestor.id,
        ...input,
      });
    }),

  updateMentor: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string().optional(),
        email: z.string().email().optional(),
        nomePlataforma: z.string().optional(),
        logoUrl: z.string().optional(),
        corPrincipal: z.string().optional(),
        ativo: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "gestor") {
        throw new Error("Acesso negado");
      }
      const { id, ...data } = input;
      return db.updateMentor(id, data);
    }),

  deleteMentor: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "gestor") {
        throw new Error("Acesso negado");
      }
      // TODO: Verificar se o mentor pertence ao gestor logado
      return db.deleteMentor(input.id);
    }),

  // Gestão de Alunos
  getAllAlunos: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "gestor") {
      throw new Error("Acesso negado");
    }
    return db.getAllAlunos();
  }),

  updateAluno: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string().optional(),
        email: z.string().email().optional(),
        mentorId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "gestor") {
        throw new Error("Acesso negado");
      }
      const { id, ...data } = input;
      return db.updateAluno(id, data);
    }),

  deleteAluno: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "gestor") {
        throw new Error("Acesso negado");
      }
      return db.deleteAluno(input.id);
    }),
});
