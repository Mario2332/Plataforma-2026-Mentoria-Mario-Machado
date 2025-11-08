CREATE TABLE `horariosEstudo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`diaSemana` int NOT NULL,
	`horaInicio` varchar(5) NOT NULL,
	`horaFim` varchar(5) NOT NULL,
	`materia` text NOT NULL,
	`descricao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `horariosEstudo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `horariosEstudo` ADD CONSTRAINT `horariosEstudo_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE cascade ON UPDATE no action;