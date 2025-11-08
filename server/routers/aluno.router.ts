import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const alunoRouter = router({
  // Buscar dados do aluno logado
  me: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "aluno") {
      throw new Error("Acesso negado");
    }
    let aluno = await db.getAlunoByUserId(ctx.user.id);
    
    // Se o aluno não existe, criar automaticamente
    if (!aluno) {
      await db.createAluno({
        userId: ctx.user.id,
        nome: ctx.user.name || "Aluno",
        email: ctx.user.email || "",
        celular: "",
        mentorId: 1, // Mentor padrão - pode ser ajustado depois
      });
      aluno = await db.getAlunoByUserId(ctx.user.id);
    }
    
    return aluno;
  }),

  // Estudos
  getEstudos: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "aluno") {
      throw new Error("Acesso negado");
    }
    const aluno = await db.getAlunoByUserId(ctx.user.id);
    if (!aluno) throw new Error("Aluno não encontrado");
    return db.getEstudosByAlunoId(aluno.id);
  }),

  createEstudo: protectedProcedure
    .input(
      z.object({
        data: z.date(),
        materia: z.string(),
        conteudo: z.string(),
        tempoMinutos: z.number(),
        questoesFeitas: z.number(),
        questoesAcertadas: z.number(),
        flashcardsRevisados: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      const aluno = await db.getAlunoByUserId(ctx.user.id);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      return db.createEstudo({
        alunoId: aluno.id,
        ...input,
      });
    }),

  updateEstudo: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.date().optional(),
        materia: z.string().optional(),
        conteudo: z.string().optional(),
        tempoMinutos: z.number().optional(),
        questoesFeitas: z.number().optional(),
        questoesAcertadas: z.number().optional(),
        flashcardsRevisados: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      const { id, ...data } = input;
      return db.updateEstudo(id, data);
    }),

  deleteEstudo: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      return db.deleteEstudo(input.id);
    }),

  // Simulados
  getSimulados: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "aluno") {
      throw new Error("Acesso negado");
    }
    const aluno = await db.getAlunoByUserId(ctx.user.id);
    if (!aluno) throw new Error("Aluno não encontrado");
    return db.getSimuladosByAlunoId(aluno.id);
  }),

  createSimulado: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        data: z.date(),
        linguagensAcertos: z.number(),
        linguagensTempo: z.number(),
        humanasAcertos: z.number(),
        humanasTempo: z.number(),
        naturezaAcertos: z.number(),
        naturezaTempo: z.number(),
        matematicaAcertos: z.number(),
        matematicaTempo: z.number(),
        redacaoNota: z.number(),
        redacaoTempo: z.number(),
        anotacoes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      const aluno = await db.getAlunoByUserId(ctx.user.id);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      return db.createSimulado({
        alunoId: aluno.id,
        ...input,
      });
    }),

  updateSimulado: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string().optional(),
        data: z.date().optional(),
        linguagensAcertos: z.number().optional(),
        linguagensTempo: z.number().optional(),
        humanasAcertos: z.number().optional(),
        humanasTempo: z.number().optional(),
        naturezaAcertos: z.number().optional(),
        naturezaTempo: z.number().optional(),
        matematicaAcertos: z.number().optional(),
        matematicaTempo: z.number().optional(),
        redacaoNota: z.number().optional(),
        redacaoTempo: z.number().optional(),
        anotacoes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      const { id, ...data } = input;
      return db.updateSimulado(id, data);
    }),

  deleteSimulado: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      return db.deleteSimulado(input.id);
    }),

  // Horários de Estudo
  getHorarios: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "aluno") {
      throw new Error("Acesso negado");
    }
    const aluno = await db.getAlunoByUserId(ctx.user.id);
    if (!aluno) throw new Error("Aluno não encontrado");
    return db.getHorariosByAlunoId(aluno.id);
  }),

  criarHorario: protectedProcedure
    .input(
      z.object({
        diaSemana: z.number().min(0).max(6),
        horaInicio: z.string(),
        horaFim: z.string(),
        materia: z.string(),
        descricao: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      const aluno = await db.getAlunoByUserId(ctx.user.id);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      return db.createHorario({
        alunoId: aluno.id,
        ...input,
      });
    }),

  atualizarHorario: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        diaSemana: z.number().min(0).max(6).optional(),
        horaInicio: z.string().optional(),
        horaFim: z.string().optional(),
        materia: z.string().optional(),
        descricao: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      const { id, ...data } = input;
      return db.updateHorario(id, data);
    }),

  deletarHorario: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      return db.deleteHorario(input.id);
    }),

  // Atualizar perfil do aluno
  updateProfile: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        email: z.string().email(),
        celular: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Acesso negado");
      }
      const aluno = await db.getAlunoByUserId(ctx.user.id);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      return db.updateAluno(aluno.id, input);
    }),
});
