export enum IncidentEventPattern {
  CREATED = 'incident.created',
  STATUS_CHANGED = 'incident.status_changed',
}

export interface IncidentCreatedEventPayload {
  incidentId: string;
  userId: string;
}

export interface IncidentStatusChangedEventPayload {
  incidentId: string;
  userId: string;
  oldStatus: string;
  newStatus: string;
  comment?: string;
}
