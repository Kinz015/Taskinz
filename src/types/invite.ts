export type Invite = {
  id: number;
  inviteeEmail: string;
  status: string;
  createdAt: string;

  project: {
    id: number;
    name: string;
  };

  inviter: {
    id: string;
    name: string | null;
    email: string | null;
  };
};
