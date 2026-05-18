export class CreateWorkflowDto {
  name: string;
  trigger: string; // e.g. 'comment_keyword'
  isActive?: boolean;

  config: {
    keywords: string[];
    dmMessage: string;
    publicReply?: string;
    delaySeconds?: number;
    replyOnce?: boolean;
  };
}

