import enum


class RoleEnum(str, enum.Enum):
    CONTRATANTE = "contratante"
    FORNECEDOR = "fornecedor"
    ASSESSOR = "assessor"
    ADMIN = "admin"


class EventTypeEnum(str, enum.Enum):
    CASAMENTO = "casamento"
    NOIVADO = "noivado"
    ANIVERSARIO = "aniversario"
    BATIZADO = "batizado"
    CORPORATIVO = "corporativo"
    TEMATICA = "tematica"
    FORMATURA = "formatura"
    CONFERENCIA = "conferencia"
    GALA = "gala"
    OUTRO = "outro"


class VenueStatusEnum(str, enum.Enum):
    CONFIRMADO = "confirmado"
    NEGOCIACAO = "negociacao"
    PROCURAR = "procurar"


class EventPhaseEnum(str, enum.Enum):
    ONBOARDING = "onboarding"
    BRIEFING = "briefing"
    PLANEJAMENTO = "planejamento"
    CONTRATACAO = "contratacao"
    FINALIZACAO = "finalizacao"


class ModerationStatusEnum(str, enum.Enum):
    PENDENTE = "pendente"
    APROVADO = "aprovado"
    REJEITADO = "rejeitado"


class QuoteRequestStatusEnum(str, enum.Enum):
    ABERTO = "aberto"
    RESPONDIDO = "respondido"
    EXPIRADO = "expirado"


class ProposalStatusEnum(str, enum.Enum):
    ACEITA = "aceita"
    ANALISE = "analise"
    CONTRATO = "contrato"
    REVISAO = "revisao"
    FINALIZADA = "finalizada"
    RECUSADA = "recusada"


class ServiceStatusEnum(str, enum.Enum):
    CONFIRMADO = "confirmado"
    ANDAMENTO = "andamento"
    CONCLUIDO = "concluido"
    CANCELADO = "cancelado"


class EscrowStatusEnum(str, enum.Enum):
    GARANTIDO = "garantido"
    QUITADO = "quitado"
    AGUARDANDO = "aguardando"
    CANCELADO = "cancelado"


class PayoutStatusEnum(str, enum.Enum):
    TRANSFERIDO = "transferido"
    PENDENTE = "pendente"
    ANALISE = "analise"


class CommissionStatusEnum(str, enum.Enum):
    PENDENTE = "pendente"
    CONFIRMADA = "confirmada"
    PAGA = "paga"


class DisputeCategoryEnum(str, enum.Enum):
    SERVICO_NAO_ENTREGUE = "servico_nao_entregue"
    QUALIDADE_ABAIXO = "qualidade_abaixo"
    ATRASO_DESCUMPRIMENTO = "atraso_descumprimento"
    COBRANCA_INDEVIDA = "cobranca_indevida"
    CANCELAMENTO_UNILATERAL = "cancelamento_unilateral"
    DANOS_MATERIAIS = "danos_materiais"
    OUTRO = "outro"


class DisputeSeverityEnum(str, enum.Enum):
    BAIXO = "baixo"
    MEDIO = "medio"
    CRITICO = "critico"


class DisputeStatusEnum(str, enum.Enum):
    ABERTA = "aberta"
    EM_ANALISE = "em_analise"
    RESOLVIDA = "resolvida"
    CANCELADA = "cancelada"


class DisputeResolutionEnum(str, enum.Enum):
    TOTAL = "total"
    PARCIAL = "parcial"
    REEXECUCAO = "reexecucao"


class MessageStatusEnum(str, enum.Enum):
    ENTREGUE = "entregue"
    ENVIADA = "enviada"
    LIDA = "lida"


class PlanRoleEnum(str, enum.Enum):
    FORNECEDOR = "fornecedor"
    ASSESSOR = "assessor"


class BillingCycleEnum(str, enum.Enum):
    MENSAL = "mensal"
    ANUAL = "anual"


class SubscriptionStatusEnum(str, enum.Enum):
    TRIAL = "trial"
    ATIVA = "ativa"
    INADIMPLENTE = "inadimplente"
    CANCELADA = "cancelada"
