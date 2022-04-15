
interface IContractProgramCompilationContext {
    programTemplate: string,
    templateVariables: Record<string, string>
}

export declare class ContractProgramCompilationContext implements IContractProgramCompilationContext {
    programTemplate: string;
    templateVariables: Record<string, string>;
}

