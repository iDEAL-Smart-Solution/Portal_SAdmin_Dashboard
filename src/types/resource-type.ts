export interface ResourceType {
  id: string;
  name: string;
  description: string;
}

export interface CreateResourceTypeRequest {
  name: string;
  description: string;
}

export interface UpdateResourceTypeRequest {
  id: string;
  name: string;
  description: string;
}

export interface GetResourceTypeResponse {
  id: string;
  name: string;
  description: string;
}
