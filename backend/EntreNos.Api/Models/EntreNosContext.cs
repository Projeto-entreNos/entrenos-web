using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Models;

public partial class EntreNosContext : DbContext
{
    public EntreNosContext()
    {
    }

    public EntreNosContext(DbContextOptions<EntreNosContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<Empresa> Empresas { get; set; }

    public virtual DbSet<Pacote> Pacotes { get; set; }

    public virtual DbSet<Proposta> Propostas { get; set; }

    public virtual DbSet<Servico> Servicos { get; set; }

    public virtual DbSet<Solicitaco> Solicitacoes { get; set; }

    public virtual DbSet<Universidade> Universidades { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:EntreNos");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasIndex(e => e.Nome, "UQ_Categorias_Nome").IsUnique();

            entity.Property(e => e.Nome).HasMaxLength(60);
        });

        modelBuilder.Entity<Empresa>(entity =>
        {
            entity.HasIndex(e => e.Cnpj, "UQ_Empresas_Cnpj").IsUnique();

            entity.Property(e => e.Cnpj).HasMaxLength(18);
            entity.Property(e => e.CriadaEm).HasDefaultValueSql("(sysutcdatetime())", "DF_Empresas_CriadaEm");
            entity.Property(e => e.DominioEmail).HasMaxLength(100);
            entity.Property(e => e.EmailResponsavel).HasMaxLength(254);
            entity.Property(e => e.Nome).HasMaxLength(150);
            entity.Property(e => e.Responsavel).HasMaxLength(120);
            entity.Property(e => e.StatusContrato)
                .HasMaxLength(30)
                .HasDefaultValue("Proposta enviada", "DF_Empresas_StatusContrato");

            entity.HasOne(d => d.Pacote).WithMany(p => p.Empresas)
                .HasForeignKey(d => d.PacoteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Empresas_Pacotes");
        });

        modelBuilder.Entity<Pacote>(entity =>
        {
            entity.HasIndex(e => e.Codigo, "UQ_Pacotes_Codigo").IsUnique();

            entity.Property(e => e.Beneficios).HasMaxLength(1000);
            entity.Property(e => e.Codigo).HasMaxLength(20);
            entity.Property(e => e.Descricao).HasMaxLength(200);
            entity.Property(e => e.Nome).HasMaxLength(50);
            entity.Property(e => e.PrecoPorColaborador).HasColumnType("decimal(10, 2)");

            entity.HasMany(d => d.Servicos).WithMany(p => p.Pacotes)
                .UsingEntity<Dictionary<string, object>>(
                    "PacoteServico",
                    r => r.HasOne<Servico>().WithMany()
                        .HasForeignKey("ServicoId")
                        .HasConstraintName("FK_PacoteServicos_Servicos"),
                    l => l.HasOne<Pacote>().WithMany()
                        .HasForeignKey("PacoteId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_PacoteServicos_Pacotes"),
                    j =>
                    {
                        j.HasKey("PacoteId", "ServicoId");
                        j.ToTable("PacoteServicos");
                    });
        });

        modelBuilder.Entity<Proposta>(entity =>
        {
            entity.Property(e => e.CriadaEm).HasDefaultValueSql("(sysutcdatetime())", "DF_Propostas_CriadaEm");
            entity.Property(e => e.Email).HasMaxLength(254);
            entity.Property(e => e.Empresa).HasMaxLength(150);
            entity.Property(e => e.Mensagem).HasMaxLength(1000);
            entity.Property(e => e.Nome).HasMaxLength(120);
        });

        modelBuilder.Entity<Servico>(entity =>
        {
            entity.Property(e => e.CriadoEm).HasDefaultValueSql("(sysutcdatetime())", "DF_Servicos_CriadoEm");
            entity.Property(e => e.DescricaoCompleta).HasMaxLength(1000);
            entity.Property(e => e.DescricaoCurta).HasMaxLength(200);
            entity.Property(e => e.Local).HasMaxLength(60);
            entity.Property(e => e.Modalidade).HasMaxLength(20);
            entity.Property(e => e.Nome).HasMaxLength(120);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Ativo", "DF_Servicos_Status");

            entity.HasOne(d => d.Categoria).WithMany(p => p.Servicos)
                .HasForeignKey(d => d.CategoriaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Servicos_Categorias");

            entity.HasOne(d => d.Universidade).WithMany(p => p.Servicos)
                .HasForeignKey(d => d.UniversidadeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Servicos_Universidades");
        });

        modelBuilder.Entity<Solicitaco>(entity =>
        {
            entity.HasIndex(e => new { e.UsuarioId, e.CriadaEm }, "IX_Solicitacoes_UsuarioId_CriadaEm");

            entity.HasIndex(e => new { e.UsuarioId, e.ServicoId }, "UX_Solicitacoes_AbertaPorServico")
                .IsUnique()
                .HasFilter("([Status] IN (N'Enviada', N'Em contato'))");

            entity.Property(e => e.AtualizadaEm).HasDefaultValueSql("(sysutcdatetime())", "DF_Solicitacoes_AtualizadaEm");
            entity.Property(e => e.CriadaEm).HasDefaultValueSql("(sysutcdatetime())", "DF_Solicitacoes_CriadaEm");
            entity.Property(e => e.Mensagem).HasMaxLength(300);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Enviada", "DF_Solicitacoes_Status");

            entity.HasOne(d => d.Servico).WithMany(p => p.Solicitacos)
                .HasForeignKey(d => d.ServicoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Solicitacoes_Servicos");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Solicitacos)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Solicitacoes_Usuarios");
        });

        modelBuilder.Entity<Universidade>(entity =>
        {
            entity.Property(e => e.EmailContato).HasMaxLength(254);
            entity.Property(e => e.Nome).HasMaxLength(120);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasIndex(e => e.EmpresaId, "IX_Usuarios_EmpresaId");

            entity.HasIndex(e => e.Email, "UX_Usuarios_Email")
                .IsUnique()
                .HasFilter("([RemovidoEm] IS NULL)");

            entity.HasIndex(e => e.TokenConvite, "UX_Usuarios_TokenConvite")
                .IsUnique()
                .HasFilter("([TokenConvite] IS NOT NULL)");

            entity.Property(e => e.CriadoEm).HasDefaultValueSql("(sysutcdatetime())", "DF_Usuarios_CriadoEm");
            entity.Property(e => e.Email).HasMaxLength(254);
            entity.Property(e => e.Nome)
                .HasMaxLength(120)
                .HasDefaultValue("", "DF_Usuarios_Nome");
            entity.Property(e => e.Perfil).HasMaxLength(20);
            entity.Property(e => e.SenhaHash).HasMaxLength(255);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Convidado", "DF_Usuarios_Status");
            entity.Property(e => e.TokenConvite).HasMaxLength(100);

            entity.HasOne(d => d.Empresa).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.EmpresaId)
                .HasConstraintName("FK_Usuarios_Empresas");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
