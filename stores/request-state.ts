export type RequestStatus = "idle" | "loading" | "success" | "error";

export type RequestState = {
  status: RequestStatus;
  error: string | null;
};

export const idleRequestState: RequestState = {
  status: "idle",
  error: null,
};

