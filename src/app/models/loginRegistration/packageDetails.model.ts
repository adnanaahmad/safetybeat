export interface Packages {
  package: PackageDetail;
  featuresAdded: Feature[];
  featuresNotAdded: Feature[];
}

export interface PackageDetail {
  id: number;
  packageName: string;
  cost: number;
  noOfUsers: number;
}

export interface Feature {
  id: number;
  name: string;
}
