interface IContractProgramCompilationContext {
  programTemplate: string;
  templateVariables: Record<string, unknown>;
}

export declare class ContractProgramCompilationContext
  implements IContractProgramCompilationContext {
  programTemplate: string;
  templateVariables: Record<string, unknown>;
}
