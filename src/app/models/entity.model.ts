export interface entity {
    moduleName:string;
    entityData:entityData
  }

  export interface entityData {
    name: string;
    entityLocation: string;
    status: boolean
  }