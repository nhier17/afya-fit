export type Member = {
    id: number,
    name: string,
    phone: string,
    gender: string,
    createdAt: string,
    startedAt: string,
    endedAt: string,
    status: string,
};

export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

export type Package = {
    id: string;
    name: string;
    category: 'normal' | 'offer';
    durationInDays: number;
    price: number;
};