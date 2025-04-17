import { create } from "zustand";

type FLOW_USER_STAGE =
    | "waiting_for_input"
    | "waiting_for_result"
    | "displaying_result";

interface SystemFlow {
    user_flow_stage: FLOW_USER_STAGE;
    next_stage?: () => void;
    reset_stage?: () => void;
    set_stage: (
        stage: FLOW_USER_STAGE,
    ) => void;
}

const useSystemFlowStore = create<SystemFlow>()((set) => ({
    user_flow_stage: "waiting_for_input",
    next_stage: () =>
        set((state) => ({
            user_flow_stage: state.user_flow_stage === "waiting_for_input"
                ? "waiting_for_result"
                : state.user_flow_stage === "waiting_for_result"
                ? "displaying_result"
                : "waiting_for_input",
        })),
    reset_stage: () =>
        set(() => ({
            user_flow_stage: "waiting_for_input",
        })),
    set_stage: (stage) =>
        set(() => ({
            user_flow_stage: stage,
        })),
}));

export { useSystemFlowStore };
