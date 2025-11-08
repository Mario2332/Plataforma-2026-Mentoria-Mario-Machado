CREATE TABLE `controleConteudos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`topicoId` varchar(50) NOT NULL,
	`estudado` int NOT NULL DEFAULT 0,
	`questoesFeitas` int NOT NULL DEFAULT 0,
	`questoesAcertos` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `controleConteudos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `controleConteudos` ADD CONSTRAINT `controleConteudos_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE cascade ON UPDATE no action;