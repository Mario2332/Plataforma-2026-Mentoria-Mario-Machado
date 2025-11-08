CREATE TABLE `alunos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mentorId` int NOT NULL,
	`nome` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`celular` varchar(20),
	`plano` varchar(100),
	`ativo` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alunos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anotacoesMentor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mentorId` int NOT NULL,
	`alunoId` int NOT NULL,
	`conteudo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `anotacoesMentor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `estudos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`data` timestamp NOT NULL,
	`materia` varchar(100) NOT NULL,
	`conteudo` text NOT NULL,
	`tempoMinutos` int NOT NULL DEFAULT 0,
	`questoesFeitas` int NOT NULL DEFAULT 0,
	`questoesAcertadas` int NOT NULL DEFAULT 0,
	`flashcardsRevisados` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `estudos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gestores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nome` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gestores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mentores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gestorId` int NOT NULL,
	`nome` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`nomePlataforma` text NOT NULL,
	`logoUrl` text,
	`corPrincipal` varchar(7) NOT NULL DEFAULT '#3b82f6',
	`ativo` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mentores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `simulados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`nome` text NOT NULL,
	`data` timestamp NOT NULL,
	`linguagensAcertos` int NOT NULL DEFAULT 0,
	`linguagensTempo` int NOT NULL DEFAULT 0,
	`humanasAcertos` int NOT NULL DEFAULT 0,
	`humanasTempo` int NOT NULL DEFAULT 0,
	`naturezaAcertos` int NOT NULL DEFAULT 0,
	`naturezaTempo` int NOT NULL DEFAULT 0,
	`matematicaAcertos` int NOT NULL DEFAULT 0,
	`matematicaTempo` int NOT NULL DEFAULT 0,
	`redacaoNota` int NOT NULL DEFAULT 0,
	`redacaoTempo` int NOT NULL DEFAULT 0,
	`anotacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `simulados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('gestor','mentor','aluno') NOT NULL DEFAULT 'aluno';--> statement-breakpoint
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_mentorId_mentores_id_fk` FOREIGN KEY (`mentorId`) REFERENCES `mentores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anotacoesMentor` ADD CONSTRAINT `anotacoesMentor_mentorId_mentores_id_fk` FOREIGN KEY (`mentorId`) REFERENCES `mentores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anotacoesMentor` ADD CONSTRAINT `anotacoesMentor_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `estudos` ADD CONSTRAINT `estudos_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gestores` ADD CONSTRAINT `gestores_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mentores` ADD CONSTRAINT `mentores_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mentores` ADD CONSTRAINT `mentores_gestorId_gestores_id_fk` FOREIGN KEY (`gestorId`) REFERENCES `gestores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simulados` ADD CONSTRAINT `simulados_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE cascade ON UPDATE no action;