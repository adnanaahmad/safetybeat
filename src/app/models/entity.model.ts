export interface entity {
  moduleName: string;
  name: string;
  headOffice: string;
  status: boolean;
  active: boolean;
}

export interface entityData {
  moduleName: string;
  name: string;
  headOffice: string;
  status: boolean;
  active: boolean;
}

export interface joinEntity {
  moduleName: string;
  entityCode: string;
}

export interface entityCode {
  joinCode: string;
}
