export interface entity {
  moduleName: string;
  entityData: entityData;
}

export interface entityData {
  name: string;
  headOffice: string;
  status: boolean;
}

export interface joinEntity {
  moduleName: string;
  entityCode: string;
}

export interface entityCode  {
  joinCode: string;
}
