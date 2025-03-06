import {BasicGroupForm, BasicGroupInfo} from "../../../shared/model/group.model";

export interface PreScoutAssignation {
  preScoutId: number;
  status: number;
  comment?: string;
  group: BasicGroupInfo | BasicGroupForm;
  assignationDate?: Date;
}
