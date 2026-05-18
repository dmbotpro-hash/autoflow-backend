export class UpdateWorkflowDto {
  name?: string;
  isActive?: boolean;
  config?: {
    keywords: string[];
    dmMessage: string;
    publicReply?: string;
    delaySeconds?: number;
    replyOnce?: boolean;
  };
}

