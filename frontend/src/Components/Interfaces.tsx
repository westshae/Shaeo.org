interface GetGoalInterface {
    achievable: string;
    category_id: number;
    end_date_epoch: number;
    goal_id: number;
    measureable_type: string;
    measurement_count: number;
    outcome: string;
    start_date_epoch: number;
    update_ids: number | null;
    user_uuid: string;
    title: string;
    description: string;
    image: string;
}

interface CreateGoalInterface {
    category_id: number;
    start_date_epoch: number | undefined;
    end_date_epoch: number | undefined;
    outcome: string;
    measureable_type: string;
    measurement_count: number | undefined;
    achievable: string;
    update_ids: number[];
}

export type { GetGoalInterface, CreateGoalInterface }