import {TablePaginationConfig} from 'antd';
import {FilterValue} from 'antd/es/table/interface';

export type TSelectFilter = {
  value: string,
  label: string,
}

export interface INodeData {
  paginatedCalls: {
    nodes: NodesType[]
    totalCount: number,
    hasNextPage: boolean,
  };
}

export interface IPaginationParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export type NodesType = {
  key?: string;
  data: string[];
  paginatedCalls: any;
  id: string; // "unique ID of call"
  direction: string; // "inbound" or "outbound" call
  from: string; // Caller's number
  to: string; // Callee's number
  duration: number; // Duration of a call (in seconds)
  is_archived: boolean; // Boolean that indicates if the call is archived or not
  call_type: string; // The type of the call, it can be a missed, answered or voicemail.
  via: string; // Aircall number used for the call.
  created_at: string; // When the call has been made.
  notes: Note[]; // Notes related to a given call
}

type Note = {
  id: string;
  content: string;
};

export type TUserType = {
  id: string
  username: string
}