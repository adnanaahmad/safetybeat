import { User } from './user.model';

export interface Site{
    id: number,
    name: string,
    location: string,
    safeZone: boolean,
    siteSafetyPlan: string,
    createdBy: number,
    entity: number
}

export interface SitesInfo{
    site:Site,
    createdBy:User
}

export interface SiteAddData {
    siteName: string,
    siteAddress: string,
    safeZone: boolean,
    siteSafetyPlan: string,
}