import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const mentorRouter = router({
  // Buscar dados do mentor logado
  me: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "mentor") {
      throw new Error("Acesso negado");
    }
    const mentor = await db.getMentorByUserId(ctx.user.id);
    return mentor;
  }),

  // Gestão de Alunos
  getAlunos: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "mentor") {
      throw new Error("Acesso negado");
    }
    const mentor = await db.getMentorByUserId(ctx.user.id);
    if (!mentor) throw new Error("Mentor não encontrado");
    return db.getAlunosByMentorId(mentor.id);
  }),

  getAlunoById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      const aluno = await db.getAlunoById(input.id);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      // Verificar se o aluno pertence ao mentor
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor || aluno.mentorId !== mentor.id) {
        throw new Error("Acesso negado");
      }
      
      return aluno;
    }),

  createAluno: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        email: z.string().email(),
        celular: z.string().optional(),
        plano: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor) throw new Error("Mentor não encontrado");
      
      // TODO: Criar usuário no sistema de autenticação
      // Por enquanto, vamos criar apenas o registro de aluno
      // Em produção, isso deve enviar um email de convite
      
      return db.createAluno({
        userId: 0, // Temporário - deve ser substituído pelo ID real do usuário
        mentorId: mentor.id,
        ...input,
      });
    }),

  updateAluno: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string().optional(),
        email: z.string().email().optional(),
        celular: z.string().optional(),
        plano: z.string().optional(),
        ativo: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      
      // Verificar se o aluno pertence ao mentor
      const aluno = await db.getAlunoById(input.id);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor || aluno.mentorId !== mentor.id) {
        throw new Error("Acesso negado");
      }
      
      const { id, ...data } = input;
      return db.updateAluno(id, data);
    }),

  deleteAluno: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      
      // Verificar se o aluno pertence ao mentor
      const aluno = await db.getAlunoById(input.id);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor || aluno.mentorId !== mentor.id) {
        throw new Error("Acesso negado");
      }
      
      return db.deleteAluno(input.id);
    }),

  // Visualizar dados de um aluno específico
  getAlunoEstudos: protectedProcedure
    .input(z.object({ alunoId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      
      // Verificar se o aluno pertence ao mentor
      const aluno = await db.getAlunoById(input.alunoId);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor || aluno.mentorId !== mentor.id) {
        throw new Error("Acesso negado");
      }
      
      return db.getEstudosByAlunoId(input.alunoId);
    }),

  getAlunoSimulados: protectedProcedure
    .input(z.object({ alunoId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      
      // Verificar se o aluno pertence ao mentor
      const aluno = await db.getAlunoById(input.alunoId);
      if (!aluno) throw new Error("Aluno não encontrado");
      
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor || aluno.mentorId !== mentor.id) {
        throw new Error("Acesso negado");
      }
      
      return db.getSimuladosByAlunoId(input.alunoId);
    }),

  // Anotações sobre alunos
  getAnotacao: protectedProcedure
    .input(z.object({ alunoId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor) throw new Error("Mentor não encontrado");
      
      return db.getAnotacaoMentor(mentor.id, input.alunoId);
    }),

  saveAnotacao: protectedProcedure
    .input(
      z.object({
        alunoId: z.number(),
        conteudo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "mentor") {
        throw new Error("Acesso negado");
      }
      const mentor = await db.getMentorByUserId(ctx.user.id);
      if (!mentor) throw new Error("Mentor não encontrado");
      
      // Verificar se o aluno pertence ao mentor
      const aluno = await db.getAlunoById(input.alunoId);
      if (!aluno || aluno.mentorId !== mentor.id) {
        throw new Error("Acesso negado");
      }
      
      return db.upsertAnotacaoMentor({
        mentorId: mentor.id,
        alunoId: input.alunoId,
        conteudo: input.conteudo,
      });
    }),
});
