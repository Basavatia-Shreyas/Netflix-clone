import { create } from "zustand";

export interface ModalStoreInterface {
    movieId?: string;
    isOpen: boolean;
    openModal: (movideId: string) => void;
    closeModal: () => void;
};

const useInfoModal = create<ModalStoreInterface>((set) => ({
    movieId: undefined,
    isOpen: false,
    openModal: (movieId: string) => set({ isOpen: true, movieId }),
    closeModal: () => set({ isOpen: false, movieId: undefined }),
}));

export default useInfoModal;