export interface Identifiable {
    readonly id: string;
}

export interface BookData {
    id: string;
    title: string;
    author: string;
    publicationYear: number;
    isBorrowed: boolean;
    borrowedByUserId: string | null;
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    borrowedBookIds: string[];
}