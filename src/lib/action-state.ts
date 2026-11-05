export type ActionResult = {
  status: "idle" | "success" | "error";
  message: string;
  at: number;
};

export const INITIAL_ACTION_STATE: ActionResult = {
  status: "idle",
  message: "",
  at: 0,
};
