import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const conteudosRouter = router({
  // Obter progresso de todos os tópicos do aluno
  getProgresso: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Apenas alunos podem acessar o controle de conteúdos");
      }

      const aluno = await db.getAlunoByUserId(ctx.user.id);
      if (!aluno) throw new Error("Aluno não encontrado");

      const progressos = await db.getAllControleConteudosByAluno(aluno.id);
      
      // Retornar como mapa topicoId -> progresso para acesso rápido no frontend
      const progressoMap: Record<string, {
        estudado: boolean;
        questoesFeitas: number;
        questoesAcertos: number;
      }> = {};
      
      progressos.forEach(p => {
        progressoMap[p.topicoId] = {
          estudado: p.estudado === 1,
          questoesFeitas: p.questoesFeitas,
          questoesAcertos: p.questoesAcertos
        };
      });
      
      return progressoMap;
    }),

  // Atualizar progresso de um tópico
  updateProgresso: protectedProcedure
    .input(z.object({
      topicoId: z.string(),
      estudado: z.boolean().optional(),
      questoesFeitas: z.number().optional(),
      questoesAcertos: z.number().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "aluno") {
        throw new Error("Apenas alunos podem atualizar o controle de conteúdos");
      }

      const aluno = await db.getAlunoByUserId(ctx.user.id);
      if (!aluno) throw new Error("Aluno não encontrado");

      // Buscar progresso atual
      const progressoAtual = await db.getControleConteudoByAlunoAndTopico(aluno.id, input.topicoId);
      
      // Preparar dados para upsert
      const dados = {
        alunoId: aluno.id,
        topicoId: input.topicoId,
        estudado: input.estudado !== undefined ? (input.estudado ? 1 : 0) : (progressoAtual?.estudado || 0),
        questoesFeitas: input.questoesFeitas !== undefined ? input.questoesFeitas : (progressoAtual?.questoesFeitas || 0),
        questoesAcertos: input.questoesAcertos !== undefined ? input.questoesAcertos : (progressoAtual?.questoesAcertos || 0)
      };

      await db.upsertControleConteudo(dados);
      
      return { success: true };
    })
});
