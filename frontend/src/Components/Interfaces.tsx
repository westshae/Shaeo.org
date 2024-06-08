interface CardInterface {
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
  

export type {CardInterface}