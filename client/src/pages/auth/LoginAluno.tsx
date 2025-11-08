import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { COOKIE_NAME } from "@shared/const";

// Função para deletar cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
}

export default function LoginAluno() {
  const [loading, setLoading] = useState(false);

  // Estado para Login
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  });

  // Estado para Cadastro
  const [cadastroData, setCadastroData] = useState({
    nome: "",
    email: "",
    celular: "",
    senha: "",
    confirmarSenha: "",
  });

  const loginMutation = trpc.aluno.loginAluno.useMutation({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      window.location.href = "/aluno";
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao fazer login");
    }
  });

  const cadastroMutation = trpc.aluno.cadastrarAluno.useMutation({
    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso!");
      window.location.href = "/aluno";
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar conta");
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Limpar cookie antigo antes de fazer login
    deleteCookie(COOKIE_NAME);
    localStorage.clear();
    sessionStorage.clear();

    loginMutation.mutate({ email: loginData.email, senha: loginData.senha });
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cadastroData.senha !== cadastroData.confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (cadastroData.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    if (!cadastroData.nome || !cadastroData.email || !cadastroData.senha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Limpar cookie antigo antes de fazer cadastro
    deleteCookie(COOKIE_NAME);
    localStorage.clear();
    sessionStorage.clear();

    cadastroMutation.mutate({
      nome: cadastroData.nome,
      email: cadastroData.email,
      celular: cadastroData.celular || null,
      senha: cadastroData.senha,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Informações */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-10 w-10" />
            <h1 className="text-3xl font-bold">Mentoria Mário Machado</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Sua jornada rumo à aprovação no ENEM começa aqui
          </h2>
          <p className="text-lg text-blue-100 mb-12">
            Gerencie seus estudos, acompanhe seu progresso e alcance seus objetivos com nossa plataforma completa.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Cronômetro de Estudos</h3>
              <p className="text-blue-100">Registre e acompanhe cada minuto dedicado aos estudos</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Análise de Desempenho</h3>
              <p className="text-blue-100">Métricas detalhadas por matéria e área de conhecimento</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Registro de Simulados</h3>
              <p className="text-blue-100">Acompanhe sua evolução nos simulados do ENEM</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-200">
          © 2024 Mentoria Mário Machado. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Área do Aluno</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
              </TabsList>

              {/* Tab de Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      disabled={loginMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-senha">Senha</Label>
                    <Input
                      id="login-senha"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.senha}
                      onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                      required
                      disabled={loginMutation.isPending}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              {/* Tab de Cadastro */}
              <TabsContent value="cadastro">
                <form onSubmit={handleCadastro} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-nome">Nome Completo</Label>
                    <Input
                      id="cadastro-nome"
                      type="text"
                      placeholder="Seu nome"
                      value={cadastroData.nome}
                      onChange={(e) => setCadastroData({ ...cadastroData, nome: e.target.value })}
                      required
                      disabled={cadastroMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-email">Email</Label>
                    <Input
                      id="cadastro-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={cadastroData.email}
                      onChange={(e) => setCadastroData({ ...cadastroData, email: e.target.value })}
                      required
                      disabled={cadastroMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-celular">Celular (opcional)</Label>
                    <Input
                      id="cadastro-celular"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={cadastroData.celular}
                      onChange={(e) => setCadastroData({ ...cadastroData, celular: e.target.value })}
                      disabled={cadastroMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-senha">Senha</Label>
                    <Input
                      id="cadastro-senha"
                      type="password"
                      placeholder="••••••••"
                      value={cadastroData.senha}
                      onChange={(e) => setCadastroData({ ...cadastroData, senha: e.target.value })}
                      required
                      disabled={cadastroMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-confirmar">Confirmar Senha</Label>
                    <Input
                      id="cadastro-confirmar"
                      type="password"
                      placeholder="••••••••"
                      value={cadastroData.confirmarSenha}
                      onChange={(e) => setCadastroData({ ...cadastroData, confirmarSenha: e.target.value })}
                      required
                      disabled={cadastroMutation.isPending}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={cadastroMutation.isPending}>
                    {cadastroMutation.isPending ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
