import { create } from "zustand";

type FLOW_USER_STAGE =
    | "waiting_for_input"
    | "waiting_for_result"
    | "displaying_result";

interface SystemFlow {
    user_flow_stage: FLOW_USER_STAGE;
    process_id?: string;
    reset_stage?: () => void;
    set_process_id: (id?: string) => void;
    set_stage: (
        stage: FLOW_USER_STAGE,
    ) => void;
}

const useSystemFlowStore = create<SystemFlow>()((set) => ({
    user_flow_stage: "waiting_for_input",
    process_id: undefined,
    set_process_id: (id) =>
        set(() => ({
            process_id: id,
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
